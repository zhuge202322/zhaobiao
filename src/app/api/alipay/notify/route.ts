import { NextResponse } from "next/server";
import { getAlipayConfig, verifyAlipayParams } from "@/lib/alipay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = String(value);
    });

    const config = getAlipayConfig();
    if (!config?.alipayPublicKey) {
      console.error("Alipay notify received but ALIPAY_PUBLIC_KEY is not configured.");
      return new Response("failure", { status: 200 });
    }

    const verified = verifyAlipayParams(params, config.alipayPublicKey);
    if (!verified) {
      console.error("Alipay notify signature verification failed.", params.out_trade_no);
      return new Response("failure", { status: 200 });
    }

    const paid = params.trade_status === "TRADE_SUCCESS" || params.trade_status === "TRADE_FINISHED";

    // 当前项目会员数据保存在浏览器 localStorage，服务端无法直接更新。
    // 这里先完成验签与回调接收；后续如果接入数据库，可在 paid 为 true 时写入订单状态。
    console.log("Alipay notify verified:", {
      outTradeNo: params.out_trade_no,
      tradeNo: params.trade_no,
      tradeStatus: params.trade_status,
      paid,
    });

    return new Response("success", { status: 200 });
  } catch (error) {
    console.error("Alipay notify handling failed:", error);
    return new Response("failure", { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, message: "Alipay notify endpoint is ready." });
}
