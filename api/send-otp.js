export default async function handler(req, res) {
  // Allow cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { phone, code, purpose = "login" } = req.body || {};

    if (!phone || !code) {
      return res.status(400).json({ error: "Phone number and OTP code are required." });
    }

    const cleanDigits = String(phone).replace(/[^0-9]/g, "");
    if (cleanDigits.length < 10) {
      return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
    }

    // Format target phone with country code 91
    const targetPhone = cleanDigits.startsWith("91")
      ? cleanDigits
      : `91${cleanDigits.slice(-10)}`;

    const WHATSAPP_TOKEN =
      process.env.WHATSAPP_TOKEN ||
      "EAAXTyBC2XwYBShTYsk3Liq9HKdyJcji1GHPY1QdOUZCsVIHCunjW0naySH2qMIGo5ZAHreyXK7BW0PR1lZAkWZCWR8AjwyFLa3fXM3RTUUTSkFGZCytpSYtGaMd5YLRSKW6J3WCCHRQBrDkZCB4toQwyJjB3LoJZC16aPpH4Y4DIXwZC26s0SGvhmIZBjpFTZB6AZDZD";

    const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || "1260228570511181";

    const actionText = purpose === "signup" ? "activate your 14-day free workspace" : "sign in to your CRM workstation";
    const messageBody = `🔒 *BrizCRM Verification Code:* ${code}\n\nUse this 4-digit code to ${actionText}. Valid for 5 minutes.\n\n_Do not share this code with anyone._`;

    const metaRes = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: targetPhone,
          type: "text",
          text: { body: messageBody },
        }),
      }
    );

    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      console.error("Meta API delivery error:", metaData);
      return res.status(metaRes.status || 500).json({
        success: false,
        error: metaData.error?.message || "Meta API error",
        details: metaData,
      });
    }

    return res.status(200).json({
      success: true,
      target: targetPhone,
      messageId: metaData.messages?.[0]?.id,
    });
  } catch (err) {
    console.error("Internal send-otp error:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Failed to deliver OTP via WhatsApp",
    });
  }
}
