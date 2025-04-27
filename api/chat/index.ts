import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = process.env.VITE_CHATBOT_API_KEY; // <-- Add this to Vercel Env Vars later

  try {
    const forwardRes = await fetch(
      "https://api.langflow.astra.datastax.com/lf/c40fcb81-ad16-49ea-a621-5666e1bdafda/api/v1/run/24852f36-f1cc-40cf-8e3f-b879f3cfe0d2?stream=false",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      }
    );

    const data = await forwardRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
