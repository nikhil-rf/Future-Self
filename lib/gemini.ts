import { GoogleGenerativeAI } from '@google/generative-ai';
import type { NudgeContext } from '@/lib/reminderSchedule';

export type { NudgeContext } from '@/lib/reminderSchedule';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateNudgeMessage(
  note: string,
  importance: string,
  daysAgo: number,
  ctx?: NudgeContext
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const seq =
    ctx && ctx.sequenceTotal > 1
      ? `This is email ${ctx.sequenceIndex} of ${ctx.sequenceTotal} in this reminder series (leading up to their deadline). Time context: ${ctx.untilDeadline}.\n`
      : '';

  const prompt = `${seq}The user wrote this note to their future self ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago: "${note}"
Importance level: ${importance}
Write a short, warm, motivating nudge message (max 3 sentences) reminding them about this.
Be personal, not robotic. Reference the time that has passed and where they are in their journey. Do not use emojis excessively.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
