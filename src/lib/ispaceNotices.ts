export type IspaceNoticeType =
  | "TENDER_ANNOUNCEMENT"
  | "CHANGE_ANNOUNCEMENT"
  | "WIN_RESULT_ANNOUNCEMENT";

export type IspaceNoticeItem = {
  id: string;
  sourceId: string;
  title: string;
  date: string;
  type: IspaceNoticeType;
  typeLabel: string;
  orgName?: string;
  projectCode?: string;
  industry?: string;
  openTime?: string;
  deadline?: string;
  winner?: string;
  amount?: string;
  sourceUrl?: string;
  fields: string[];
};

export type IspaceNoticeGroupMap = Record<IspaceNoticeType, IspaceNoticeItem[]>;

export type IspaceNoticeDetail = IspaceNoticeItem & {
  contentHtml: string;
};

export const ispaceNoticeTabs: Array<{ label: string; type: IspaceNoticeType; typflag: string }> = [
  { label: "招标公告", type: "TENDER_ANNOUNCEMENT", typflag: "1" },
  { label: "变更公告", type: "CHANGE_ANNOUNCEMENT", typflag: "3" },
  { label: "中标结果公告", type: "WIN_RESULT_ANNOUNCEMENT", typflag: "6" },
];

export const emptyIspaceNoticeGroups = ispaceNoticeTabs.reduce((map, tab) => {
  map[tab.type] = [];
  return map;
}, {} as IspaceNoticeGroupMap);

const ispaceBaseUrl = "https://bd.ispacechina.com";

function labelForType(type: IspaceNoticeType) {
  return ispaceNoticeTabs.find((tab) => tab.type === type)?.label ?? "公告";
}

function typflagForType(type: IspaceNoticeType) {
  return ispaceNoticeTabs.find((tab) => tab.type === type)?.typflag ?? ispaceNoticeTabs[0].typflag;
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
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)));
}

function stripHtml(value = "") {
  return decodeHtml(value)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTitle(value = "") {
  return stripHtml(value)
    .replace(/^【[^】]{2,16}】/u, "")
    .replace(/【[^】]*C\d{8,}[^】]*】$/u, "")
    .trim();
}

function normalizeDate(value = "") {
  const match = value.match(/(\d{4})[/-](\d{1,2})[/-](\d{1,2})/u);
  if (!match) return "2026-07-10";
  return `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
}

function attr(block: string, name: string) {
  const match = block.match(new RegExp(`${name}="([^"]*)"`, "u"));
  return match ? decodeHtml(match[1]).trim() : "";
}

function absoluteSourceUrl(path = "") {
  if (!path) return undefined;
  try {
    return new URL(path, ispaceBaseUrl).href;
  } catch {
    return undefined;
  }
}

function fieldValue(fields: string[], label: string) {
  const item = fields.find((field) => field.startsWith(`${label}：`) || field.startsWith(`${label}:`));
  if (!item) return undefined;
  return item.replace(new RegExp(`^${label}[：:]\\s*`, "u"), "").trim();
}

