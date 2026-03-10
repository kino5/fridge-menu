export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base64, mediaType } = req.body;

  if (!base64 || !mediaType) {
    return res.status(400).json({ error: "Missing image data" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: mediaType, data: base64 },
              },
              {
                type: "text",
                text: `この冷蔵庫の中の食材を分析して、今夜作れるメニューを3つ提案してください。
以下のJSON形式のみで返してください（マークダウンや余分なテキスト不要）：
{
  "ingredients": ["食材1", "食材2", ...],
  "menus": [
    {
      "name": "料理名",
      "emoji": "絵文字1つ",
      "time": "調理時間（例: 20分）",
      "difficulty": "簡単/普通/難しい",
      "description": "一言説明（30字以内）",
      "steps": ["手順1", "手順2", "手順3"]
    }
  ]
}`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content.map((c) => c.text || "").join("");
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze image" });
  }
}
