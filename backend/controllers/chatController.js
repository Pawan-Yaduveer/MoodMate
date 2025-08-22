const Groq = require('groq-sdk');
const asyncHandler = require('../middleware/asyncHandler.js');

const chatWithAI = asyncHandler(async (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ message: 'Message is required' });
  }

  const systemPrompt = `You are MoodMate, a supportive mental wellness assistant. 
  
  Your role:
  - Provide empathetic, practical mental health support
  - Offer evidence-based wellness tips and coping strategies
  - Be concise, kind, and non-judgmental
  - If someone is in crisis, encourage professional help
  - Focus on mood improvement and emotional well-being
  
  Keep responses under 150 words and always be supportive.`;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'GROQ_API_KEY is not configured on the server' });
  }

  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama3-8b-8192', // Fast and cost-effective model
      temperature: 0.7,
      max_tokens: 300,
      top_p: 0.9,
    });

    const aiMessage = completion?.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    res.json({ 
      reply: aiMessage,
      model: 'llama3-8b-8192',
      provider: 'Groq'
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    
    if (error.status === 401) {
      return res.status(500).json({ message: 'Invalid Groq API key' });
    } else if (error.status === 429) {
      return res.status(500).json({ message: 'Rate limit exceeded. Please try again later.' });
    } else {
      return res.status(500).json({ message: 'AI service temporarily unavailable' });
    }
  }
});

module.exports = { chatWithAI };