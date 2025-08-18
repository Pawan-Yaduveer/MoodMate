import OpenAI from 'openai';
import asyncHandler from '../middleware/asyncHandler.js';

export const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required' });
  }

  const systemPrompt = 'You are MoodMate, a supportive mental wellness assistant. Be concise, kind, and practical.';

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'OPENAI_API_KEY is not configured on the server' });
  }

  const openai = new OpenAI({ apiKey });
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
    temperature: 0.7,
  });

  const aiMessage = completion?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

  res.json({ reply: aiMessage });
});

