export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { idea } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Missing idea in request body.' });
    }

    // Get the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not set.');
      return res.status(500).json({ error: 'Server configuration error: Missing API Key.' });
    }

    const promptText = `
You are an expert startup evaluator and venture capitalist. 
Evaluate the following startup idea and return the response STRICTLY as a valid JSON object. Do NOT wrap it in markdown code blocks. Do not add any extra text or conversational filler.
The JSON object must have exactly these four keys:
"audience": (string) Describe the target audience in 1-2 sentences.
"demand": (string) Describe the potential market demand in 1-2 sentences.
"monetization": (string) Suggest the best monetization strategies in 1-2 sentences.
"risks": (string) Identify the biggest risks and challenges in 1-2 sentences.

Startup Idea: "${idea}"
    `;

    // Make the actual call to the AI provider
    const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://founderlens.vercel.app", // Optional placeholder for Vercel
        "X-Title": "FounderLens Validation Tool",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-3.5-turbo", // You can use other models here
        "messages": [
          { "role": "system", "content": "You are a helpful startup advisor that outputs strictly valid JSON." },
          { "role": "user", "content": promptText }
        ]
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      throw new Error(`AI API Request failed (${aiResponse.status}): ${errorData.error?.message || aiResponse.statusText}`);
    }

    const data = await aiResponse.json();
        
    if (!data.choices || data.choices.length === 0) {
      throw new Error("No response received from the AI.");
    }

    let content = data.choices[0].message.content.trim();
    
    // Strip out markdown code blocks if the model mistakenly included them
    if (content.startsWith('```')) {
        content = content.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    // Attempt to parse the content to ensure it's valid JSON before sending it back
    let parsedAnalysis;
    try {
        parsedAnalysis = JSON.parse(content);
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", content);
        throw new Error("The AI returned a malformed response.");
    }

    // Send the structured analysis back to the frontend
    return res.status(200).json(parsedAnalysis);

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return res.status(500).json({ error: error.message || 'An unexpected error occurred during analysis.' });
  }
}
