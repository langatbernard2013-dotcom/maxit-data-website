
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Telegram settings missing" });
  }

  const { plan, phone } = req.body || {};

  if (!plan || !phone) {
    return res.status(400).json({ error: "Missing order details" });
  }

  const message =
    `New Starlink to Cell enquiry\n` +
    `Package: ${plan}\n` +
    `Phone: ${phone}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Telegram delivery failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Notification failed" });
  }
}
