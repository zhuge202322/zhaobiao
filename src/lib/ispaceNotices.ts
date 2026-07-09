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

type FallbackIspaceNoticeSeed = {
  sourceId: string;
  title: string;
  date: string;
  orgName?: string;
  sourcePath?: string;
  fields: string[];
};

const fallbackIspaceNoticeData: Record<IspaceNoticeType, FallbackIspaceNoticeSeed[]> = {
  TENDER_ANNOUNCEMENT: [
    {
      sourceId: "C1100000189013176074",
      title: "试验执行管控系统招标公告",
      date: "2026-07-09",
      orgName: "西安航天动力试验技术研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189013176074",
      fields: ["招标编号：C1100000189013176074", "招标行业：货物信息电子计算机系统软件", "开标时间：2026-07-30 09:00", "文件购买截止时间：2026-07-17 22:00"],
    },
    {
      sourceId: "C1100000189017300001",
      title: "基于高阶引力及复杂再入模型的XX仿真模块招标公告",
      date: "2026-07-09",
      orgName: "北京航天长征飞行器研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189017300001",
      fields: ["招标编号：C1100000189017300001", "招标行业：货物航空航天航空航天设备", "开标时间：2026-07-30 09:30", "文件购买截止时间：2026-07-16 18:00"],
    },
    {
      sourceId: "C1100000189005265066",
      title: "铜川XX建设项目二道沟土建工程施工招标公告",
      date: "2026-07-09",
      orgName: "西安航天动力试验技术研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189005265066",
      fields: ["招标编号：C1100000189005265066", "招标行业：工程房屋建筑建筑工程", "开标时间：2026-07-31 14:00", "文件购买截止时间：2026-07-17 00:00"],
    },
    {
      sourceId: "C1100000189005265065",
      title: "700-1201长程工艺系统安装工程招标公告",
      date: "2026-07-09",
      orgName: "西安航天动力试验技术研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189005265065",
      fields: ["招标编号：C1100000189005265065", "招标行业：工程房屋建筑建筑工程", "开标时间：2026-07-31 09:30", "文件购买截止时间：2026-07-17 00:00"],
    },
    {
      sourceId: "C1100000189016290007",
      title: "1231台工艺系统安装工程招标公告",
      date: "2026-07-09",
      orgName: "西安航天动力试验技术研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189016290007",
      fields: ["招标编号：C1100000189016290007", "招标行业：工程设备机械机电安装工程", "开标时间：2026-07-31 09:00", "文件购买截止时间：2026-07-17 00:00"],
    },
    {
      sourceId: "C1100000189017296001",
      title: "复合机设备招标公告",
      date: "2026-07-09",
      orgName: "北京卫星制造厂有限公司",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189017296001",
      fields: ["招标编号：C1100000189017296001", "招标行业：货物信息电子电子元器件及专用设备", "开标时间：2026-07-30 09:30", "文件购买截止时间：2026-07-16 23:00"],
    },
    {
      sourceId: "C1100000189017294001",
      title: "超大长径比支撑杆结构直线度检测系统招标公告",
      date: "2026-07-09",
      orgName: "北京卫星制造厂有限公司",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189017294001",
      fields: ["招标编号：C1100000189017294001", "招标行业：货物航空航天航空航天设备", "开标时间：2026-07-31 09:30", "文件购买截止时间：2026-07-16 23:00"],
    },
    {
      sourceId: "C1100000189016808001",
      title: "在轨运行模式与策略优化验证系统招标公告",
      date: "2026-07-09",
      orgName: "上海卫星工程研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189016808001",
      fields: ["招标编号：C1100000189016808001", "招标行业：货物航空航天航空航天设备", "开标时间：2026-07-30 09:30", "文件购买截止时间：2026-07-16 16:00"],
    },
    {
      sourceId: "C1100000189017247001",
      title: "伺服加载系统招标公告",
      date: "2026-07-09",
      orgName: "北京强度环境研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189017247001",
      fields: ["招标编号：C1100000189017247001", "招标行业：货物化学工业化工机械", "开标时间：2026-07-30 14:00", "文件购买截止时间：2026-07-16 17:00"],
    },
    {
      sourceId: "C1100000189017181001",
      title: "大口径网状反射面健康状态智能评估系统招标公告",
      date: "2026-07-09",
      orgName: "上海航天电子通讯设备研究所",
      sourcePath: "/exp/bidding/sell/signup/toZbggInfoHt.do?probid=C1100000189017181001",
      fields: ["招标编号：C1100000189017181001", "招标行业：货物航空航天航空航天设备", "开标时间：2026-07-30 13:30", "文件购买截止时间：2026-07-16 23:00"],
    },
  ],
  CHANGE_ANNOUNCEMENT: [
    {
      sourceId: "C1100000189017183001",
      title: "喷管试验翻转台变更公告",
      date: "2026-07-09",
      orgName: "西安航天动力技术研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7129",
      fields: ["招标编号：C1100000189017183001", "招标行业：货物信息电子电子元器件及专用设备", "变更标段（包）：第1包：喷管试验翻转台"],
    },
    {
      sourceId: "C1100000189017135001",
      title: "2026年通用硬件设备、数据库维保及设备搬迁、布线服务变更公告",
      date: "2026-07-09",
      orgName: "中国资源卫星应用中心",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7128",
      fields: ["招标编号：C1100000189017135001", "招标行业：服务其他网络、电磁空间安全服务", "变更标段（包）：第1包：2026年通用硬件设备、数据库维保及设备搬迁、布线服务"],
    },
    {
      sourceId: "C1100000189017129001",
      title: "HY项目35kV输变电工程EPC总承包变更公告",
      date: "2026-07-08",
      orgName: "西安航天化学动力有限公司",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7126",
      fields: ["招标编号：C1100000189017129001", "招标行业：工程能源电力电力工程", "变更标段（包）：第1包：HY项目35kV输变电工程EPC总承包"],
    },
    {
      sourceId: "C1100000189017123001",
      title: "发动机使用维护保障系统变更公告",
      date: "2026-07-08",
      orgName: "西安航天动力研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7124",
      fields: ["招标编号：C1100000189017123001", "招标行业：货物设备机械其他专用机械", "变更标段（包）：第1包：发动机使用维护保障系统"],
    },
    {
      sourceId: "C1100000189017110001",
      title: "空气气源系统改造（空压机组及附件）变更公告",
      date: "2026-07-08",
      orgName: "西安航天动力研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7123",
      fields: ["招标编号：C1100000189017110001", "招标行业：货物设备机械其他专用机械", "变更标段（包）：第1包：空气气源系统改造（空压机组及附件）"],
    },
    {
      sourceId: "C1100000189017111001",
      title: "空气气源系统改造（空气气瓶）变更公告",
      date: "2026-07-08",
      orgName: "西安航天动力研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7122",
      fields: ["招标编号：C1100000189017111001", "招标行业：货物化学工业化工机械", "变更标段（包）：第1包：空气气源系统改造（空气气瓶）"],
    },
    {
      sourceId: "C1100000189017212001",
      title: "表面废水处理站提标改造变更公告",
      date: "2026-07-07",
      orgName: "山西航天清华装备有限责任公司",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7120",
      fields: ["招标编号：C1100000189017212001", "招标行业：货物生态环保环保设备", "变更标段（包）：第1包：表面废水处理站提标改造"],
    },
    {
      sourceId: "C1100000189017102001",
      title: "重复使用发动机力学环境模拟与验证系统变更公告",
      date: "2026-07-03",
      orgName: "西安航天动力研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7114",
      fields: ["招标编号：C1100000189017102001", "招标行业：货物其他其他货物", "变更标段（包）：第1包：重复使用发动机力学环境模拟与验证系统"],
    },
    {
      sourceId: "C1100000189017109001",
      title: "模型全生命周期管理平台运行支撑服务器采购变更公告",
      date: "2026-07-03",
      orgName: "上海宇航系统工程研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7108",
      fields: ["招标编号：C1100000189017109001", "招标行业：货物其他计算机及网络设备", "变更标段（包）：第1包：模型全生命周期管理平台运行支撑服务器采购"],
    },
    {
      sourceId: "C1100000189013176072",
      title: "阀门变更公告",
      date: "2026-07-01",
      orgName: "西安航天动力试验技术研究所",
      sourcePath: "/ggInfoHt.do?typ=1&back=0&pkid=7104",
      fields: ["招标编号：C1100000189013176072", "招标行业：货物设备机械其他专用机械", "变更标段（包）：第1包：42MPa及以上阀门、第2包：35MPa及以下阀门"],
    },
  ],
  WIN_RESULT_ANNOUNCEMENT: [
    {
      sourceId: "C1100000189017009001",
      title: "401厂房电力增容改造项目中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189017009001001",
      fields: ["招标编号：C1100000189017009001", "招标行业：货物能源电力输变电设备、设施", "中标方：上海彬长电气科技集团有限公司", "中标金额：4788200.34元"],
    },
    {
      sourceId: "C1100000189016997001",
      title: "设计工艺管理系统中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189016997001001",
      fields: ["招标编号：C1100000189016997001", "招标行业：货物信息电子计算机系统软件", "中标方：航天四创科技有限责任公司", "中标金额：3380000.00元"],
    },
    {
      sourceId: "C1100000189017089001",
      title: "粘合剂连续后处理系统中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189017089001001",
      fields: ["招标编号：C1100000189017089001", "招标行业：货物信息电子电子元器件及专用设备", "中标方：中建安装集团有限公司", "中标金额：9894362.00元"],
    },
    {
      sourceId: "C1100000189017081001",
      title: "甲苯采购中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189017081001001",
      fields: ["招标编号：C1100000189017081001", "招标行业：货物其他石油专用化工产品", "中标方：襄阳伟创化玻有限公司", "中标金额：5730400.00元"],
    },
    {
      sourceId: "C1100000189016160004-002",
      title: "2026年工艺及测控系统维护（二标段）中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189016160004002",
      fields: ["招标编号：C1100000189016160004", "招标行业：工程房屋建筑建筑工程", "中标方：四川荣志盛和建设工程有限公司", "中标金额：291899.50元"],
    },
    {
      sourceId: "C1100000189016160004-001",
      title: "2026年工艺及测控系统维护（一标段）中标结果公告",
      date: "2026-07-09",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189016160004001",
      fields: ["招标编号：C1100000189016160004", "招标行业：工程房屋建筑建筑工程", "中标方：陕西航天机电环境工程设计院有限责任公司", "中标金额：241217.00元"],
    },
    {
      sourceId: "C1100000189016686001",
      title: "上海无线电设备研究所班车租赁服务中标结果公告",
      date: "2026-07-08",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189016686001001",
      fields: ["招标编号：C1100000189016686001", "招标行业：服务商业服务汽车租赁", "中标方：上海露虹汽车服务有限公司", "中标金额：1548800.00元"],
    },
    {
      sourceId: "C1100000189017048001",
      title: "数控车削中心中标结果公告",
      date: "2026-07-08",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189017048001001",
      fields: ["招标编号：C1100000189017048001", "招标行业：货物设备机械金属加工机械", "中标方：南京德福克智能科技有限公司", "中标金额：2149000.00元"],
    },
    {
      sourceId: "C1100000189017026001",
      title: "航天城科研区部分破损及积水路面第一期维修中标结果公告",
      date: "2026-07-08",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189017026001001",
      fields: ["招标编号：C1100000189017026001", "招标行业：工程市政市政工程", "中标方：创甲建设有限公司", "中标金额：2934032.40元"],
    },
    {
      sourceId: "C1100000189016848001",
      title: "航天城男生宿舍及女生宿舍维修改造中标结果公告",
      date: "2026-07-08",
      sourcePath: "/ggInfoHt.do?typ=3&packid=C1100000189016848001001",
      fields: ["招标编号：C1100000189016848001", "招标行业：工程房屋建筑建筑工程", "中标方：北京合元盛建设工程有限公司", "中标金额：1265006.16元"],
    },
  ],
};

