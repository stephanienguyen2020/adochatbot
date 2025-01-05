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
import { vectorStore } from "./vectorstore";
import { toolsCondition } from "@langchain/langgraph/prebuilt";
import { SYSTEM_PROMPT } from "@prompts";

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
    description: "Retrieve information about MarginFi related to a query.",
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
  return { messages: [response] };
}

// Step 2: Generate final response
async function generate(state: typeof MessagesAnnotation.State) {
  const recentToolMessages = state.messages
    .slice()
    .reverse()
    .filter((msg): msg is ToolMessage => msg instanceof ToolMessage);

  const docsContent = recentToolMessages.map((doc) => doc.content).join("\n");
  const systemMessageContent = `${SYSTEM_PROMPT}\n\nContext:\n${docsContent}`;

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
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", toolsCondition, {
    __end__: "__end__",
    agent: "agent",
  })
  .addEdge("agent", "generate")
  .addEdge("generate", "__end__");

// Create memory saver for chat history
const checkpointer = new MemorySaver();

// Compile graph with memory
export const ragChain = graphBuilder.compile({ checkpointer });

// Thread configuration for chat history
export const threadConfig = {
  configurable: { thread_id: "default" },
  streamMode: "values" as const,
};

// Helper function to create a new thread ID
export function generateThreadId() {
  return `thread_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

// Helper function to get chat history
export async function getChatHistory(threadId: string) {
  return await checkpointer.get({ configurable: { thread_id: threadId } });
}
