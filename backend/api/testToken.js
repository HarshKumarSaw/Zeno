import { getValidAccessToken } from "../../utils/refreshGoogleToken";

export default async function handler(req, res) {
  const userId = req.query.user;

  if (!userId) {
    return res.status(400).json({ error: "Missing user query param" });
  }

  try {
    const token = await getValidAccessToken({ env: process.env }, userId);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Token refresh error:", err);
    return res.status(500).json({ error: "Failed to get access token" });
  }
}
