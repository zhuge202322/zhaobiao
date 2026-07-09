export type YgcgNoticeType =
  | "PROCUREMENT_NOTICE"
  | "CHANGE_NOTICE"
  | "RESULT_PUBLICITY";

export type YgcgNoticeItem = {
  id: string;
  sourceId: string;
  title: string;
  date: string;
  type: YgcgNoticeType;
  typeLabel: string;
  companyName?: string;
  projectCode?: string;
  category?: string;
  mode?: string;
  region?: string;
  sourceUrl?: string;
};

export type YgcgNoticeGroupMap = Record<YgcgNoticeType, YgcgNoticeItem[]>;

export type YgcgNoticeDetail = YgcgNoticeItem & {
  contentHtml: string;
};

type YgcgRawNotice = {
  categorynum?: string;
  zhuanzai?: string;
  title?: string;
  realtitle?: string;
  infoc?: string;
  content?: string;
  infob?: string;
  webdate?: string;
  infodate?: string;
  citytype?: string;
  cglb?: string;
  linkurl?: string;
  id?: string;
};

type YgcgSearchResponse = {
  result?: {
    totalcount?: number;
    records?: YgcgRawNotice[];
  };
};

const ygcgBaseUrl = "http://yantai.ygcgfw.com";
const ygcgSearchUrl = `${ygcgBaseUrl}/inteligentsearchnew/rest/esinteligentsearch/getFullTextDataNew`;
const ygcgSearchCategory = "004";

export const ygcgNoticeTabs: Array<{ label: string; type: YgcgNoticeType; category: string }> = [
  { label: "采购公告", type: "PROCUREMENT_NOTICE", category: "001002001" },
  { label: "变更公告", type: "CHANGE_NOTICE", category: "001002002" },
  { label: "结果公示", type: "RESULT_PUBLICITY", category: "001002003" },
];

export const emptyYgcgNoticeGroups = ygcgNoticeTabs.reduce((map, tab) => {
  map[tab.type] = [];
  return map;
}, {} as YgcgNoticeGroupMap);

function labelForType(type: YgcgNoticeType) {
  return ygcgNoticeTabs.find((tab) => tab.type === type)?.label ?? "公告";
}

function categoryForType(type: YgcgNoticeType) {
  return ygcgNoticeTabs.find((tab) => tab.type === type)?.category ?? ygcgNoticeTabs[0].category;
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&emsp;/gi, " ")
    .replace(/&ensp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#xa0;/gi, " ")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(value = "") {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\uFEFF/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value = "") {
  const match = value.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/u);
  if (!match) return "2026-07-10";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function absoluteSourceUrl(path = "") {
  if (!path) return undefined;
  try {
    return new URL(path, ygcgBaseUrl).href;
  } catch {
    return undefined;
  }
}

function titleFromRaw(raw: YgcgRawNotice) {
  return stripHtml(raw.realtitle || raw.title || "");
}

function sourceIdFromRaw(raw: YgcgRawNotice) {
  const fromLink = raw.linkurl?.match(/\/([0-9a-f-]{20,})\.html$/iu)?.[1];
  return fromLink || raw.id || raw.linkurl || raw.infoc || "";
}

function toNoticeItem(raw: YgcgRawNotice, type: YgcgNoticeType): YgcgNoticeItem | null {
  const sourceId = sourceIdFromRaw(raw);
  const title = titleFromRaw(raw);

  if (!sourceId || !title) return null;

  return {
    id: `${type}:${sourceId}`,
    sourceId,
    title,
    date: normalizeDate(raw.webdate || raw.infodate),
    type,
    typeLabel: labelForType(type),
    companyName: stripHtml(raw.zhuanzai || "") || undefined,
    projectCode: stripHtml(raw.infoc || "") || undefined,
    category: stripHtml(raw.cglb || "") || undefined,
    mode: stripHtml(raw.infob || "") || undefined,
    region: stripHtml(raw.citytype || "") || undefined,
    sourceUrl: absoluteSourceUrl(raw.linkurl),
  };
}

