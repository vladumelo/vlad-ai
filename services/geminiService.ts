import { GoogleGenAI } from "@google/genai";

// Initialize the client
// Note: API_KEY is injected via the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string.
 */
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generates a new background for the provided image using Gemini.
 */
export const generateMillionkaStyle = async (
  imageFile: File,
  customPrompt?: string
): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    // Specific prompt to target the Millionka aesthetic
    const basePrompt = customPrompt || "Change the background to the historic Millionka district in Vladivostok. Old red brick buildings, narrow alleyways, historic 19th-century architecture, atmospheric lighting, cobblestone streets. Keep the person in the foreground exactly as is, realistic style.";
    
    const model = 'gemini-2.5-flash-image'; // Good for general editing/generation

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          imagePart,
          { text: basePrompt }
        ]
      },
    });

    // Extract image from response
    // The response might contain multiple parts, we look for inlineData or text
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
