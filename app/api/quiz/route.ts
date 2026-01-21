import { NextResponse } from "next/server";
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const prompt = `
You are an API that ONLY returns JSON.

Generate EXACTLY 5 multiple-choice questions on the topic "${topic}".

Return STRICT JSON in this format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Option A"
    }
  ]
}
`;

    const result = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt,
    });

    const text = result.text.trim();
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    const parsed = JSON.parse(text.slice(start, end));

    return NextResponse.json({ questions: parsed.questions });
  } catch (error) {
    console.error("QUIZ API ERROR:", error);
    return NextResponse.json({ questions: [] });
  }
}
