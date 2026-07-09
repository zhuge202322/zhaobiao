export type CeecNoticeType =
  | "PURCHASE_NOTICE"
  | "TENDER_ANNOUNCEMENT"
  | "PURCHASE_INFO_PUBLICITY";

export type CeecNoticeItem = {
  id: string;
  sourceId: string;
  title: string;
  date: string;
  type: CeecNoticeType;
  typeLabel: string;
  companyName?: string;
  projectCode?: string;
  category?: string;
};

export type CeecNoticeGroupMap = Record<CeecNoticeType, CeecNoticeItem[]>;

export type CeecNoticeDetail = CeecNoticeItem & {
  contentHtml: string;
  sourceUrl?: string;
};

type CeecRawNotice = {
  bigtype?: string;
  sys_id?: string;
  GongGaoBT?: string;
  GongGaoFBSJ?: string;
  YuGaoFBSJ?: string;
  YuGaoJZSJ?: string;
  YuJiCGBMSJ?: string;
  YuGaoZW?: string;
  CaiGouLB?: string;
  LianXiR?: string;
  LianXiDH?: string;
  ZhaoBiaoXMBH?: string;
  ZhaoBiaoXMMC?: string;
  ZhaoBiaoDW_JC?: string;
  BaoMingJZSJ?: string;
  FaBuZT?: string;
  bmzt?: string;
  zbxmbh?: string;
  zbxmmc?: string;
  ZhaoBiaoLB?: string;
  zbfsName?: string;
  ZhaoBiaoDW?: string;
  XiangMuJC?: string;
  XuYongDW?: string;
  XiangMuLX?: string;
  fbsj?: string;
};

type CeecTenderDetailResponse = {
  ZhaoBiaoXM?: Array<{
    ZhaoBiaoXMMC?: string;
    ZhaoBiaoXMBH?: string;
    ZhaoBiaoDW?: string;
    XuYongDW?: string;
    ZhaoBiaoLB?: string;
    zbfsName?: string;
  }>;
  ZhaoBiaoGG?: Array<{
    GongGaoBT?: string;
    GongGaoZW?: string;
    strGongGaoFBSJ?: string;
    strBaoMingJZSJ?: string;
    ReadCount?: number;
  }>;
};

const ceecAjaxBase = "https://ec.ceec.net.cn/ajaxpro";
const projectListAjaxUrl = `${ceecAjaxBase}/CeecBidWeb.HomeInfo.ProjectList,CeecBidWeb.ashx`;
const tenderDetailAjaxUrl = `${ceecAjaxBase}/CeecBidWeb.HomeInfo.ZhaoBiaoGG_Details,CeecBidWeb.ashx`;

export const ceecNoticeTabs: Array<{ label: string; type: CeecNoticeType; bigType: string }> = [
  { label: "采购预告", type: "PURCHASE_NOTICE", bigType: "QwBHAFkARwA=" },
  { label: "招标公告", type: "TENDER_ANNOUNCEMENT", bigType: "WgBCAEcARwA=" },
  { label: "采购信息公示", type: "PURCHASE_INFO_PUBLICITY", bigType: "WABNAFgAWABHAEcA" },
];

export const emptyCeecNoticeGroups = ceecNoticeTabs.reduce((map, tab) => {
  map[tab.type] = [];
  return map;
}, {} as CeecNoticeGroupMap);

function labelForType(type: CeecNoticeType) {
  return ceecNoticeTabs.find((tab) => tab.type === type)?.label ?? "公告";
}

function bigTypeForType(type: CeecNoticeType) {
  return ceecNoticeTabs.find((tab) => tab.type === type)?.bigType ?? ceecNoticeTabs[0].bigType;
}

function parseAjaxText(text: string) {
  return text.trim().replace(/;\/\*[\s\S]*$/u, "").replace(/;$/u, "");
}

