import { NextResponse } from "next/server";
import { buildAlipayParams, getAlipayConfig, postToAlipay } from "@/lib/alipay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AlipayQueryResponse = {
  alipay_trade_query_response?: {
    code?: string;
    msg?: string;
    sub_code?: string;
    sub_msg?: string;
    out_trade_no?: string;
    trade_no?: string;
    trade_status?: string;
    total_amount?: string;
  };
};

export async function POST(request: Request) {
  try {
    const config = getAlipayConfig();
    if (!config) {
      return NextResponse.json({ ok: false, configMissing: true, message: "支付宝参数未配置完整。" });
    }

    const body = await request.json();
    const outTradeNo = String(body.outTradeNo || "");

    if (!outTradeNo) {
      return NextResponse.json({ ok: false, message: "缺少支付宝订单号" }, { status: 400 });
    }

    const params = buildAlipayParams(
      config,
      "alipay.trade.query",
      { out_trade_no: outTradeNo },
      { includeNotifyUrl: false }
    );

    const result = await postToAlipay<AlipayQueryResponse>(config, params);
    const payload = result.alipay_trade_query_response;

    if (!payload || payload.code !== "10000") {
      return NextResponse.json({
        ok: false,
        message: payload?.sub_msg || payload?.msg || "支付宝查询失败",
        alipayCode: payload?.code,
        alipaySubCode: payload?.sub_code,
      });
    }

    return NextResponse.json({
      ok: true,
      outTradeNo: payload.out_trade_no,
      tradeNo: payload.trade_no,
      tradeStatus: payload.trade_status,
      totalAmount: payload.total_amount,
      paid: payload.trade_status === "TRADE_SUCCESS" || payload.trade_status === "TRADE_FINISHED",
    });
  } catch (error) {
    console.error("Query Alipay order failed:", error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "支付宝查询异常" },
      { status: 500 }
    );
  }
}
