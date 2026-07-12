import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: safe JSON parsing
const tryParseJSON = (text: string) => {
  try {
    // Try to strip markdown JSON ticks if present
    const cleanText = text.replace(/```json\s?/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse AI JSON response:", e, text);
    return null;
  }
};

/**
 * Endpoint: /api/coach
 * Context-aware AI Coach conversation
 */
app.post("/api/coach", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { prompt, history, context } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured. Please add it in the Secrets panel."
      });
      return;
    }

    // Format context for rich awareness
    const systemInstruction = `You are CareerOS AI Coach, an elite career mentor, productivity strategist, and technical interviewer.
You are assisting Ajay, a Software Engineer working full-time, who aims to learn new tech (Python, SQL, Azure AI), prepare for interviews, and build portfolio projects.
Your tone is professional, clear, encouraging, and highly strategic (like Linear, Notion, Vercel dashboards). Avoid fluff or overly clinical explanations.

You have access to the current state of Ajay's CareerOS platform:
- Profile: ${JSON.stringify(context?.profile || {})}
- Active Tasks: ${JSON.stringify((context?.tasks || []).filter((t: any) => t.status !== "Completed"))}
- Habits: ${JSON.stringify(context?.habits || [])}
- Career Roadmap: ${JSON.stringify(context?.roadmaps || [])}
- Current Skills: ${JSON.stringify(context?.skills || [])}
- Active Projects: ${JSON.stringify(context?.projects || [])}
- Active Job Applications: ${JSON.stringify(context?.jobApplications || [])}

When answering:
1. Reference Ajay's actual active tasks, roadmaps, or learning skills to give highly context-aware advice.
2. If he asks for code, provide clean, concise TypeScript/Python snippets.
3. Keep answers compact, readable, and structured in Markdown. Use bold headers, bullet lists, and code blocks appropriately.
4. Give actionable next-steps Ajay can do right now.`;

    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    // Generate response using gemini-3.5-flash
    const chat = ai.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: chatHistory
    });

    const response = await chat.sendMessage({ message: prompt });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Coach." });
  }
});

/**
 * Endpoint: /api/planner/recommend
 * Auto-recommend the daily schedule based on current tasks
 */
app.post("/api/planner/recommend", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { tasks } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: "GEMINI_API_KEY is missing."
      });
      return;
    }

    const prompt = `Based on the following active tasks:
${JSON.stringify(tasks || [])}

Provide an optimized, recommended hourly timeline for the day. Take into account that Ajay is a full-time software engineer working an office shift (usually 09:00 - 18:00). Fit key high-priority study/coding tasks in the morning (before 09:00) or evening (after 18:30).

You must return a raw JSON array matching this exact schema:
[
  { "time": "HH:MM", "label": "Task / Activity Name", "taskId": "corresponding_task_id_if_any" }
]

Ensure you output ONLY the valid JSON array, with no other markdown text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING, description: "Time of day in HH:MM format" },
              label: { type: Type.STRING, description: "Activity description or task title" },
              taskId: { type: Type.STRING, description: "The task id from the list, or empty if general" }
            },
            required: ["time", "label"]
          }
        }
      }
    });

    const recommendedSlots = tryParseJSON(response.text || "[]");
    res.json({ slots: recommendedSlots });
  } catch (error: any) {
    console.error("Planner Suggestion Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate schedule recommendation." });
  }
});

/**
 * Endpoint: /api/resume/review
 * Provide actionable metrics and feedback on text resume or notes
 */
app.post("/api/resume/review", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { title, notes } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: "GEMINI_API_KEY is missing." });
      return;
    }

    const prompt = `Review this resume version / background notes:
Title: ${title}
Notes/Content: ${notes}

Analyze this as an expert recruiter for senior software engineering roles. Suggest improvements regarding action verbs, quantitative metrics, cloud/platform visibility, and structure.

You must return a raw JSON object matching this exact schema:
{
  "score": 85, // integer 0 to 100
  "feedback": "Actionable feedback in rich markdown format, with bullet points detailing improvements."
}

Ensure you output ONLY the valid JSON object.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Resume score from 0 to 100" },
            feedback: { type: Type.STRING, description: "Detailed reviewer comments in markdown format" }
          },
          required: ["score", "feedback"]
        }
      }
    });

    const parsedResult = tryParseJSON(response.text || "{}");
    res.json(parsedResult || { score: 70, feedback: "Review completed but feedback parsing failed." });
  } catch (error: any) {
    console.error("Resume Review Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze resume." });
  }
});

// Setup Vite Dev Server / Static Assets Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerOS backend server running on http://localhost:${PORT}`);
  });
}

startServer();
