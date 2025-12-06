import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateExplanation(topic: string, factor: number): Promise<string> {
  const ai = getAI();
  const prompt = `
    Explain the mathematical concept of an "${topic}" clock where the spacing factor is approximately ${factor} (where 1 is linear, <1 is logarithmic, >1 is exponential/antilog).
    
    1. Briefly explain how the angles are calculated relative to standard time.
    2. Provide a short "How to read it" guide.
    3. Give 1 fun fact about non-linear time scales or logarithmic scales.
    
    Keep it concise, scientific but accessible. Use Markdown formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Failed to generate explanation.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
}

export async function generateClockConcept(prompt: string, highQuality: boolean = false): Promise<string | null> {
  const ai = getAI();
  const model = highQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';

  try {
    // For Image generation, we use generateContent but inspect the parts for inlineData or base64
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: highQuality ? {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      } : undefined
    });

    // Check for inlineData in parts (standard for some models)
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
}
