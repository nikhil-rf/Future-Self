import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateNudgeMessage(
  note: string,
  importance: string,
  daysAgo: number
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `The user wrote this note to their future self ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago: "${note}"
Importance level: ${importance}
Write a short, warm, motivating nudge message (max 3 sentences) reminding them about this.
Be personal, not robotic. Reference the time that has passed. Do not use emojis excessively.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
