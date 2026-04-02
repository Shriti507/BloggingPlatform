import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_INPUT_CHARS = 12000;

/**
 * ~200-word summary; single call per post create.
 * @param {string} postBody
 * @returns {Promise<string>}
 */
export async function generatePostSummary(postBody) {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }

  const modelId = process.env.GOOGLE_AI_MODEL || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelId });

  const trimmed =
    postBody.length > MAX_INPUT_CHARS
      ? `${postBody.slice(0, MAX_INPUT_CHARS)}\n\n[truncated]`
      : postBody;

  const prompt = `Write a clear, engaging summary of the following article in about 200 words (180–220 words). Use plain prose, no bullet list unless essential. Do not include a title line.\n\n---\n${trimmed}`;

  const result = await model.generateContent(prompt);
  const text = result.response?.text?.();
  if (!text || !text.trim()) {
    throw new Error("Empty summary from model");
  }
  return text.trim();
}
