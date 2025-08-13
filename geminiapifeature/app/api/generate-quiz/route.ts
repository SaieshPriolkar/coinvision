import { NextResponse } from "next/server";
import { generateQuiz } from "@/utils/generateQuiz";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await generateQuiz();
  return NextResponse.json(result);
}
