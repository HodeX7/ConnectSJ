import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Dummy user profile data for now (replace with real fetching if needed)
  const userProfile = {
    id: "12345",
    name: "John Doe",
    email: "johndoe@example.com",
    points: 1200,
    level: "Gold",
  };

  return res.status(200).json(userProfile);
}
