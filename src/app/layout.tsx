import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "政采通・政采服务云平台 — 政采、企采、央采一站式供应商服务中心",
  description: "政采通服务云平台由招采云服运营维护，提供全国政府采购平台入驻、电子卖场入驻、网上超市登记、CA锁办理、店铺商品代上架、店铺托管运营、标书编写、投标陪跑等数字化全流程对接服务。客服热线：400-999-8839。",
  keywords: "政府采购入驻, 电子卖场入驻, 网上超市, 招投标服务, CA锁办理, 标书代写, 店铺代运营, 商品上架",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans">
        {children}
      </body>
    </html>
  );
}
