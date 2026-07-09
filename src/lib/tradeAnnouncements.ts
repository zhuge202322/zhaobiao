export type TradeAnnouncement = {
  id: string;
  title: string;
  date: string;
  url: string;
  detailUrl: string;
  isNew?: boolean;
};

export type TradeAnnouncementDetail = {
  title: string;
  publishTime: string;
  source: string;
  contentHtml: string;
  originalUrl: string;
};

export const tradeAnnouncementSourceUrl = "https://www.ggzy.gov.cn/";

function decodeHtml(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function cleanText(value: string) {
  return decodeHtml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function toAbsoluteUrl(url: string) {
  return new URL(url, tradeAnnouncementSourceUrl).href;
}

export function getTradeAnnouncementId(url: string) {
  return url.match(/\/([^/]+)\.html(?:[?#].*)?$/)?.[1] ?? encodeURIComponent(url);
}

export function toTradeAnnouncement(input: Omit<TradeAnnouncement, "id" | "detailUrl">): TradeAnnouncement {
  const url = toAbsoluteUrl(input.url);
  return {
    ...input,
    url,
    id: getTradeAnnouncementId(url),
    detailUrl: url.replace("/html/a/", "/html/b/"),
  };
}

export const fallbackTradeAnnouncements: TradeAnnouncement[] = [
  toTradeAnnouncement({
    title: "北京师范大学云浮实验学校智慧校园及功能室建设项目招标公告",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/440000/0201/20260709/00441c76eca0c12741c3afe3d57d3dcedb6b.html",
    isNew: true,
  }),
  toTradeAnnouncement({
    title: "韩山师范学院2026年学生宿舍床位扩容配套家具采购项目招...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/440000/0201/20260709/0044ec828d9f88464d91978bb4396eb52265.html",
    isNew: true,
  }),
  toTradeAnnouncement({
    title: "2026年度办公设备采购项目竞争性磋商公告",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/460000/0201/20260709/0046f60d0c37d72b4e97a12c4c27d1bd9a81.html",
    isNew: true,
  }),
  toTradeAnnouncement({
    title: "海安市海安街道2026年老旧小区提升改造工程-绿景园小区...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/320000/0101/20260709/0032a4d6cb5736964c10b49e2ade8fa73d09.html",
  }),
  toTradeAnnouncement({
    title: "2026中国家庭户外运动挑战赛（平罗站）项目竞争性磋商采...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/640000/0201/20260709/006460b2a4debeff478ab5d307c0b2eb2c8c.html",
  }),
  toTradeAnnouncement({
    title: "荥经县教育局荥经县2026-2027学年义务教育阶段学生...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/510000/0201/20260709/005151cbff6d2515411293b1855c95ca675d.html",
  }),
  toTradeAnnouncement({
    title: "米易县住房和城乡建设局米易县乡镇生活污水处理厂市场化运行...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/510000/0201/20260709/00518b7e2b50a595481580e4c09fa7476d7c.html",
  }),
  toTradeAnnouncement({
    title: "平罗县陶乐镇庙庙湖村农产品集散暨农事服务中心项目施工招标...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/640000/0101/20260709/006452de4700f4e64b96938fcb8feaf7617d.html",
  }),
  toTradeAnnouncement({
    title: "四川文理学院2026年图书馆中文纸质图书和期刊竞争性磋商...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/510000/0201/20260709/005149e0434002e6471aa86b0bfc2c30750d.html",
  }),
  toTradeAnnouncement({
    title: "广宁县2026年水稻合理密植提单产项目竞争性磋商公告",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/440000/0201/20260709/00440c3e0b6145f04950bb142ac63abb07ce.html",
  }),
  toTradeAnnouncement({
    title: "广元市中心医院心血管超声及心功能科彩超（医疗设备更新建设...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/510000/0201/20260709/0051c092d6dca1634f37bff4833bb83a5718.html",
  }),
  toTradeAnnouncement({
    title: "川北医学院附属医院2026年血液透析机等一批医疗设备招标...",
    date: "2026-07-09",
    url: "https://www.ggzy.gov.cn/information/deal/html/a/510000/0201/20260709/0051826fa1d14ba64206af0c0cb5c15a1987.html",
  }),
];

export function parseTradeAnnouncements(html: string): TradeAnnouncement[] {
  const section = html.match(/<h4>\s*交易公告[\s\S]*?<ul>([\s\S]*?)<\/ul>/i)?.[1];
  if (!section) return [];

  const items: TradeAnnouncement[] = [];

  for (const match of section.matchAll(/<li([^>]*)>([\s\S]*?)<\/li>/gi)) {
    const liAttrs = match[1] ?? "";
    const block = match[2] ?? "";
    const link = block.match(/<a\s+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
    const date = block.match(/<span>\s*(\d{4}-\d{2}-\d{2})\s*<\/span>/i)?.[1];
    if (!link || !date) continue;

    const title = cleanText(link[2]);
    if (!title) continue;

    items.push(toTradeAnnouncement({
      title,
      date,
      url: link[1],
      isNew: /class=["'][^"']*\bon\b/i.test(liAttrs) || /new_on\.png/i.test(block),
    }));
  }

  return items;
}

export async function fetchTradeAnnouncements() {
  try {
    const response = await fetch(tradeAnnouncementSourceUrl, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 zhaobiao-notice-fetcher",
      },
    });

    if (!response.ok) {
      throw new Error(`Source responded with ${response.status}`);
    }

    const items = parseTradeAnnouncements(await response.text());
    return items.length > 0 ? items : fallbackTradeAnnouncements;
  } catch {
    return fallbackTradeAnnouncements;
  }
}

function removeDangerousMarkup(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<meta[\s\S]*?>/gi, "")
    .replace(/<link[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s+style\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/href\s*=\s*(['"])\s*javascript:[\s\S]*?\1/gi, 'href="#"');
}

function absolutizeContentLinks(html: string, baseUrl: string) {
  return html.replace(/\s(href|src)=["']([^"']+)["']/gi, (full, attr, rawUrl) => {
    try {
      return ` ${attr}="${new URL(rawUrl, baseUrl).href}"`;
    } catch {
      return full;
    }
  });
}

export function parseTradeAnnouncementDetail(html: string, announcement: TradeAnnouncement): TradeAnnouncementDetail {
  const title = cleanText(html.match(/<h4[^>]*class=["'][^"']*\bh4_o\b[^"']*["'][^>]*>([\s\S]*?)<\/h4>/i)?.[1] ?? announcement.title);
  const publishTime = cleanText(html.match(/发布时间：\s*([^<]+)</i)?.[1] ?? announcement.date);
  const source = cleanText(html.match(/信息来源：[\s\S]*?<label[^>]*>\s*([^<]+)\s*<\/label>/i)?.[1] ?? "全国公共资源交易平台");
  const contentStart = html.search(/<div\s+id=["']mycontent["'][^>]*>/i);
  const scriptStart = contentStart >= 0 ? html.indexOf("<script", contentStart) : -1;
  const rawContent = contentStart >= 0
    ? html.slice(contentStart, scriptStart > contentStart ? scriptStart : undefined)
    : `<p>${cleanText(html)}</p>`;
  const contentHtml = absolutizeContentLinks(removeDangerousMarkup(rawContent), announcement.detailUrl);

  return {
    title,
    publishTime,
    source,
    contentHtml,
    originalUrl: announcement.url,
  };
}

export async function getTradeAnnouncementById(id: string) {
  const items = await fetchTradeAnnouncements();
  return items.find((item) => item.id === id) ?? fallbackTradeAnnouncements.find((item) => item.id === id) ?? null;
}

export async function fetchTradeAnnouncementDetail(announcement: TradeAnnouncement) {
  try {
    const response = await fetch(announcement.detailUrl, {
      cache: "no-store",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 zhaobiao-detail-fetcher",
      },
    });

    if (!response.ok) {
      throw new Error(`Detail responded with ${response.status}`);
    }

    return parseTradeAnnouncementDetail(await response.text(), announcement);
  } catch {
    return {
      title: announcement.title,
      publishTime: announcement.date,
      source: "全国公共资源交易平台",
      contentHtml: `<p>${announcement.title}</p><p>公告正文正在同步中，请稍后刷新查看。</p>`,
      originalUrl: announcement.url,
    };
  }
}
