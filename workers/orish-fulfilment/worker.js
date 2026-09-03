const encoder = new TextEncoder();

function hex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256(secret, message) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return hex(await crypto.subtle.sign("HMAC", key, encoder.encode(message)));
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

async function verifyStripe(rawBody, stripeSignatureHeader, secret) {
  if (!stripeSignatureHeader || !secret) return false;
  let timestamp = "";
  const signatures = [];
  for (const part of stripeSignatureHeader.split(",")) {
    const [key, value] = part.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!timestamp || !signatures.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = await hmacSha256(secret, `${timestamp}.${rawBody}`);
  return signatures.some((sig) => safeEqual(sig, expected));
}

function customField(session, key) {
  const field = (session.custom_fields || []).find((item) => item.key === key);
  return field?.dropdown?.value ?? field?.text?.value ?? field?.numeric?.value ?? null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return new Response("Orish fulfilment worker is ready", { status: 200 });
    }

    if (url.pathname !== "/stripe-webhook" || request.method !== "POST") {
      return new Response("Not found", { status: 404 });
    }

    if (!env.STRIPE_WEBHOOK_SECRET) {
      return new Response("Stripe webhook secret not configured", { status: 500 });
    }

    const rawBody = await request.text();
    const verified = await verifyStripe(
      rawBody,
      request.headers.get("stripe-signature"),
      env.STRIPE_WEBHOOK_SECRET
    );

    if (!verified) return new Response("Invalid Stripe signature", { status: 400 });

    const event = JSON.parse(rawBody);
    if (event.type !== "checkout.session.completed") {
      return new Response("Event ignored", { status: 200 });
    }

    const session = event.data.object;
    if (session.metadata?.product_code !== "OW-TEE-001") {
      return new Response("Not a T-shirt order", { status: 200 });
    }

    console.log("Verified Orish T-shirt order", {
      checkout_session: session.id,
      size: customField(session, "size"),
      colour: customField(session, "colour")
    });

    return new Response("T-shirt order verified", { status: 200 });
  }
};
