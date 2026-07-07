import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allArticleIds,
  articles,
  getArticleById,
} from "@/lib/articles";

export function generateStaticParams() {
  return allArticleIds.map((id) => ({ id }));
}

export async function generateMetadata(props: PageProps<"/article/[id]">) {
  const { id } = await props.params;
  const article = getArticleById(decodeURIComponent(id));

  return {
    title: article ? `${article.title} - 政采信息服务平台` : "文章详情 - 政采信息服务平台",
    description: article?.content.slice(0, 120),
  };
}

export default async function ArticlePage(props: PageProps<"/article/[id]">) {
  const { id } = await props.params;
  const article = getArticleById(decodeURIComponent(id));

  if (!article) {
    notFound();
  }

  const currentIndex = articles.findIndex((item) => item.id === article.id);
  const previousArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const contentBlocks = article.content.split("\n").filter((line) => line.trim().length > 0);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <div className="border-b border-gray-200 bg-white text-xs text-[#222]">
        <div className="mx-auto flex h-9 w-full max-w-[1200px] items-center justify-between px-4">
          <div className="hidden sm:block">
            您好，欢迎来到 政采信息服务平台 <span className="font-semibold">● 河北</span>
          </div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <span>服务热线：400-1688-363</span>
            <Link href="/" className="hover:text-[#2f8df7]">
              首页
            </Link>
            <span className="hidden md:inline">采购公告</span>
            <span className="hidden md:inline">入驻大厅</span>
            <span className="hidden md:inline">会员中心</span>
          </div>
        </div>
      </div>

      <header className="bg-[linear-gradient(180deg,#eef8ff_0%,#dff0ff_100%)]">
        <div className="mx-auto flex min-h-[128px] w-full max-w-[1200px] flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="政采通" className="h-14 w-14 object-contain" />
            <div>
              <div className="text-[30px] font-bold tracking-wide text-[#222]">政采通政采服务云平台</div>
              <div className="mt-1 text-[13px] uppercase tracking-[2px] text-[#555]">
                Zheng Cai Tong Zheng Cai Fu Wu Yun Ping Tai
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-3 md:items-end">
            <div className="flex h-[52px] w-full max-w-[450px] overflow-hidden border-2 border-[#3991f6] bg-white md:w-[450px]">
              <div className="flex flex-1 items-center px-4 text-sm text-gray-500">请输入搜索关键字</div>
              <button className="w-[102px] bg-[#3991f6] text-base font-bold text-white">搜索</button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {["热点", "供应商注册", "电子交易", "项目采购", "网上超市"].map((tag) => (
                <span key={tag} className="bg-white px-3 py-1.5 text-[#2f8df7] shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden text-right md:block">
            <div className="whitespace-nowrap text-[22px] tracking-[4px] text-[#222]">公平 / 公正 / 公开</div>
            <div className="mt-1 whitespace-nowrap text-[16px] uppercase tracking-[6px] text-gray-400">Open Fair Just</div>
          </div>
        </div>
      </header>

      <nav className="bg-[#3991f6]">
        <div className="mx-auto flex h-[53px] w-full max-w-[1200px] items-center overflow-x-auto px-4 text-[15px] font-semibold text-white">
          {[
            "首页",
            "供应商入驻",
            "CA锁办理",
            "供应商入驻和CA锁",
            "供应商账户重置",
            "投标报名",
            "搭建政采店铺",
            "店铺产品上架",
            "政采竞价",
            "上传标书",
          ].map((item, index) => (
            <Link
              key={item}
              href="/"
              className={`flex h-full shrink-0 items-center px-3 hover:bg-[#1871d7] ${index === 0 ? "border-b-4 border-[#ffd900]" : ""}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <div className="mb-3 text-sm text-[#333]">
          当前位置： <Link href="/" className="hover:text-[#3991f6]">首页</Link> &gt; 资讯 &gt; 详情
        </div>

        <section className="border border-[#d8d8d8] bg-white">
          <div className="inline-flex bg-[#3991f6] px-3 py-1.5 text-sm font-bold text-white">
            {article.categoryLabel}
          </div>
          <div className="px-6 pb-6 pt-1 text-center">
            <h1 className="mx-auto max-w-[960px] text-xl font-bold leading-8 text-[#111] md:text-[22px]">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-12 gap-y-2 text-sm text-gray-500">
              <span>来源：{article.source}</span>
              <span>浏览次数：{article.views}</span>
            </div>
          </div>
        </section>

        <article className="mt-3 border border-[#d8d8d8] bg-white px-5 py-6 md:px-7">
          <div className="min-h-[620px] text-[15px] leading-[1.8] text-[#111]">
            {contentBlocks.map((line, index) => {
              const isHeading = /^[一二三四五六七八九十]+、/.test(line) || /^项目概况/.test(line);
              return (
                <p key={`${line}-${index}`} className={isHeading ? "mt-2 font-semibold" : ""}>
                  {line}
                </p>
              );
            })}

            <div className="mt-10 border-t border-dashed border-gray-300 pt-5 text-sm leading-7">
              <p>
                免责声明：转载文章和图片均来自公开网络，版权归作者本人所有，推送文章除非无法确认，我们都会注明作者和来源。如出现有关或侵犯到原作者权益，请与我们联系删除或授权事宜。
              </p>
            </div>

            <div className="mt-6 space-y-1 text-sm font-semibold">
              <p>
                上一篇：
                {previousArticle ? (
                  <Link href={`/article/${previousArticle.id}`} className="hover:text-[#3991f6]">
                    {previousArticle.title}
                  </Link>
                ) : (
                  "没有了"
                )}
              </p>
              <p>
                下一篇：
                {nextArticle ? (
                  <Link href={`/article/${nextArticle.id}`} className="hover:text-[#3991f6]">
                    {nextArticle.title}
                  </Link>
                ) : (
                  "没有了"
                )}
              </p>
            </div>
          </div>
        </article>
      </main>

      <footer className="mt-6 border-t border-gray-300 py-6 text-center text-xs text-gray-500">
        Copyright © 2026 政采通政采服务云平台 All Rights Reserved.
      </footer>
    </div>
  );
}
