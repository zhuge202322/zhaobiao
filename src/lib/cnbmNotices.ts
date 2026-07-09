export type CnbmNoticeType =
  | "TENDER_ANNOUNCEMENT"
  | "PROCUREMENT_ANNOUNCEMENT"
  | "BID_ANNOUNCEMENT"
  | "RESULT_ANNOUNCEMENT";

export type CnbmNoticeItem = {
  id: string;
  title: string;
  date: string;
  type: CnbmNoticeType;
  typeLabel: string;
  companyName?: string;
  projectCode?: string;
  status?: string;
  newBadge?: boolean;
};

export type CnbmNoticeGroupMap = Record<CnbmNoticeType, CnbmNoticeItem[]>;

export type CnbmNoticeDetail = CnbmNoticeItem & {
  contentHtml: string;
  sourceUrl?: string;
  releaseTime?: string;
};

type CnbmRawNotice = {
  businessCode?: string;
  businessTitle?: string;
  businessCreateTime?: string;
  releaseTime?: string;
  polymerizeTypeName?: string;
  companyName?: string;
  companyShortName?: string;
  projectCode?: string;
  pastDueName?: string;
  contentText?: string;
  noticeTitle?: string;
  sourceUrl?: string;
  selfType?: string;
};

const cnbmApiBase = "https://c.cnbm.com.cn/portal-sso";

export const cnbmNoticeTabs: Array<{ label: string; type: CnbmNoticeType }> = [
  { label: "招标公告", type: "TENDER_ANNOUNCEMENT" },
  { label: "采购公告", type: "PROCUREMENT_ANNOUNCEMENT" },
  { label: "中标公告", type: "BID_ANNOUNCEMENT" },
  { label: "结果公告", type: "RESULT_ANNOUNCEMENT" },
];

export const emptyCnbmNoticeGroups = cnbmNoticeTabs.reduce((map, tab) => {
  map[tab.type] = [];
  return map;
}, {} as CnbmNoticeGroupMap);

function labelForType(type: CnbmNoticeType) {
  return cnbmNoticeTabs.find((tab) => tab.type === type)?.label ?? "公告";
}

function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function sanitizeHtml(html = "") {
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

function toNoticeItem(raw: CnbmRawNotice, type: CnbmNoticeType): CnbmNoticeItem | null {
  const id = raw.businessCode;
  const title = stripHtml(raw.businessTitle || raw.noticeTitle || "");

  if (!id || !title) return null;

  return {
    id,
    title,
    date: (raw.businessCreateTime || raw.releaseTime || "").slice(0, 10) || "2026-07-10",
    type,
    typeLabel: raw.polymerizeTypeName || labelForType(type),
    companyName: raw.companyShortName || raw.companyName,
    projectCode: raw.projectCode,
    status: raw.pastDueName,
    newBadge: true,
  };
}

export async function fetchCnbmNoticesByType(type: CnbmNoticeType, pageSize = 8) {
  const response = await fetch(`${cnbmApiBase}/portal/index/query`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 zhaobiao-cnbm-fetcher",
    },
    body: JSON.stringify({
      noticePolymerizeType: type,
      pageNum: 1,
      pageSize,
      projectTypeList: [],
      releaseDateStart: "",
      releaseDateEnd: "",
      keyword: "",
      businessType: "NOTICE",
    }),
  });

  if (!response.ok) return [];

  const data = await response.json();
  const records = Array.isArray(data?.data?.records) ? data.data.records as CnbmRawNotice[] : [];

  return records
    .map((record) => toNoticeItem(record, type))
    .filter((item): item is CnbmNoticeItem => Boolean(item))
    .slice(0, pageSize);
}

export async function fetchCnbmNoticeGroups(pageSize = 8): Promise<CnbmNoticeGroupMap> {
  const entries = await Promise.all(
    cnbmNoticeTabs.map(async (tab) => [tab.type, await fetchCnbmNoticesByType(tab.type, pageSize)] as const),
  );

  return entries.reduce((map, [type, items]) => {
    map[type] = items;
    return map;
  }, { ...emptyCnbmNoticeGroups });
}

export async function fetchCnbmNoticeDetail(code: string): Promise<CnbmNoticeDetail | null> {
  const response = await fetch(`${cnbmApiBase}/bid/queryByCodeFromNotice?noticeCode=${encodeURIComponent(code)}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": "Mozilla/5.0 zhaobiao-cnbm-detail-fetcher",
    },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const raw = data?.data as CnbmRawNotice | undefined;
  if (!raw) return null;

  const type = (raw.selfType && cnbmNoticeTabs.some((tab) => tab.type === raw.selfType)
    ? raw.selfType
    : "TENDER_ANNOUNCEMENT") as CnbmNoticeType;
  const item = toNoticeItem({ ...raw, businessCode: code, businessTitle: raw.noticeTitle || raw.businessTitle }, type);
  if (!item) return null;

  return {
    ...item,
    releaseTime: raw.releaseTime,
    sourceUrl: raw.sourceUrl,
    contentHtml: sanitizeHtml(raw.contentText || `<p>${item.title}</p>`),
  };
}
