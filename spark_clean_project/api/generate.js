import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  const { brand, product, audience, idea, tone, output } = req.body;

  const formattedTone = tone?.length ? tone.join(" and ") : "a suitable";
  const normalizedOutput = Array.isArray(output) ? output : [output];

  const context = `You are Dan, an expert advertising copywriter created by a creative agency. Your tone is sharp, insightful, and creative. You are named in tribute to Dan Wieden of Wieden+Kennedy. Create copy for ${brand}, a brand offering ${product}, targeting ${audience}. The core idea of the campaign is: ${idea}. Use ${formattedTone} tone in your writing.`;

  const prompt = `${context}

Please generate markdown-formatted advertising content based on the selected outputs. Include ONLY the following sections, clearly labeled and in this exact order if selected:

1. **KV Headline**
2. **OOH Headlines** (provide 5 distinct headline options)
3. **Manifesto**
4. **Body Copy**

Do NOT include fallback content, commentary, or social media. Only return the requested sections in clean markdown format. End the output with a subtle sign-off: '— Dan'`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4"
    });

    res.status(200).json({ result: chatCompletion.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while generating content." });
  }
}