async function ajaxProInvoke<T>(url: string, method: string, body: Record<string, unknown>): Promise<T | null> {
  const payload = JSON.stringify(body);
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "*/*",
      "Content-Type": "text/plain; charset=utf-8",
      "X-AjaxPro-Method": method,
      "User-Agent": "Mozilla/5.0 zhaobiao-ceec-fetcher",
      Referer: "https://ec.ceec.net.cn/HomeInfo/ProjectList.aspx",
    },
    body: payload,
  });

  if (!response.ok) return null;

  const raw = parseAjaxText(await response.text());
  const value = JSON.parse(raw) as string;
  return JSON.parse(value) as T;
}

async function ajaxProString(url: string, method: string, body: Record<string, unknown>) {
  const payload = JSON.stringify(body);
  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "*/*",
      "Content-Type": "text/plain; charset=utf-8",
      "X-AjaxPro-Method": method,
      "User-Agent": "Mozilla/5.0 zhaobiao-ceec-encoder",
      Referer: "https://ec.ceec.net.cn/HomeInfo/ProjectList.aspx",
    },
    body: payload,
  });

  if (!response.ok) return "";
  return JSON.parse(parseAjaxText(await response.text())) as string;
}

function normalizeDate(value = "") {
  const match = value.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/u);
  if (!match) return "2026-07-10";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function escapeHtml(value = "") {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTitlePrefix(value = "") {
  return value.replace(/^【?[^】]{2,14}】/u, "").replace(/^\[[^\]]{2,20}\]/u, "").trim();
}

function textToHtml(value = "") {
  const paragraphs = value
    .replace(/\r\n/g, "\n")
    .split(/\n{1,}/u)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!paragraphs.length) return "<p>暂无公告正文。</p>";

  return paragraphs.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function detailFields(fields: Array<[string, string | undefined]>) {
  return fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}：</strong>${escapeHtml(value ?? "")}</p>`)
    .join("");
}

function sourceIdForRaw(raw: CeecRawNotice, type: CeecNoticeType) {
  if (type === "PURCHASE_NOTICE") return raw.sys_id || "";
  if (type === "TENDER_ANNOUNCEMENT") return raw.ZhaoBiaoXMBH || "";
  return raw.sys_id || raw.zbxmbh || "";
}

function toNoticeItem(raw: CeecRawNotice, type: CeecNoticeType): CeecNoticeItem | null {
  const sourceId = sourceIdForRaw(raw, type);
  const title = stripTitlePrefix(raw.GongGaoBT || raw.ZhaoBiaoXMMC || raw.zbxmmc || "");

  if (!sourceId || !title) return null;

  return {
    id: `${type}:${sourceId}`,
    sourceId,
    title,
    date: normalizeDate(raw.YuGaoFBSJ || raw.GongGaoFBSJ || raw.fbsj || raw.BaoMingJZSJ),
    type,
    typeLabel: labelForType(type),
    companyName: raw.ZhaoBiaoDW_JC || raw.ZhaoBiaoDW || raw.XiangMuJC,
    projectCode: raw.ZhaoBiaoXMBH || raw.zbxmbh,
    category: raw.CaiGouLB || raw.ZhaoBiaoLB || raw.zbfsName,
  };
}

async function fetchRawCeecNotices(type: CeecNoticeType, pageSize = 10) {
  const data = await ajaxProInvoke<{ total?: number[]; maindata?: CeecRawNotice[][] }>(projectListAjaxUrl, "getdata", {
    _bigtype_base64: bigTypeForType(type),
    _smalltype_base64: "",
    _pageIndex: 1,
    _pageSize: pageSize,
  });

  return Array.isArray(data?.maindata?.[0]) ? data.maindata[0] : [];
}

export async function fetchCeecNoticesByType(type: CeecNoticeType, pageSize = 10) {
  const records = await fetchRawCeecNotices(type, pageSize);

  return records
    .map((record) => toNoticeItem(record, type))
    .filter((item): item is CeecNoticeItem => Boolean(item))
    .slice(0, pageSize);
}

export async function fetchCeecNoticeGroups(pageSize = 10): Promise<CeecNoticeGroupMap> {
  const entries = await Promise.all(
    ceecNoticeTabs.map(async (tab) => [tab.type, await fetchCeecNoticesByType(tab.type, pageSize)] as const),
  );

  return entries.reduce((map, [type, items]) => {
    map[type] = items;
    return map;
  }, { ...emptyCeecNoticeGroups });
}

function buildStructuredDetail(item: CeecNoticeItem, raw?: CeecRawNotice) {
  const fields = detailFields([
    ["公告栏目", item.typeLabel],
    ["采购项目编号", item.projectCode],
    ["采购项目名称", item.title],
    ["采购类别", item.category],
    ["采购单位", item.companyName],
    ["需用单位", raw?.XuYongDW],
    ["项目类型", raw?.XiangMuLX],
    ["采购方式", raw?.zbfsName],
    ["联系人", raw?.LianXiR],
    ["联系电话", raw?.LianXiDH],
  ]);

  return `<div class="ceec-detail-fields">${fields}</div>`;
}

async function buildTenderDetail(item: CeecNoticeItem) {
  const encodedProjectCode = await ajaxProString(projectListAjaxUrl, "encode", { s: item.sourceId });
  if (!encodedProjectCode) return null;

  const detail = await ajaxProInvoke<CeecTenderDetailResponse>(tenderDetailAjaxUrl, "GetZhaoBiaoGG", {
    _vProjectCode_EN: encodedProjectCode,
  });

  const project = detail?.ZhaoBiaoXM?.[0];
  const announcement = detail?.ZhaoBiaoGG?.[0];
  const title = stripTitlePrefix(announcement?.GongGaoBT || project?.ZhaoBiaoXMMC || item.title);

  return {
    ...item,
    title,
    date: normalizeDate(announcement?.strGongGaoFBSJ || item.date),
    companyName: project?.ZhaoBiaoDW || item.companyName,
    projectCode: project?.ZhaoBiaoXMBH || item.projectCode,
    category: project?.ZhaoBiaoLB || project?.zbfsName || item.category,
    contentHtml: textToHtml(announcement?.GongGaoZW || title),
    sourceUrl: `https://ec.ceec.net.cn/HomeInfo/ZhaoBiaoGG_Details.aspx?zbxmbh=${encodeURIComponent(encodedProjectCode)}`,
  } satisfies CeecNoticeDetail;
}

