export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing ANTHROPIC_API_KEY" });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });

    const text = await anthropicRes.text();

    if (!anthropicRes.ok) {
      console.error("Anthropic API error:", anthropicRes.status, text);
    }

    res.status(anthropicRes.status);
    res.setHeader("Content-Type", anthropicRes.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (error) {
    console.error("/api/chat error:", error);
    return res.status(500).json({ error: "AI request failed" });
  }
}
