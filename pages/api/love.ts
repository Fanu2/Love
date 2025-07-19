import type { NextApiRequest, NextApiResponse } from 'next';
import { Mistral } from '@mistralai/mistralai'; // Corrected import statement

type ResponseData = {
  answer?: string;
  error?: string;
};

// Initialize the Mistral client globally or outside the handler for efficiency
const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY || '', // Using || '' is common and works fine
  // Or, if you prefer the bracket notation and nullish coalescing:
  // apiKey: process.env["MISTRAL_API_KEY"] ?? "",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  try {
    // Use the updated chat.complete method
    const response = await mistral.chat.complete({
      model: 'mistral-tiny', // You can change this to "mistral-small-latest" as per your example
      messages: [{ role: 'user', content: prompt }],
    });

    // The response structure might be slightly different;
    // ensure you're accessing the content correctly.
    // Based on their examples, it's typically response.choices[0].message.content
    const content = response.choices?.[0]?.message?.content;

    if (content) {
      res.status(200).json({ answer: content });
    } else {
      res.status(500).json({ error: 'No answer received from Mistral.' });
    }
  } catch (err) {
    console.error("Error calling Mistral API:", err); // More descriptive error log
    res.status(500).json({ error: 'Failed to get answer from Mistral API.' });
  }
}
