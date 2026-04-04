import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export class AIService {
  static async analyzeCode(code: string, providedLanguage?: string) {
    // Current March 2026 model identifiers (verified via API)
    const models = ['gemini-2.0-flash', 'gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-pro'];
    let lastError = null;

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
          You are a senior full-stack developer and security researcher. 
          Review the following source code for bugs, quality issues, performance bottlenecks, and security vulnerabilities.
          
          CODE:
          ${code}

          ${providedLanguage ? `The user suggests this is ${providedLanguage}, but please verify.` : `Please identify the programming language.`}

          Output your review in JSON format with exactly these keys:
          {
            "detectedLanguage": "string (the name of the programming language)",
            "bugs": [{ "severity": "low" | "medium" | "high", "description": "string", "line": number }],
            "suggestions": [{ "before": "string (the exact original code block)", "after": "string (the fixed code block)", "description": "string" }],
            "score": number (1-10),
            "documentation": "string (a concise high-level summary)"
          }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Robust JSON cleaning
        let cleaned = text.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
        }

        try {
          return JSON.parse(cleaned);
        } catch (e) {
          console.warn(`JSON Parse failed for ${modelName}, attempting auto-repair...`);
          // Basic repair for common AI JSON mistakes (unescaped backslashes in code snippets)
          // Look for single backslashes not followed by a valid escape char
          const repaired = cleaned.replace(/\\(?!["\\\/bfnrtu])/g, '\\\\');
          try {
            return JSON.parse(repaired);
          } catch (e2) {
             console.error('JSON Parse Error. Raw Text:', text);
             throw new Error('AI returned malformed JSON even after repair.');
          }
        }

      } catch (error: any) {
        lastError = error;
        console.error(`Error with ${modelName}: ${error.message}`);
        // If it's NOT a quota error, stop immediately. 
        // If it IS a quota error, loop will try the next model.
        if (!error.message.includes('429') && !error.message.includes('quota')) {
          break;
        }
      }
    }

    throw new Error(lastError?.message || 'AI analysis failed on all models.');
  }
}
