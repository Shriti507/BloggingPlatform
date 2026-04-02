import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_INPUT_CHARS = 12000;

export async function POST(request) {
  try {
    const body = await request.json();
    const content = body.content || "";

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API setup" }, { status: 500 });
    }

    const modelId = process.env.GOOGLE_AI_MODEL || "gemini-2.0-flash";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelId });

    const trimmed =
      content.length > MAX_INPUT_CHARS
        ? `${content.slice(0, MAX_INPUT_CHARS)}\n\n[truncated]`
        : content;

    const prompt = `Write a clear, engaging summary of the following article in about 200 words (180–220 words). Use plain prose, no bullet list unless essential. Do not include a title line.\n\n---\n${trimmed}`;

    const result = await model.generateContent(prompt);
    const text = result.response?.text?.();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Empty summary" }, { status: 500 });
    }

    return NextResponse.json({ summary: text.trim() });
  } catch (error) {
    console.error("AI Summary Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
