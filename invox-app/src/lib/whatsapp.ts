// WhatsApp Business API helpers — all calls are server-side only

function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  return new Uint8Array((hex.match(/.{2}/g) ?? []).map((b) => parseInt(b, 16)));
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getEncKey(): Uint8Array<ArrayBuffer> {
  const hex = process.env.WA_ENCRYPTION_KEY ?? "";
  if (!hex) throw new Error("WA_ENCRYPTION_KEY not set");
  return hexToBytes(hex);
}

// ── Token encryption (AES-256-GCM) ────────────────────────────────────────

export async function encryptToken(token: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", getEncKey(), "AES-GCM", false, ["encrypt"]);
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(token)
  );
  return `${bytesToHex(iv)}:${bytesToHex(new Uint8Array(cipher))}`;
}

export async function decryptToken(enc: string): Promise<string> {
  const [ivHex, cipherHex] = enc.split(":");
  const key = await crypto.subtle.importKey("raw", getEncKey(), "AES-GCM", false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: hexToBytes(ivHex) },
    key,
    hexToBytes(cipherHex)
  );
  return new TextDecoder().decode(plain);
}

// ── Webhook signature verification ────────────────────────────────────────

export async function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string
): Promise<boolean> {
  const appSecret = process.env.WA_APP_SECRET ?? "";
  if (!appSecret) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(appSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const expected = `sha256=${bytesToHex(new Uint8Array(sig))}`;

  // Timing-safe comparison
  if (expected.length !== signatureHeader.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signatureHeader.charCodeAt(i);
  }
  return diff === 0;
}

// ── WhatsApp Cloud API calls ───────────────────────────────────────────────

const WA_API = "https://graph.facebook.com/v21.0";

export async function sendTextMessage(
  phoneNumberId: string,
  accessToken: string,
  to: string,
  text: string
): Promise<{ message_id?: string; error?: string }> {
  const res = await fetch(`${WA_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });
  const data = await res.json() as { messages?: { id: string }[]; error?: { message: string } };
  if (!res.ok) return { error: data.error?.message ?? "Erro ao enviar" };
  return { message_id: data.messages?.[0]?.id };
}

export async function markMessageRead(
  phoneNumberId: string,
  accessToken: string,
  messageId: string
): Promise<void> {
  await fetch(`${WA_API}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    }),
  });
}
