import crypto from "crypto";

export type AlipayConfig = {
  appId: string;
  appPrivateKey: string;
  alipayPublicKey: string;
  gateway: string;
  notifyUrl: string;
};

type AlipayCommonParams = Record<string, string>;

const DEFAULT_GATEWAY = "https://openapi.alipay.com/gateway.do";

export const getAlipayConfig = (): AlipayConfig | null => {
  const appId = process.env.ALIPAY_APP_ID || "";
  const appPrivateKey = process.env.ALIPAY_APP_PRIVATE_KEY || "";
  const alipayPublicKey = process.env.ALIPAY_PUBLIC_KEY || "";
  const notifyUrl = process.env.ALIPAY_NOTIFY_URL || "";

  if (!appId || !appPrivateKey || !notifyUrl) {
    return null;
  }

  return {
    appId,
    appPrivateKey,
    alipayPublicKey,
    gateway: process.env.ALIPAY_GATEWAY || DEFAULT_GATEWAY,
    notifyUrl,
  };
};

const normalizeKeyBody = (key: string) => {
  return key
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .trim();
};

const formatKey = (key: string, type: "PRIVATE" | "PUBLIC") => {
  const trimmed = normalizeKeyBody(key);

  if (trimmed.includes("-----BEGIN")) {
    return trimmed;
  }

  const body = trimmed.match(/.{1,64}/g)?.join("\n") || trimmed;
  return `-----BEGIN ${type} KEY-----\n${body}\n-----END ${type} KEY-----`;
};

const formatRsaPrivateKey = (key: string) => {
  const trimmed = key
    .replace(/\\n/g, "\n")
    .replace(/\r/g, "")
    .trim();

  if (trimmed.includes("-----BEGIN")) {
    return trimmed;
  }

  const body = trimmed.match(/.{1,64}/g)?.join("\n") || trimmed;
  return `-----BEGIN RSA PRIVATE KEY-----\n${body}\n-----END RSA PRIVATE KEY-----`;
};

const getTimestamp = () => {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    " ",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
    ":",
    pad(date.getSeconds()),
  ].join("");
};

export const buildSignContent = (params: Record<string, string>) => {
  return Object.keys(params)
    .filter((key) => key !== "sign" && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
};

export const signAlipayParams = (params: AlipayCommonParams, privateKey: string) => {
  const signContent = buildSignContent(params);
  const sign = (key: string) =>
    crypto.createSign("RSA-SHA256").update(signContent, "utf8").sign(key, "base64");

  try {
    return sign(formatKey(privateKey, "PRIVATE"));
  } catch (error) {
    return sign(formatRsaPrivateKey(privateKey));
  }
};

export const verifyAlipayParams = (params: Record<string, string>, alipayPublicKey: string) => {
  if (!alipayPublicKey || !params.sign) return false;
  const signContent = buildSignContent(params);
  return crypto
    .createVerify("RSA-SHA256")
    .update(signContent, "utf8")
    .verify(formatKey(alipayPublicKey, "PUBLIC"), params.sign, "base64");
};

export const buildAlipayParams = (
  config: AlipayConfig,
  method: string,
  bizContent: Record<string, unknown>,
  options: { includeNotifyUrl?: boolean } = {}
) => {
  const params: AlipayCommonParams = {
    app_id: config.appId,
    method,
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: getTimestamp(),
    version: "1.0",
    biz_content: JSON.stringify(bizContent),
  };

  if (options.includeNotifyUrl !== false) {
    params.notify_url = config.notifyUrl;
  }

  return {
    ...params,
    sign: signAlipayParams(params, config.appPrivateKey),
  };
};

export const postToAlipay = async <T>(config: AlipayConfig, params: Record<string, string>) => {
  const response = await fetch(config.gateway, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams(params).toString(),
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Alipay gateway returned ${response.status}: ${text}`);
  }

  return JSON.parse(text) as T;
};
