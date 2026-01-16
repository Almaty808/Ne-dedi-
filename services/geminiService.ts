import { GoogleGenAI, Type } from "@google/genai";
import { TranslationMode, TranslationResult, AppLanguage } from "../types";

export const getTranslation = async (text: string, mode: TranslationMode, lang: AppLanguage): Promise<TranslationResult> => {
  // Always use the environment variable directly as per guidelines.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageNames = {
    en: "English",
    ru: "Russian (Русский)",
    kk: "Kazakh (Қазақша)"
  };

  const systemInstruction = `
    You are a witty, humorous relationship expert who specializes in "translating" between men and women.
    Your goal is to take a phrase typically said by one gender and explain what it *actually* means to the other, 
    playing on common relationship tropes.
    
    IMPORTANT: Your entire response (decodedMeaning, relationshipTip, vibe) MUST be in the ${languageNames[lang]} language.
    
    If mode is WOMEN_TO_MEN: 
    Translate "Women language" into what a man should hear/understand.
    
    If mode is MEN_TO_WOMEN:
    Translate "Men language" into what a woman should hear/understand.
    
    Always be funny, slightly exaggerated, but relatable. Adapt the humor to the cultural context of the ${languageNames[lang]} language.
  `;

  const prompt = `Translate this phrase: "${text}" from ${mode === TranslationMode.WOMEN_TO_MEN ? 'Women to Men' : 'Men to Women'} in the ${languageNames[lang]} language.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            literalText: { type: Type.STRING, description: "The original phrase provided" },
            decodedMeaning: { type: Type.STRING, description: "The humorous decoded hidden meaning" },
            relationshipTip: { type: Type.STRING, description: "A funny piece of advice for the recipient" },
            vibe: { type: Type.STRING, description: "The emotional vibe of the phrase" },
          },
          required: ["literalText", "decodedMeaning", "relationshipTip", "vibe"]
        }
      }
    });

    if (!response || !response.text) {
      throw new Error("Empty response from the relationship oracle.");
    }

    let jsonStr = response.text.trim();
    
    // Robust parsing in case the model wraps the output in markdown code blocks despite responseMimeType
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?/, "").replace(/```$/, "").trim();
    }

    const result = JSON.parse(jsonStr);
    return result as TranslationResult;
  } catch (error) {
    console.error("Gemini Service Error:", error);
    // Rethrow to be caught by the UI layer
    throw error;
  }
};