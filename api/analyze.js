export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base64, mediaType } = req.body;

  if (!base64 || !mediaType) {
    return res.status(400).json({ error: "Missing image data" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: mediaType,
                    data: base64,
                  },
                },
                {
                  text: `この冷蔵庫の中の食材を分析して、今夜作れるメニューを3つ提案してください。
以下のJSON形式のみで返してください（マークダウンや余分なテキスト不要）：
{
  "ingredients": ["食材1", "食材2"],
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
          generationConfig: { temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error?.message || "Gemini API error", detail: JSON.stringify(data) });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze image", detail: err.message });
  }
}
