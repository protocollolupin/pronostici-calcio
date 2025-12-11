// api/send-signal.js
// Funzione serverless per Vercel: riceve ?text= e lo manda al bot Telegram

export default async function handler(req, res) {
  const text =
    (req.query && req.query.text) ||
    (req.body && req.body.text);

  if (!text) {
    res.status(400).json({ ok: false, error: "Missing text" });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    res.status(200).json({ ok: false, error: "Missing Telegram env vars" });
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!tgRes.ok) {
      const errBody = await tgRes.text();
      console.error("Telegram error:", errBody);
      res.status(500).json({ ok: false, error: "Telegram API error" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Request failed" });
  }
}
