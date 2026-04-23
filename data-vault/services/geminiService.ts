
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the official help assistant for the 'Data Vault' mobile app. 
Data Vault allows users to 'store' mobile data and 'use' it at simulated 4G/5G speeds.
Key facts about the app:
- It's a simulation (no physical storage of data).
- Users store data in MB/GB.
- Users use data at 80, 100, or 120 Mbps tiers.
- Consumption is calculated as: (Mbps * time) / 8.
- The app tracks balances locally.

Answer user questions clearly and concisely. If they ask about something unrelated to the app or technology, politely steer them back to Data Vault help.
`;

export const getAIHelpResponse = async (query: string): Promise<string> => {
  try {
    // Fix: Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) to initialize the client.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
    // Fix: Access response.text as a property, not a method.
    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("AI Help Error:", error);
    return "The help service is currently unavailable. Please try again later.";
  }
};
