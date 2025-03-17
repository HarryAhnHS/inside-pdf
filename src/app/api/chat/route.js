import { NextResponse } from "next/server";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request) {
  try {
    console.log("Chat API: Received request");
    const { messages, pageText, fullPdfText, pageNumber } = await request.json();
    console.log("Chat API: Messages:", messages);

    if (!messages || !Array.isArray(messages)) {
      console.log("Chat API: Invalid messages format");
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.NEXT_PUBLIC_GROQ_API_KEY) {
      console.error("Chat API: Groq API key is missing");
      return NextResponse.json(
        { error: "Groq API key is not configured" },
        { status: 500 }
      );
    }

    console.log("Chat API: Making Groq request");
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are an AI assistant that ONLY answers questions about the following pdf with this full text:\n\n${fullPdfText}\n\n. 
            The current page on that pdf has this text:\n\n${pageText}\n\n and that page number is ${pageNumber}. 
            You can determine the page number of the text by looking at the "--- Page # ---" divider marked at the start of each page's text.
            If the question is unrelated, respond with "I can only answer questions about the given text."`
          },
          ...messages
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Groq API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Chat API: Received Groq response");

    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code,
      status: error.status
    });
    return NextResponse.json(
      { 
        error: "Failed to process chat request", 
        details: error.message,
        type: error.type,
        code: error.code
      },
      { status: 500 }
    );
  }
}