async function fetchRawYgcgNotices(type: YgcgNoticeType, pageSize = 10) {
  const category = categoryForType(type);
  const response = await fetch(ygcgSearchUrl, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json,text/plain,*/*",
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 zhaobiao-ygcg-fetcher",
      Referer: `${ygcgBaseUrl}/gggs/001002/${category}/subpage-gggs.html`,
    },
    body: JSON.stringify({
      token: "",
      pn: 0,
      rn: pageSize,
      sdt: "",
      edt: "",
      wd: "apple",
      inc_wd: "",
      exc_wd: "",
      fields: "gudingname",
      cnum: ygcgSearchCategory,
      sort: "{\"webdate\":0}",
      ssort: "gudingname",
      cl: 1000,
      terminal: "",
      condition: [
        {
          fieldName: "categorynum",
          equal: category,
          notEqual: null,
          equalList: null,
          notEqualList: null,
          isLike: true,
          likeType: "2",
        },
      ],
      time: [],
      highlights: "gudingname",
      statistics: null,
      unionCondition: null,
      accuracy: "",
      noParticiple: "0",
      searchRange: null,
    }),
  });

  if (!response.ok) return [];
  const data = JSON.parse(await response.text()) as YgcgSearchResponse;
  return Array.isArray(data.result?.records) ? data.result.records : [];
}

export async function fetchYgcgNoticesByType(type: YgcgNoticeType, pageSize = 10) {
  const records = await fetchRawYgcgNotices(type, pageSize);

  return records
    .map((record) => toNoticeItem(record, type))
    .filter((item): item is YgcgNoticeItem => Boolean(item))
    .slice(0, pageSize);
}

export async function fetchYgcgNoticeGroups(pageSize = 10): Promise<YgcgNoticeGroupMap> {
  const entries = await Promise.all(
    ygcgNoticeTabs.map(async (tab) => [tab.type, await fetchYgcgNoticesByType(tab.type, pageSize)] as const),
  );

  return entries.reduce((map, [type, items]) => {
    map[type] = items;
    return map;
  }, { ...emptyYgcgNoticeGroups });
}

function textToHtml(value = "") {
  const text = stripHtml(value);
  if (!text) return "<p>暂无公告正文。</p>";

  const normalized = text
    .replace(/([一二三四五六七八九十]+、)/gu, "\n$1")
    .replace(/(\d+[.、]\s*)/gu, "\n$1")
    .replace(/(联系方式|采购人|代理机构|联系人|联系电话|地址)：/gu, "\n$1：");

  const paragraphs = normalized
    .split(/\n+/u)
    .map((line) => line.trim())
    .filter(Boolean);

  return paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function detailFields(fields: Array<[string, string | undefined]>) {
  return fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}：</strong>${escapeHtml(value ?? "")}</p>`)
    .join("");
}

function buildStructuredDetail(item: YgcgNoticeItem, raw?: YgcgRawNotice) {
  const fields = detailFields([
    ["公告栏目", item.typeLabel],
    ["项目名称", item.title],
    ["项目编号", item.projectCode],
    ["信息来源", item.companyName],
    ["采购类别", item.category],
    ["采购方式", item.mode],
    ["项目所属", item.region],
  ]);

  return `<div class="ceec-detail-fields">${fields}</div>${textToHtml(raw?.content || item.title)}`;
}

export async function fetchYgcgNoticeDetail(code: string): Promise<YgcgNoticeDetail | null> {
  const separatorIndex = code.indexOf(":");
  if (separatorIndex < 0) return null;

  const type = code.slice(0, separatorIndex) as YgcgNoticeType;
  const sourceId = code.slice(separatorIndex + 1);
  if (!ygcgNoticeTabs.some((tab) => tab.type === type) || !sourceId) return null;

  const records = await fetchRawYgcgNotices(type, 10);
  const raw = records.find((record) => sourceIdFromRaw(record) === sourceId);
  const item = raw ? toNoticeItem(raw, type) : null;
  if (!item) return null;

  return {
    ...item,
    contentHtml: buildStructuredDetail(item, raw),
  };
}
