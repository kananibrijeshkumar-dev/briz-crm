export async function sendWhatsAppOtpDirectly(phone, code, purpose = "login") {
  const cleanDigits = String(phone).replace(/[^0-9]/g, "");
  if (cleanDigits.length < 10) return { success: false, error: "Invalid phone number" };

  const target = cleanDigits.startsWith("91") ? cleanDigits : `91${cleanDigits.slice(-10)}`;
  const WHATSAPP_TOKEN = "EAAXTyBC2XwYBShTYsk3Liq9HKdyJcji1GHPY1QdOUZCsVIHCunjW0naySH2qMIGo5ZAHreyXK7BW0PR1lZAkWZCWR8AjwyFLa3fXM3RTUUTSkFGZCytpSYtGaMd5YLRSKW6J3WCCHRQBrDkZCB4toQwyJjB3LoJZC16aPpH4Y4DIXwZC26s0SGvhmIZBjpFTZB6AZDZD";
  const PHONE_NUMBER_ID = "1260228570511181";

  const actionText = purpose === "signup" ? "activate your 14-day free workspace" : "sign in to your CRM workstation";
  const bodyText = `🔒 *BrizCRM Verification Code:* ${code}\n\nUse this 4-digit code to ${actionText}. Valid for 5 minutes.\n\n_Do not share this code with anyone._`;

  // 1. Direct call to Meta WhatsApp Cloud API (CORS-enabled)
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: target,
        type: "text",
        text: { body: bodyText }
      })
    });
    const data = await res.json();
    if (res.ok && data.messages?.[0]?.id) {
      return { success: true, messageId: data.messages[0].id };
    }
  } catch (err) {
    console.warn("Direct Meta send notice:", err);
  }

  // 2. Fallback to serverless route
  try {
    const res2 = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: target, code, purpose })
    });
    const data2 = await res2.json();
    return data2;
  } catch (e) {
    return { success: false, error: e.message };
  }
}