export async function fetchCeecNoticeDetail(code: string): Promise<CeecNoticeDetail | null> {
  const separatorIndex = code.indexOf(":");
  if (separatorIndex < 0) return null;

  const type = code.slice(0, separatorIndex) as CeecNoticeType;
  const sourceId = code.slice(separatorIndex + 1);
  if (!ceecNoticeTabs.some((tab) => tab.type === type) || !sourceId) return null;

  const rawRecords = await fetchRawCeecNotices(type, 30);
  const raw = rawRecords.find((record) => sourceIdForRaw(record, type) === sourceId);
  const item = raw ? toNoticeItem(raw, type) : null;
  if (!item) return null;

  if (type === "TENDER_ANNOUNCEMENT") {
    const tenderDetail = await buildTenderDetail(item);
    if (tenderDetail) return tenderDetail;
  }

  if (type === "PURCHASE_NOTICE") {
    return {
      ...item,
      contentHtml: textToHtml(raw?.YuGaoZW || item.title),
      sourceUrl: `https://ec.ceec.net.cn/HomeInfo/YuGao_Detail.aspx?threadID=${encodeURIComponent(sourceId)}`,
    };
  }

  return {
    ...item,
    contentHtml: buildStructuredDetail(item, raw),
    sourceUrl: `https://ec.ceec.net.cn/HomeInfo/NewsDetails.aspx?bigtype=${encodeURIComponent(bigTypeForType(type))}&flag=xmxxgg&threadID=${encodeURIComponent(sourceId)}`,
  };
}
