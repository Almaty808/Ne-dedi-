
import { GoogleGenAI, Type } from "@google/genai";
import { TranslationMode, TranslationResult, AppLanguage } from "../types";

export const getTranslation = async (text: string, mode: TranslationMode, lang: AppLanguage): Promise<TranslationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const languageNames = {
    en: "English",
    ru: "Russian (Русский)",
    kk: "Kazakh (Қазақша)"
  };

  const systemInstruction = `
    You are a witty, humorous relationship expert who specializes in "translating" between men and women.
    Your goal is to take a phrase typically said by one gender and explain what it *actually* means to the other, 
    playing on common (lighthearted and funny) relationship tropes.
    
    IMPORTANT: Your entire response (decodedMeaning, relationshipTip, vibe) MUST be in the ${languageNames[lang]} language.
    
    If mode is WOMEN_TO_MEN: 
    Translate "Women language" into what a man should hear/understand.
    Example (English): "I'm fine" -> "I am definitely not fine, but I'm testing if you've noticed why yet."
    
    If mode is MEN_TO_WOMEN:
    Translate "Men language" into what a woman should hear/understand.
    Example (English): "I'll do it in a minute" -> "I have heard your request, but I am currently mentally committed to this sofa for at least another hour."
    
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
            decodedMeaning: { type: Type.STRING, description: `The humorous decoded hidden meaning in ${languageNames[lang]}` },
            relationshipTip: { type: Type.STRING, description: `A funny piece of advice for the recipient in ${languageNames[lang]}` },
            vibe: { type: Type.STRING, description: `The emotional vibe of the phrase in ${languageNames[lang]}` },
          },
          required: ["literalText", "decodedMeaning", "relationshipTip", "vibe"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result as TranslationResult;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to consult the relationship oracle. Please try again.");
  }
};
