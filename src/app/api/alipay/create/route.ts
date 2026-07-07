import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { buildAlipayParams, getAlipayConfig, postToAlipay } from "@/lib/alipay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AlipayPrecreateResponse = {
  alipay_trade_precreate_response?: {
    code?: string;
    msg?: string;
    sub_code?: string;
    sub_msg?: string;
    out_trade_no?: string;
    qr_code?: string;
  };
};

export async function POST(request: Request) {
  try {
    const config = getAlipayConfig();
    if (!config) {
      return NextResponse.json(
        {
          ok: false,
          configMissing: true,
          message: "支付宝参数未配置完整，请配置 ALIPAY_APP_ID、ALIPAY_APP_PRIVATE_KEY、ALIPAY_NOTIFY_URL。",
        },
        { status: 200 }
      );
    }

    const body = await request.json();
    const amount = Number(body.amount || 0);
    const orderNumber = String(body.orderNumber || "");
    const companyName = String(body.companyName || "供应商入驻客户");
    const subject = String(body.subject || "政采平台入驻服务费").slice(0, 256);

    if (!orderNumber) {
      return NextResponse.json({ ok: false, message: "缺少订单号" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, message: "支付金额不正确" }, { status: 400 });
    }

    const outTradeNo = `ZB${orderNumber}`;
    const params = buildAlipayParams(config, "alipay.trade.precreate", {
      out_trade_no: outTradeNo,
      total_amount: amount.toFixed(2),
      subject,
      body: `${companyName} - ${subject}`,
      timeout_express: "30m",
    });

    const result = await postToAlipay<AlipayPrecreateResponse>(config, params);
    const payload = result.alipay_trade_precreate_response;

    if (!payload || payload.code !== "10000" || !payload.qr_code) {
      return NextResponse.json(
        {
          ok: false,
          message: payload?.sub_msg || payload?.msg || "支付宝预下单失败",
          alipayCode: payload?.code,
          alipaySubCode: payload?.sub_code,
        },
        { status: 200 }
      );
    }

    const qrCodeImage = await QRCode.toDataURL(payload.qr_code, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 220,
    });

    return NextResponse.json({
      ok: true,
      outTradeNo: payload.out_trade_no || outTradeNo,
      qrCode: payload.qr_code,
      qrCodeImage,
    });
  } catch (error) {
    console.error("Create Alipay order failed:", error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "支付宝下单异常" },
      { status: 500 }
    );
  }
}
