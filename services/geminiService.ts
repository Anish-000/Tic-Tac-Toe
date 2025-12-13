import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const isApiKeyAvailable = (): boolean => !!apiKey;

/**
 * Fast responses using Flash Lite
 */
export const getFastStrategyAdvice = async (boardState: string, lastMove: string): Promise<string> => {
  try {
    const model = 'gemini-flash-lite-latest';
    const prompt = `
      You are a Tic-Tac-Toe expert.
      Current Board State (0-8): ${boardState}
      Last Move: ${lastMove}
      
      Give a very short, punchy 1-sentence tip to the current player. Be witty.
    `;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    
    return response.text || "Keep your eyes on the corners!";
  } catch (error) {
    console.error("Fast AI Error:", error);
    return "Focus on the center square!";
  }
};

/**
 * Deep thinking response using Gemini 3 Pro
 */
export const getDeepAnalysis = async (boardState: string): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `
      Analyze this Tic-Tac-Toe board state deeply.
      Board: ${boardState}
      
      Explain the best possible strategy for the current player to ensure a win or draw. 
      Think step-by-step about possible future moves.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max budget for deep reasoning
      }
    });

    return response.text || "Analysis failed. Try to control the center and corners.";
  } catch (error) {
    console.error("Thinking AI Error:", error);
    return "Unable to perform deep analysis at this moment.";
  }
};

/**
 * Image Editing using Gemini 2.5 Flash Image
 * The user provides a base64 image and a prompt to edit it.
 */
export const editGameTheme = async (imageBase64: string, prompt: string): Promise<string | null> => {
  try {
    // We use the 'gemini-2.5-flash-image' model (Nano banana) for editing tasks
    const model = 'gemini-2.5-flash-image';
    
    // Remove header if present for raw base64
    const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          },
          {
            text: `Edit this image to match the following description: ${prompt}. Keep the aspect ratio.`
          }
        ]
      }
    });

    // Extract the image from the response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};
