import { NextResponse, NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// ISO 3166-2 region code to Chinese province mapping
const regionToProvince: Record<string, string> = {
  "BJ": "北京",
  "TJ": "天津",
  "HE": "河北",
  "SX": "山西",
  "NM": "内蒙古",
  "LN": "辽宁",
  "JL": "吉林",
  "HL": "黑龙江",
  "SH": "上海",
  "JS": "江苏",
  "ZJ": "浙江",
  "AH": "安徽",
  "FJ": "福建",
  "JX": "江西",
  "SD": "山东",
  "HA": "河南",
  "HB": "湖北",
  "HN": "湖南",
  "GD": "广东",
  "GX": "广西",
  "HI": "海南",
  "CQ": "重庆",
  "SC": "四川",
  "GZ": "贵州",
  "YN": "云南",
  "XZ": "西藏",
  "SN": "陕西",
  "GS": "甘肃",
  "QH": "青海",
  "NX": "宁夏",
  "XJ": "新疆",
  "TW": "台湾",
  "HK": "香港",
  "MO": "澳门"
};

export async function GET(request: NextRequest) {
  const headers = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0"
  };

  try {
    // 1. Check if caller passed a specific IP query parameter (for local developer override testing)
    const { searchParams } = new URL(request.url);
    const queryIp = searchParams.get("ip") || "";

    if (queryIp && queryIp !== "127.0.0.1" && queryIp !== "::1") {
      const response = await fetch(`http://ip-api.com/json/${queryIp}?lang=zh-CN`, {
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          let province = result.regionName || "";
          const cleanProvince = province
            .replace(/省|市|特别行政区|自治区/g, "")
            .replace(/维吾尔|回族|壮族/g, "")
            .trim();
          if (cleanProvince) {
            return NextResponse.json({ ip: queryIp, source: "query_api", province: cleanProvince }, { headers });
          }
        }
      }
    }

    // 2. Read native Vercel Edge Geolocation headers (for production Vercel serverless environment)
    const vercelRegion = request.headers.get("x-vercel-ip-country-region") || "";
    const clientIp = request.headers.get("x-forwarded-for") || "vercel-edge";
    if (vercelRegion) {
      const upperRegion = vercelRegion.toUpperCase();
      if (regionToProvince[upperRegion]) {
        return NextResponse.json({
          ip: clientIp.split(",")[0].trim(),
          source: "vercel_headers",
          province: regionToProvince[upperRegion]
        }, { headers });
      }
    }

    // 3. Fallback: Parse request headers for IP and resolve via ip-api.com
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.")) {
      // Try to fetch server's own public IP in dev
      try {
        const publicIpRes = await fetch("https://api.ipify.org?format=json", { 
          signal: AbortSignal.timeout(1500) 
        });
        if (publicIpRes.ok) {
          const data = await publicIpRes.json();
          if (data.ip) {
            ip = data.ip;
          }
        }
      } catch (e) {
        // use fallback Chinese IP
        ip = "113.116.142.12"; 
      }
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-CN`, {
      signal: AbortSignal.timeout(4000)
    });

    if (!response.ok) {
      throw new Error(`ip-api.com returned status ${response.status}`);
    }

    const result = await response.json();
    if (result.status !== "success") {
      throw new Error(`ip-api.com query status is ${result.status}`);
    }

    let province = result.regionName || "";
    const cleanProvince = province
      .replace(/省|市|特别行政区|自治区/g, "")
      .replace(/维吾尔|回族|壮族/g, "")
      .trim();

    return NextResponse.json({ 
      ip, 
      source: "fallback_api",
      province: cleanProvince || "北京"
    }, { headers });
  } catch (error: any) {
    console.error("IP Geolocation API error:", error);
    return NextResponse.json({ 
      ip: "127.0.0.1",
      source: "error_fallback",
      province: "北京",
      error: error.message 
    }, { headers });
  }
}