function parseNoticeBlock(block: string, type: IspaceNoticeType): IspaceNoticeItem | null {
  const title = cleanTitle(block.match(/<h2>([\s\S]*?)<\/h2>/u)?.[1] ?? "");
  const sourceId = attr(block, "probid");
  const esid = attr(block, "esid");
  const sourcePath = block.match(/to_url\('([^']+)'/u)?.[1] ?? "";
  const date = normalizeDate(block.match(/<h3>[^<]*(\d{4}-\d{2}-\d{2})/u)?.[1] ?? "");
  const orgName = decodeHtml(block.match(/<label class="ellipsis title hand" title="([^"]*)"/u)?.[1] ?? "").trim();
  const bidWin = attr(block, "bidWin");
  const fields = Array.from(block.matchAll(/<li(?: class="[^"]*")?>([\s\S]*?)<\/li>/gu))
    .map((match) => stripHtml(match[1]).replace(/\s*\|\s*/g, ""))
    .filter(Boolean);

  if (!title || (!sourceId && !esid)) return null;

  const idSource = sourceId || esid;
  const winner = fieldValue(fields, "中标方") || bidWin || undefined;

  return {
    id: `${type}:${idSource}`,
    sourceId: idSource,
    title,
    date,
    type,
    typeLabel: labelForType(type),
    orgName: orgName || undefined,
    projectCode: fieldValue(fields, "招标编号") || sourceId || undefined,
    industry: fieldValue(fields, "招标行业"),
    openTime: fieldValue(fields, "开标时间"),
    deadline: fieldValue(fields, "文件购买截止时间"),
    winner,
    amount: fieldValue(fields, "中标金额"),
    sourceUrl: absoluteSourceUrl(sourcePath),
    fields,
  };
}

async function fetchIspaceHtml(type: IspaceNoticeType) {
  const response = await fetch(`${ispaceBaseUrl}/retrieve.do?typflag=${typflagForType(type)}`, {
    cache: "no-store",
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Mozilla/5.0 zhaobiao-ispace-fetcher",
      Referer: `${ispaceBaseUrl}/retrieve.do`,
    },
  });

  if (!response.ok) return "";
  return response.text();
}

export async function fetchIspaceNoticesByType(type: IspaceNoticeType, pageSize = 10) {
  const html = await fetchIspaceHtml(type);
  const marker = '<div class="menu_content_layer6_list hand searchContentSc"';
  const blocks = html
    .split(marker)
    .slice(1)
    .map((section) => `${marker}${section.split("<!-- 分页器 -->")[0]}`);

  return blocks
    .map((block) => parseNoticeBlock(block, type))
    .filter((item): item is IspaceNoticeItem => Boolean(item))
    .slice(0, pageSize);
}

export async function fetchIspaceNoticeGroups(pageSize = 10): Promise<IspaceNoticeGroupMap> {
  const entries = await Promise.all(
    ispaceNoticeTabs.map(async (tab) => [tab.type, await fetchIspaceNoticesByType(tab.type, pageSize)] as const),
  );

  return entries.reduce((map, [type, items]) => {
    map[type] = items;
    return map;
  }, { ...emptyIspaceNoticeGroups });
}

function detailFields(fields: Array<[string, string | undefined]>) {
  return fields
    .filter(([, value]) => Boolean(value))
    .map(([label, value]) => `<p><strong>${escapeHtml(label)}：</strong>${escapeHtml(value ?? "")}</p>`)
    .join("");
}

function buildDetailHtml(item: IspaceNoticeItem) {
  const primaryFields = detailFields([
    ["公告栏目", item.typeLabel],
    ["项目名称", item.title],
    ["招标编号", item.projectCode],
    ["发布单位", item.orgName],
    ["招标行业", item.industry],
    ["开标时间", item.openTime],
    ["文件购买截止时间", item.deadline],
    ["中标方", item.winner],
    ["中标金额", item.amount],
  ]);
  const extraFields = item.fields
    .filter((field) => !["招标编号", "招标行业", "开标时间", "文件购买截止时间", "中标方", "中标金额"].some((label) => field.startsWith(`${label}：`)))
    .map((field) => `<p>${escapeHtml(field)}</p>`)
    .join("");

  return `<div class="ceec-detail-fields">${primaryFields}${extraFields}</div>`;
}

export async function fetchIspaceNoticeDetail(code: string): Promise<IspaceNoticeDetail | null> {
  const separatorIndex = code.indexOf(":");
  if (separatorIndex < 0) return null;

  const type = code.slice(0, separatorIndex) as IspaceNoticeType;
  const sourceId = code.slice(separatorIndex + 1);
  if (!ispaceNoticeTabs.some((tab) => tab.type === type) || !sourceId) return null;

  const items = await fetchIspaceNoticesByType(type, 20);
  const item = items.find((notice) => notice.sourceId === sourceId);
  if (!item) return null;

  return {
    ...item,
    contentHtml: buildDetailHtml(item),
  };
}
