const encoder = new TextEncoder();

const INKTHREADABLE_SIZE_SKUS = {
  "3-4": "STTK184-FNY-3-4",
  "3-4 years": "STTK184-FNY-3-4",
  "5-6": "STTK184-FNY-5-6",
  "5-6 years": "STTK184-FNY-5-6",
  "7-8": "STTK184-FNY-7-8",
  "7-8 years": "STTK184-FNY-7-8",
  "9-11": "STTK184-FNY-9-11",
  "9-11 years": "STTK184-FNY-9-11",
  "12-13": "STTK184-FNY-12-14",
  "12-13 year": "STTK184-FNY-12-14",
  "12-13 years": "STTK184-FNY-12-14"
};

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

async function sha1(message) {
  return hex(await crypto.subtle.digest("SHA-1", encoder.encode(message)));
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

function normalizeSize(size) {
  return String(size || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function inkthreadableSkuForSize(size) {
  return INKTHREADABLE_SIZE_SKUS[normalizeSize(size)] || null;
}

function shippingAddress(session) {
  const details = session.customer_details || {};
  const shipping = session.shipping_details || {};
  const address = shipping.address || details.address || {};
  const fullName = shipping.name || details.name || "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  return {
    firstName: parts.shift() || "Customer",
    lastName: parts.join(" ") || "Customer",
    company: "",
    address1: address.line1 || "",
    address2: address.line2 || "",
    city: address.city || "",
    county: address.state || "",
    postcode: address.postal_code || "",
    country: address.country || "United Kingdom",
    phone1: details.phone || ""
  };
}

function missingAddressFields(address) {
  const required = ["address1", "city", "postcode", "country"];
  return required.filter((key) => !address[key]);
}

async function createInkthreadableOrder(env, session) {
  const size = customField(session, "size") || session.metadata?.size;
  const pn = inkthreadableSkuForSize(size);

  if (!env.INKTHREADABLE_APP_ID || !env.INKTHREADABLE_SECRET_KEY) {
    throw new Error("Inkthreadable API credentials are not configured");
  }
  if (!pn) {
    throw new Error(`No Inkthreadable variant configured for size: ${size || "missing"}`);
  }
  if (!env.INKTHREADABLE_DESIGN_FRONT_URL) {
    throw new Error("INKTHREADABLE_DESIGN_FRONT_URL is not configured");
  }

  const address = shippingAddress(session);
  const missing = missingAddressFields(address);
  if (missing.length) {
    throw new Error(`Checkout is missing shipping fields: ${missing.join(", ")}`);
  }

  const amount = Number(session.amount_total || 2999) / 100;
  const body = JSON.stringify({
    external_id: session.id,
    brandName: "Orish's World",
    comment: `Stripe checkout ${session.id}. Orish Too-Fast Rocket Tee. Size: ${size}`,
    shipping_address: address,
    shipping: {
      shippingMethod: env.INKTHREADABLE_SHIPPING_METHOD || "regular"
    },
    items: [
      {
        pn,
        quantity: 1,
        retailPrice: amount.toFixed(2),
        description: "Orish's World — Too-Fast Rocket Tee. Front DTG print.",
        designs: {
          front: env.INKTHREADABLE_DESIGN_FRONT_URL
        }
      }
    ]
  });

  const signature = await sha1(body + env.INKTHREADABLE_SECRET_KEY);
  const endpoint = new URL("https://www.inkthreadable.co.uk/api/orders.php");
  endpoint.searchParams.set("AppId", env.INKTHREADABLE_APP_ID);
  endpoint.searchParams.set("Signature", signature);

  const response = await fetch(endpoint.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Inkthreadable ${response.status}: ${text.slice(0, 500)}`);
  }

  let order = null;
  try {
    order = JSON.parse(text);
  } catch {
    order = { raw: text };
  }

  console.log("Inkthreadable order created", {
    stripe_checkout_session: session.id,
    size,
    pn,
    response: order
  });

  return order;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (path === "/" || path === "/health") {
      return new Response("Orish fulfilment worker is ready", { status: 200 });
    }

    if (path !== "/stripe-webhook" || request.method !== "POST") {
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

    let event;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return new Response("Event ignored", { status: 200 });
    }

    const session = event.data.object;
    if (session.metadata?.product_code !== "OW-TEE-001") {
      return new Response("Not a T-shirt order", { status: 200 });
    }

    try {
      const order = await createInkthreadableOrder(env, session);
      return Response.json({
        ok: true,
        message: "T-shirt order sent to Inkthreadable",
        stripe_checkout_session: session.id,
        inkthreadable_order: order
      });
    } catch (error) {
      console.error("Orish T-shirt fulfilment failed", {
        stripe_checkout_session: session.id,
        error: error?.message || String(error)
      });
      return Response.json(
        {
          ok: false,
          message: "T-shirt order was verified by Stripe but not sent to Inkthreadable",
          error: error?.message || String(error)
        },
        { status: 500 }
      );
    }
  }
};
