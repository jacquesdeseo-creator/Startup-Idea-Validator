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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set.');
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

    // Make the actual call to the Gemini API
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "systemInstruction": {
          "parts": [{"text": "You are a helpful startup advisor that outputs strictly valid JSON."}]
        },
        "contents": [{
          "parts": [{"text": promptText}]
        }]
      })
    });

    if (!aiResponse.ok) {
      const errorData = await aiResponse.json().catch(() => ({}));
      throw new Error(`Gemini API Request failed (${aiResponse.status}): ${errorData.error?.message || aiResponse.statusText}`);
    }

    const data = await aiResponse.json();
        
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response received from Gemini.");
    }

    let content = data.candidates[0].content.parts[0].text.trim();
    
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
