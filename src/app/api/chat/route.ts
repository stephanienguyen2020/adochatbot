import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { StateGraph } from "@langchain/langgraph";
import { MessagesAnnotation } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import { vectorStore, initializeVectorStore } from "@/lib/vectorstore";
import { toolsCondition } from "@langchain/langgraph/prebuilt";
import { SYSTEM_PROMPT, RESPONSE_GUIDELINES } from "@prompts";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize the vector store when the API route module loads
initializeVectorStore().catch(console.error);

// Initialize the LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
});

// Define the retrieval tool schema
const retrieveSchema = z.object({ query: z.string() });

// Create the retrieval tool
const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
    const serialized = retrievedDocs
      .map((doc) => `Content: ${doc.pageContent}`)
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description:
      "Retrieve information about Andromeda Protocol and ADOs from documentation.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

// Create the RAG agent
const agent = createReactAgent({
  llm,
  tools: [retrieve],
});

// Step 1: Agent planning and execution
async function agentStep(state: typeof MessagesAnnotation.State) {
  const response = await agent.invoke(state.messages);
  // Ensure we return an object with a messages array
  return {
    messages: Array.isArray(response) ? response : [response],
  };
}

// Step 2: Generate final response
async function generate(state: typeof MessagesAnnotation.State) {
  const recentToolMessages = state.messages
    .slice()
    .reverse()
    .filter((msg): msg is ToolMessage => msg instanceof ToolMessage);

  const docsContent = recentToolMessages.map((doc) => doc.content).join("\n");
  const systemMessageContent = `${SYSTEM_PROMPT}

Context:
${docsContent}

${RESPONSE_GUIDELINES}`;

  const conversationMessages = state.messages.filter(
    (message) =>
      message instanceof HumanMessage ||
      message instanceof SystemMessage ||
      (message instanceof AIMessage && !message.tool_calls?.length)
  );

  const prompt = [
    new SystemMessage(systemMessageContent),
    ...conversationMessages,
  ];

  const response = await llm.invoke(prompt);
  return { messages: [response] };
}

// Create and compile the graph
const graphBuilder = new StateGraph(MessagesAnnotation)
  .addNode("agent", agentStep)
  .addNode("generate", generate)
  .addEdge("__start__", "generate") // Start directly with generate
  .addConditionalEdges("generate", toolsCondition, {
    __end__: "__end__",
    agent: "agent",
  })
  .addEdge("agent", "generate");

// Create memory saver for chat history
const checkpointer = new MemorySaver();

// Compile graph with memory
const ragChain = graphBuilder.compile({ checkpointer });

// Thread configuration for chat history
const threadConfig = {
  configurable: { thread_id: "default" },
  streamMode: "values" as const,
};

// Helper function to create a new thread ID
function generateThreadId() {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Initialize OpenAI for streaming
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Initialize vector store if needed
    await initializeVectorStore().catch((error) => {
      console.error("Vector store initialization failed:", error);
      throw new Error("Failed to initialize vector store");
    });

    // Use the RAG chain instead of direct LLM
    const result = await ragChain.invoke(
      {
        messages: [new HumanMessage(message)],
      },
      {
        configurable: { thread_id: generateThreadId() },
      }
    );

    // Get the final response
    const finalResponse = result.messages[result.messages.length - 1];

    // Return the response
    return new NextResponse(
      `data: ${JSON.stringify({
        message: {
          content: {
            parts: [finalResponse.content],
          },
        },
      })}\n\n`,
      {
        headers: {
          "Content-Type": "text/event-stream",
          Connection: "keep-alive",
          "Cache-Control": "no-cache, no-transform",
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
