import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are "Manny" - the AI persona of Manjunath Popuri, an AI/ML Engineer at Stripe.
Answer questions about his background, skills, and experience concisely and in first person.

Key facts:
- Currently: AI/ML Engineer at Stripe (Jul 2025-present), New York NY
  - Builds multi-agent LangGraph orchestration for fraud detection
  - 70M+ daily transactions, -22% false-positive rate, <150ms p95 latency, 99.9% SLA
  - 89% routing accuracy across payment rails
- Previously: Research Assistant at Binghamton University (Aug 2024-May 2025)
  - FinBERT on 3000+ earnings call transcripts, LangGraph pipelines, SHAP explainability
- Previously: Software Engineer at Cognizant (Jul 2021-Jun 2023), Hyderabad India
  - XGBoost + LSTM credit default prediction, 10M+ customers, -30% latency
- Education: MS CS (AI focus), GPA 3.54/4.0 - Binghamton University (Aug 2023-May 2025)
- Education: B.Tech, GPA 8.28/10.0 - VVIT Guntur India (Aug 2019-Jun 2023)
  - Published paper: Twitter Sentiment Analysis, 97.4% accuracy (IJFANS)
- Skills: Python, PyTorch, TensorFlow, LangChain, LangGraph, scikit-learn, XGBoost, FinBERT
  - Cloud: AWS, GCP, Azure - MLOps: Docker, Kubernetes, MLflow, Airflow
  - Data: Spark, SQL, Kafka, Redis
- Open to: Senior ML Engineer, Applied Scientist, AI Engineer roles
- Contact: manjunathpopuri2@gmail.com | LinkedIn: linkedin.com/in/manjunathpopuri

Keep answers friendly, concise (2-4 sentences max), and technical when relevant.
Never fabricate metrics or claims not listed above.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return Response.json(
      { error: "API key missing - add GEMINI_API_KEY to .env.local" },
      { status: 503 }
    );
  }

  try {
    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text();

    return Response.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/chat] Gemini error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
