import { OpenAI } from "openai";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "./prompts";
import { vectorStore, performSimilaritySearch } from "@/lib/vectorstore";

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

    const encoder = new TextEncoder();
    let fullResponse = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              { role: "user", content: message },
            ],
            stream: true,
          });

          for await (const chunk of completion) {
            try {
              const content = chunk.choices[0].delta?.content || "";
              fullResponse += content;

              const sseData = JSON.stringify({
                message: {
                  content: { parts: [fullResponse] },
                },
              });

              controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));

              if (chunk.choices[0].finish_reason === "stop") {
                controller.close();
                break;
              }
            } catch (err) {
              console.error("Error processing chunk:", err);
              controller.error(err);
              break;
            }
          }
        } catch (err) {
          console.error("Error in OpenAI stream:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
