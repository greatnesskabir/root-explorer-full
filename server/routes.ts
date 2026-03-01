import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.roots.recent.path, async (req, res) => {
    try {
      const recent = await storage.getRecentRoots();
      res.json(recent);
    } catch (error) {
      console.error("Error fetching recent roots:", error);
      res.status(500).json({ message: "Failed to fetch recent searches" });
    }
  });

  app.post(api.roots.search.path, async (req, res) => {
    try {
      const { query } = api.roots.search.input.parse(req.body);
      const queryClean = query.trim();

      // Check cache first
      const existing = await storage.getRootByQuery(queryClean);
      if (existing) {
        return res.json(existing);
      }

      // Query OpenAI for root analysis
      const systemPrompt = `You are an expert Arabic linguist specializing in Classical/MSA morphology. 
Your task is to analyze an Arabic word or root provided by the user and extract its root-word structure.
Provide the response strictly in JSON format matching this schema:
{
  "root": "The isolated Arabic root letters (e.g. ض ر ر)",
  "word": "The originally searched word (can be the root itself)",
  "shortDefinition": "One line, neutral definition of the searched word",
  "coreMeaning": "The core semantic field of the root (Damage, harm, injury, loss...)",
  "why": "A deep, impactful explanation of why the word connects to the root. Use physical metaphors. No markdown bolding (no **). Strictly English. Mirror this depth: 'Harm that attaches. A disease that clings to the body. A debt that sticks to your name. A slander that follows you. Harm you cannot simply shake off.'",
  "contrast": "Definition by negation: [contrasting root] + [up to 3 MAX words describing contrasting root]",
  "derivedForms": ["List exactly 3 derived forms. These must be 3 different words relating to the root. Do NOT include verb forms. Do NOT include active particles. Only nouns/adjectives. Include form type like '(noun)' in the string."]
}

Guidelines:
- If the word is a dialect word, proper noun, or loanword, it may not follow standard root patterns. Return a JSON with empty fields if it cannot be analyzed, or analyze to the best ability and label it.
- If it is Quranic, label it.
- If OpenAI doesn't know, use Fallback = Lane's Lexicon / Hans Wehr snippets.
- If absolutely no verified root data is available, return an object with "error": "No verified root data available for this spelling".
- Define root as an animating idea, one sun, few reflections. Not a list of meanings.
- Contrast should be a sharp opposite or near-neighbor.
- In 'coreMeaning', do NOT include the word 'meaning'.
- Ensure 'word' and 'core' definitions are powerfully distinct.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this Arabic word/root: ${queryClean}` }
        ],
        response_format: { type: "json_object" }
      });

      const responseText = response.choices[0].message.content;
      if (!responseText) {
         return res.status(404).json({ message: "No verified root data available for this spelling" });
      }

      const aiData = JSON.parse(responseText);

      if (aiData.error) {
         return res.status(404).json({ message: aiData.error });
      }

      const insertRoot = {
        root: aiData.root,
        word: aiData.word || queryClean,
        shortDefinition: aiData.shortDefinition || "",
        coreMeaning: aiData.coreMeaning || "",
        why: aiData.why || "",
        contrast: aiData.contrast || "",
        derivedForms: aiData.derivedForms || []
      };

      try {
        const savedRoot = await storage.createRoot(insertRoot);
        return res.json(savedRoot);
      } catch (dbError: any) {
         // Could be a unique constraint violation if root was generated but already exists under a different search word
         if (dbError.code === '23505') {
            const fallback = await storage.getRootByQuery(insertRoot.root);
            if (fallback) return res.json(fallback);
         }
         throw dbError;
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      console.error("Search error:", err);
      return res.status(500).json({ message: "An internal server error occurred" });
    }
  });

  return httpServer;
}
