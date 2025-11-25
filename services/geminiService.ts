
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Ability, AICharacterSuggestion, Character } from "../types";

// Initialize Gemini API
// NOTE: In a real app, handle API key security properly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

// Schema for strict JSON generation
const characterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    species: { type: Type.STRING },
    class: { type: Type.STRING },
    background: { type: Type.STRING },
    stats: {
      type: Type.OBJECT,
      properties: {
        [Ability.STR]: { type: Type.INTEGER },
        [Ability.DEX]: { type: Type.INTEGER },
        [Ability.CON]: { type: Type.INTEGER },
        [Ability.INT]: { type: Type.INTEGER },
        [Ability.WIS]: { type: Type.INTEGER },
        [Ability.CHA]: { type: Type.INTEGER },
      },
      required: [Ability.STR, Ability.DEX, Ability.CON, Ability.INT, Ability.WIS, Ability.CHA]
    },
    skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of skill names the character is proficient in."
    },
    feats: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          source: { type: Type.STRING, description: "Origin Feat, Class Feature, Species Trait, etc." },
          type: { type: Type.STRING, enum: ["active", "passive"] },
          repeatable: { type: Type.BOOLEAN, description: "Whether this feat can be taken multiple times." }
        }
      },
      description: "List of feats, class features, or species traits appropriate for the character."
    },
    shortBackstory: { type: Type.STRING },
    reasoning: { type: Type.STRING }
  },
  required: ["name", "species", "class", "background", "stats", "skills", "shortBackstory", "reasoning"]
};

export const generateCharacterFromPrompt = async (userPrompt: string): Promise<AICharacterSuggestion> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create a D&D 5e (2024 rules) character based on this concept: "${userPrompt}".
      If the prompt is vague, be creative. Ensure stats are optimized for the class using standard array or point buy logic (Max 20).
      Select 2-4 skills appropriate for the Class and Background.
      Select 1 relevant Origin Feat (e.g. Alert, Musician, Tough, Lucky) if appropriate for the background/species.
      Provide a short backstory fitting the background.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: characterSchema,
        systemInstruction: "You are an expert D&D 2024 Dungeon Master. You understand the new species, backgrounds, and class changes in the 2024 Player's Handbook."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AICharacterSuggestion;
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw error;
  }
};

export const generateBackstory = async (char: Character): Promise<string> => {
  try {
    // Convert skills object to readable list for prompt
    const skillList = Object.entries(char.skills)
      .filter(([_, level]) => level !== 'none')
      .map(([name, level]) => level === 'expertise' ? `${name} (Expertise)` : name)
      .join(', ');
    
    const featList = char.feats.map(f => f.name).join(', ');

    const prompt = `Write a compelling, 2-paragraph backstory for a D&D 2024 character with the following details:
    Name: ${char.name}
    Species: ${char.species}
    Class: ${char.class}
    Background: ${char.background}
    Stats: STR ${char.stats.Strength}, DEX ${char.stats.Dexterity}, INT ${char.stats.Intelligence}, ...
    Skills: ${skillList}
    Feats: ${featList}
    
    Focus on their motivation for adventuring. Keep it thematic to the D&D setting.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Could not generate backstory.";
  } catch (error) {
    console.error("Backstory generation error:", error);
    return "Error generating backstory. Please try again.";
  }
};

export const suggestName = async (species: string, charClass: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Suggest a single, unique, lore-friendly name for a ${species} ${charClass} in D&D. Return ONLY the name, nothing else.`,
    });
    return response.text?.trim() || "Hero";
  } catch (error) {
    return "Unknown Hero";
  }
}