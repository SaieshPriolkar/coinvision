// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node
// utils/generateQuiz.ts

import { GoogleGenAI } from '@google/genai';

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export async function generateQuiz(): Promise<QuizQuestion[]> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
  });

  const model = 'gemini-2.5-pro'; // Use 'gemini-2.5-pro' if available to you

  const prompt = `Generate 5 multiple-choice questions about world currencies. 
Each question should have:
- a "question" field (string),
- an "options" field (array of 4 strings),
- an "answer" field (the correct option from the options array).
Return the result as a valid JSON array. Do not include any extra explanation or text before or after the array. Format:
[
  {
    "question": "Which country uses the Yen?",
    "options": ["China", "Japan", "Thailand", "Vietnam"],
    "answer": "Japan"
  },
  ...
]`;

  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const result = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  // Extract JSON content safely
  const jsonStart = text.indexOf('[');
  const jsonEnd = text.lastIndexOf(']');
  const jsonText = text.substring(jsonStart, jsonEnd + 1);

  try {
    const parsed = JSON.parse(jsonText) as QuizQuestion[];
    return parsed;
  } catch (error) {
    console.error('Error parsing quiz response:', error);
    throw new Error('Invalid quiz format returned from Gemini');
  }
}