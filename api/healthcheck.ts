export default function handler(req: any, res: any) {
  res.status(200).json({
    message: "Hello from user-profile!",
    status: "success",
  });
}
