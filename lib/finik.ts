import { createSign, createVerify, randomUUID } from "node:crypto";

const PRODUCTION_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuF/PUmhMPPidcMxhZBPb
BSGJoSphmCI+h6ru8fG8guAlcPMVlhs+ThTjw2LHABvciwtpj51ebJ4EqhlySPyT
hqSfXI6Jp5dPGJNDguxfocohaz98wvT+WAF86DEglZ8dEsfoumojFUy5sTOBdHEu
g94B4BbrJvjmBa1YIx9Azse4HFlWhzZoYPgyQpArhokeHOHIN2QFzJqeriANO+wV
aUMta2AhRVZHbfyJ36XPhGO6A5FYQWgjzkI65cxZs5LaNFmRx6pjnhjIeVKKgF99
4OoYCzhuR9QmWkPl7tL4Kd68qa/xHLz0Psnuhm0CStWOYUu3J7ZpzRK8GoEXRcr8
tQIDAQAB
-----END PUBLIC KEY-----`;

const BETA_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwlrlKz/8gLWd1ARWGA/8
o3a3Qy8G+hPifyqiPosiTY6nCHovANMIJXk6DH4qAqqZeLu8pLGxudkPbv8dSyG7
F9PZEAryMPzjoB/9P/F6g0W46K/FHDtwTM3YIVvstbEbL19m8yddv/xCT9JPPJTb
LsSTVZq5zCqvKzpupwlGS3Q3oPyLAYe+ZUn4Bx2J1WQrBu3b08fNaR3E8pAkCK27
JqFnP0eFfa817VCtyVKcFHb5ij/D0eUP519Qr/pgn+gsoG63W4pPHN/pKwQUUiAy
uLSHqL5S2yu1dffyMcMVi9E/Q2HCTcez5OvOllgOtkNYHSv9pnrMRuws3u87+hNT
ZwIDAQAB
-----END PUBLIC KEY-----`;

const isProduction = process.env.FINIK_ENV?.replaceAll('"', "") === "prod";
const apiHost = isProduction ? "api.acquiring.averspay.kg" : "beta.api.acquiring.averspay.kg";
const apiUrl = `https://${apiHost}/v1/payment`;

type RequestData = {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  queryStringParameters?: Record<string, string> | null;
  body?: Record<string, unknown> | string | null;
};

function canonicalize(data: RequestData) {
  const host = data.headers.Host;
  if (!host) throw new Error("Missing host for Finik signature");
  const headers = Object.keys(data.headers)
    .filter((key) => key.toLowerCase().startsWith("x-api-"))
    .sort()
    .map((key) => `${key.toLowerCase()}:${data.headers[key]}`);
  const query = Object.entries(data.queryStringParameters ?? {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${encodeURI(decodeURI(key))}=${encodeURI(decodeURI(value))}`)
    .join("&");
  let body = "";
  if (data.body && typeof data.body === "object") {
    body = JSON.stringify(Object.fromEntries(Object.entries(data.body).sort(([a], [b]) => a.localeCompare(b))));
  } else if (typeof data.body === "string") {
    body = data.body;
  }
  return [data.httpMethod.toLowerCase(), decodeURI(data.path), [`host:${host}`, ...headers].join("&"), ...(query ? [query] : []), body].join("\n");
}

function publicAppUrl() {
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const configuredUrl = productionDomain
    ? `https://${productionDomain}`
    : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  if (!configuredUrl) throw new Error("The public application URL is not configured");
  const url = new URL(configuredUrl);
  if (url.protocol !== "https:" && url.hostname !== "localhost") throw new Error("The public application URL must use HTTPS");
  if (process.env.VERCEL_ENV === "production" && url.hostname === "localhost") throw new Error("A public production application URL is not configured");
  return url.origin;
}

export function newFinikPaymentId() {
  return randomUUID();
}

export async function createFinikPayment(input: { amount: number; paymentId: string; orderId: string }) {
  const apiKey = process.env.FINIK_API_KEY;
  const accountId = process.env.FINIK_ACCOUNT_ID;
  const privateKey = process.env.FINIK_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!apiKey || !accountId) throw new Error("Finik credentials are not configured");
  if (isProduction && !privateKey) throw new Error("Production Finik private key is not configured");
  if (!Number.isSafeInteger(input.amount) || input.amount <= 0) throw new Error("Invalid payment amount");

  const timestamp = Date.now().toString();
  const baseUrl = publicAppUrl();
  const path = "/v1/payment";
  const body = {
    Amount: input.amount,
    CardType: "FINIK_QR",
    Currency: "KGS",
    PaymentId: input.paymentId,
    RedirectUrl: `${baseUrl}/order/${encodeURIComponent(input.orderId)}?payment=return`,
    Lang: "ru",
    Data: {
      accountId,
      merchantCategoryCode: "5942",
      name_en: "Raritet",
      description: `Оплата заказа Раритет ${input.orderId}`,
      webhookUrl: `${baseUrl}/api/finik/webhook`,
    },
  };
  const signedData: RequestData = {
    httpMethod: "POST",
    path,
    headers: { Host: apiHost, "x-api-key": apiKey, "x-api-timestamp": timestamp },
    body,
  };
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "x-api-timestamp": timestamp,
  };
  if (privateKey) {
    const signer = createSign("SHA256");
    signer.update(canonicalize(signedData));
    headers.signature = signer.sign(privateKey, "base64");
  }

  const response = await fetch(apiUrl, { method: "POST", headers, body: JSON.stringify(body), redirect: "manual", cache: "no-store" });
  const location = response.headers.get("location");
  if (response.status === 302 && location) {
    const paymentUrl = new URL(location);
    if (paymentUrl.protocol !== "https:") throw new Error("Finik returned an invalid payment URL");
    return paymentUrl.toString();
  }
  if (response.ok && response.status !== 204) {
    const result: unknown = await response.json().catch(() => null);
    if (result && typeof result === "object") {
      const value = result as { paymentUrl?: unknown; url?: unknown };
      const candidate = typeof value.paymentUrl === "string" ? value.paymentUrl : value.url;
      if (typeof candidate === "string") {
        const paymentUrl = new URL(candidate);
        if (paymentUrl.protocol === "https:") return paymentUrl.toString();
      }
    }
  }
  throw new Error(`Finik payment request failed (${response.status})`);
}

export function isFinikTimestampValid(timestamp: string) {
  return /^\d{13}$/.test(timestamp) && Math.abs(Date.now() - Number(timestamp)) <= 5 * 60 * 1000;
}

export function verifyFinikWebhook(input: {
  signature: string;
  timestamp: string;
  host: string;
  headers: Record<string, string>;
  body: Record<string, unknown>;
  path: string;
  queryStringParameters?: Record<string, string>;
}) {
  const requestData: RequestData = {
    httpMethod: "POST",
    path: input.path,
    headers: { Host: input.host, ...input.headers, "x-api-timestamp": input.timestamp },
    queryStringParameters: input.queryStringParameters,
    body: input.body,
  };
  const verifier = createVerify("SHA256");
  verifier.update(canonicalize(requestData));
  return verifier.verify(isProduction ? PRODUCTION_PUBLIC_KEY : BETA_PUBLIC_KEY, input.signature, "base64");
}