function createFallbackIspaceNotice(type: IspaceNoticeType, seed: FallbackIspaceNoticeSeed): IspaceNoticeItem {
  const fields = seed.fields.filter(Boolean);

  return {
    id: `${type}:${seed.sourceId}`,
    sourceId: seed.sourceId,
    title: seed.title,
    date: seed.date,
    type,
    typeLabel: labelForType(type),
    orgName: seed.orgName,
    projectCode: fieldValue(fields, "招标编号"),
    industry: fieldValue(fields, "招标行业"),
    openTime: fieldValue(fields, "开标时间"),
    deadline: fieldValue(fields, "文件购买截止时间"),
    winner: fieldValue(fields, "中标方"),
    amount: fieldValue(fields, "中标金额"),
    sourceUrl: absoluteSourceUrl(seed.sourcePath),
    fields,
  };
}

const fallbackIspaceNoticeGroups = ispaceNoticeTabs.reduce((map, tab) => {
  map[tab.type] = fallbackIspaceNoticeData[tab.type].map((seed) => createFallbackIspaceNotice(tab.type, seed));
  return map;
}, {} as IspaceNoticeGroupMap);

function fallbackIspaceNoticesByType(type: IspaceNoticeType, pageSize: number) {
  return (fallbackIspaceNoticeGroups[type] ?? []).slice(0, pageSize);
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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${ispaceBaseUrl}/retrieve.do?typflag=${typflagForType(type)}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Mozilla/5.0 zhaobiao-ispace-fetcher",
        Referer: `${ispaceBaseUrl}/retrieve.do`,
      },
    });

    if (!response.ok) return "";
    return response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchIspaceNoticesByType(type: IspaceNoticeType, pageSize = 10) {
  const html = await fetchIspaceHtml(type);
  const marker = '<div class="menu_content_layer6_list hand searchContentSc"';
  const blocks = html
    .split(marker)
    .slice(1)
    .map((section) => `${marker}${section.split("<!-- 分页器 -->")[0]}`);

  const items = blocks
    .map((block) => parseNoticeBlock(block, type))
    .filter((item): item is IspaceNoticeItem => Boolean(item))
    .slice(0, pageSize);

  return items.length ? items : fallbackIspaceNoticesByType(type, pageSize);
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
