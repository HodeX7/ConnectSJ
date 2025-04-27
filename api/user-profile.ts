export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const userProfile = {
    id: "12345",
    name: "John Doe",
    email: "johndoe@example.com",
    points: 1200,
    level: "Gold",
  };

  res.status(200).json(userProfile);
}
