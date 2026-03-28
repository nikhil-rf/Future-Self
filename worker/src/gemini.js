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
 * Generates a warm, personal nudge message from Gemini.
 * @param {string} note        - The user's original reminder note
 * @param {string} importance  - 'High' | 'Medium' | 'Low'
 * @param {number} daysAgo     - How many days ago the reminder was created
 * @returns {Promise<string>}  - The generated letter text
 */
export async function generateNudgeMessage(note, importance, daysAgo) {
  const client = getClient();
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt =
    `The user wrote this note to their future self ${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago: "${note}"\n` +
    `Importance level: ${importance}\n` +
    `Write a short, warm, motivating nudge message (max 3 sentences) reminding them about this.\n` +
    `Be personal, not robotic. Reference the time that has passed. Do not use emojis excessively.`;

  const result   = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
