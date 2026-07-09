import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchIspaceNoticeDetail } from "@/lib/ispaceNotices";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/ispace-notice/[code]">) {
  const { code } = await props.params;
  const notice = await fetchIspaceNoticeDetail(decodeURIComponent(code));

  return {
    title: notice ? `${notice.title} - 全国政采云服务云平台` : "公告详情 - 全国政采云服务云平台",
    description: notice?.title,
  };
}

export default async function IspaceNoticePage(props: PageProps<"/ispace-notice/[code]">) {
  const { code } = await props.params;
  const notice = await fetchIspaceNoticeDetail(decodeURIComponent(code));

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <div className="border-b border-gray-200 bg-white text-xs text-[#222]">
        <div className="mx-auto flex h-9 w-full max-w-[1200px] items-center justify-between px-4">
          <div className="hidden sm:block">
            您好，欢迎来到 政采信息服务平台 <span className="font-semibold">● 河北</span>
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <span>服务热线：400-999-8839</span>
            <Link href="/" className="hover:text-[#2f8df7]">
              首页
            </Link>
            <span className="hidden md:inline">军队采购</span>
            <span className="hidden md:inline">入驻大厅</span>
            <span className="hidden md:inline">会员中心</span>
          </div>
        </div>
      </div>

      <header className="bg-[linear-gradient(180deg,#eef8ff_0%,#dff0ff_100%)]">
        <div className="mx-auto flex min-h-[128px] w-full max-w-[1200px] flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="全国政采云服务云平台" className="h-14 w-14 object-contain" />
            <div>
              <div className="text-[30px] font-bold tracking-wide text-[#222]">全国政采云服务云平台</div>
              <div className="mt-1 text-[13px] uppercase tracking-[2px] text-[#555]">
                Quan Guo Zheng Cai Yun Fu Wu Yun Ping Tai
              </div>
            </div>
          </Link>

          <div className="hidden text-right md:block">
            <div className="whitespace-nowrap text-[22px] tracking-[4px] text-[#222]">公平 / 公正 / 公开</div>
            <div className="mt-1 whitespace-nowrap text-[16px] uppercase tracking-[6px] text-gray-400">Open Fair Just</div>
          </div>
        </div>
      </header>

      <nav className="bg-[#3991f6]">
        <div className="mx-auto flex h-[53px] w-full max-w-[1200px] items-center overflow-x-auto px-4 text-[15px] font-semibold text-white">
          {["首页", "供应商入驻", "平台公告", "央国企采购", "军队采购", "服务中心", "付费指导"].map((item, index) => (
            <Link
              key={item}
              href={index === 0 ? "/" : "#"}
              className={`flex h-full shrink-0 items-center px-4 hover:bg-[#1871d7] ${index === 4 ? "border-b-4 border-[#ffd900]" : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <div className="mb-3 text-sm text-[#333]">
          当前位置：<Link href="/" className="hover:text-[#3991f6]">首页</Link> &gt; 军队采购 &gt; 详情
        </div>

        <section className="border border-[#d8d8d8] bg-white">
          <div className="inline-flex bg-[#3991f6] px-3 py-1.5 text-sm font-bold text-white">
            {notice.typeLabel}
          </div>
          <div className="px-6 pb-6 pt-2 text-center">
            <h1 className="mx-auto max-w-[960px] text-xl font-bold leading-8 text-[#111] md:text-[22px]">
              {notice.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm text-gray-500">
              {notice.orgName && <span>发布单位：{notice.orgName}</span>}
              {notice.winner && <span>中标单位：{notice.winner}</span>}
              {notice.projectCode && <span>项目编号：{notice.projectCode}</span>}
              {notice.industry && <span>采购类型：{notice.industry}</span>}
            </div>
          </div>
        </section>

        <article className="mt-3 border border-[#d8d8d8] bg-white px-5 py-6 md:px-7">
          <div
            className="announcement-detail-content min-h-[620px]"
            dangerouslySetInnerHTML={{ __html: notice.contentHtml }}
          />
        </article>
      </main>

      <footer className="mt-6 border-t border-gray-300 py-6 text-center text-xs text-gray-500">
        Copyright © 2026 全国政采云服务云平台 All Rights Reserved.
      </footer>
    </div>
  );
}
