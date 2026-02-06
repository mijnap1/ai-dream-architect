
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { DreamAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeDream = async (content: string): Promise<DreamAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this dream content and return a structured JSON interpretation: "${content}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          interpretation: { type: Type.STRING, description: "A psychological and metaphorical interpretation of the dream." },
          mood: { type: Type.STRING, enum: ['peaceful', 'tense', 'surreal', 'joyful', 'fearful', 'mysterious'] },
          symbols: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key symbols found in the dream." },
          lucidityScore: { type: Type.INTEGER, description: "How clear/vivid the dream was (1-10)." },
          themes: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Universal themes like 'flying', 'falling', 'searching'." },
          imagePrompt: { type: Type.STRING, description: "A high-quality, artistic, surrealistic prompt to generate an image of this dream scene." },
        },
        required: ["interpretation", "mood", "symbols", "lucidityScore", "themes", "imagePrompt"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const generateDreamImage = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A cinematic, ethereal, surrealistic digital art piece illustrating: ${prompt}` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to generate image");
};
