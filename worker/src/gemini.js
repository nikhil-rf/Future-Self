// worker/src/gemini.js
// Wraps the Google Generative AI SDK to generate nudge messages.

import { GoogleGenerativeAI } from '@google/generative-ai';

let _client = null;

function getClient() {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY is not set');
    _client = new GoogleGenerativeAI(apiKey);
  }
  return _client;
}

/**
 * @param {object} [ctx] - sequenceIndex, sequenceTotal, untilDeadline
 */
export async function generateNudgeMessage(note, importance, daysAgo, ctx) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const seq =
    ctx && ctx.sequenceTotal > 1
      ? `This is email ${ctx.sequenceIndex} of ${ctx.sequenceTotal} in this reminder series (leading up to their deadline). Time context: ${ctx.untilDeadline}.\n`
      : '';

  const prompt =
    `${seq}` +
    `The user wrote this note to their future self ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago: "${note}"\n` +
    `Importance level: ${importance}\n` +
    `Write a short, warm, motivating nudge message (max 3 sentences) reminding them about this.\n` +
    `Be personal, not robotic. Reference the time that has passed and where they are in their journey. Do not use emojis excessively.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
