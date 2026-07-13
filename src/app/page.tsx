"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import ProcurementPlatforms from "@/components/ProcurementPlatforms";
import ServiceConsulting from "@/components/ServiceConsulting";
import { getStorageItem, parseStorageJson, setStorageItem } from "@/lib/browserStorage";
import {
  articlesById,
  defaultCggglist as readableCggglist,
  defaultDdlist as readableDdlist,
  defaultJjlist as readableJjlist,
  defaultXjlist as readableXjlist,
} from "@/lib/articles";
import {
  cnbmNoticeTabs,
  emptyCnbmNoticeGroups,
  type CnbmNoticeGroupMap,
} from "@/lib/cnbmNotices";
import {
  ceecNoticeTabs,
  emptyCeecNoticeGroups,
  type CeecNoticeGroupMap,
} from "@/lib/ceecNotices";
import {
  ispaceNoticeTabs,
  emptyIspaceNoticeGroups,
  type IspaceNoticeGroupMap,
} from "@/lib/ispaceNotices";
import {
  ygcgNoticeTabs,
  emptyYgcgNoticeGroups,
  type YgcgNoticeGroupMap,
} from "@/lib/ygcgNotices";
import { fallbackTradeAnnouncements, type TradeAnnouncement } from "@/lib/tradeAnnouncements";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  newBadge?: boolean;
}

type NewsTabId = "cggglist" | "xjlist" | "jjlist" | "ddlist";

type EntryPromptTarget = {
  title: string;
  detailUrl: string;
};

const getTodayDisplayDate = () => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const month = parts.find((part) => part.type === "month")?.value ?? "01";
  const day = parts.find((part) => part.type === "day")?.value ?? "01";
  return `${month}-${day}`;
};

type MemberRecord = Record<string, {
  companyName?: string;
  contactName?: string;
  phone?: string;
  code?: string;
  email?: string;
  province?: string;
  step?: number;
  updatedAt?: string;
}>;

const provinces = [
  "北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江",
  "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
  "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
  "内蒙古", "广西", "西藏", "宁夏", "新疆", "香港", "澳门"
];

interface OpenCard {
  id: string;
  title: string;
  keywords: string;
  tabs: string[];
}

const openCards: OpenCard[] = [
  { id: "infoopenlist1zb", title: "招投标商机", keywords: "", tabs: cnbmNoticeTabs.map((tab) => tab.label) },
  { id: "infoopenlist2zb", title: "政企采购电子卖场", keywords: "局,市,街道,企业,电子卖场", tabs: ygcgNoticeTabs.map((tab) => tab.label) },
  { id: "infoopenlist3zb", title: "央国企采购", keywords: "中央,央企,企业,国企,国家", tabs: ceecNoticeTabs.map((tab) => tab.label) },
  { id: "infoopenlist6zb", title: "军队采购", keywords: "军,部队,地方,国防,后勤,炊事,营房", tabs: ispaceNoticeTabs.map((tab) => tab.label) },
];

type HotServiceIconType =
  | "entry"
  | "lock"
  | "form"
  | "shop"
  | "tools"
  | "shield"
  | "settle"
  | "orbit"
  | "download"
  | "edit"
  | "book"
  | "upload";

const hotServiceItems: Array<{ name: string; icon: HotServiceIconType }> = [
  { name: "供应商入驻", icon: "entry" },
  { name: "CA锁办理", icon: "lock" },
  { name: "电子增值办理", icon: "form" },
  { name: "搭建政采店铺", icon: "shop" },
  { name: "店铺商品上架", icon: "tools" },
  { name: "政采竞价服务", icon: "shield" },
  { name: "政采业务结算", icon: "settle" },
  { name: "投标报名服务", icon: "orbit" },
  { name: "招标文件下载", icon: "download" },
  { name: "投标指导服务", icon: "edit" },
  { name: "标书制作服务", icon: "book" },
  { name: "上传标书服务", icon: "upload" },
];

type ZctSubCategoryGroup = {
  title: string;
  items: string[];
};

type ZctCategoryItem = {
  name: string;
  icon: HotServiceIconType;
  groups: ZctSubCategoryGroup[];
};

const zctCategoryItems: ZctCategoryItem[] = [
  {
    name: "电脑/服务器/网络设备",
    icon: "form",
    groups: [
      { title: "计算机设备", items: ["台式计算机", "便携式计算机", "一体机", "工作站", "平板电脑", "显示器"] },
      { title: "服务器/存储", items: ["服务器", "机架式服务器", "塔式服务器", "存储设备", "磁盘阵列", "网络存储", "备份一体机"] },
      { title: "网络设备", items: ["路由器", "交换机", "防火墙", "VPN设备", "网关", "无线AP", "网络机柜", "综合布线"] },
      { title: "安全设备", items: ["入侵检测", "安全审计", "终端安全", "身份认证", "数据备份", "漏洞扫描"] },
    ],
  },
  {
    name: "办公桌椅/办公箱柜",
    icon: "book",
    groups: [
      { title: "办公桌椅", items: ["办公桌", "会议桌", "办公椅", "会议椅", "沙发", "茶几", "培训桌椅"] },
      { title: "柜架收纳", items: ["文件柜", "保险柜", "密集架", "书柜", "更衣柜", "货架", "档案柜"] },
      { title: "会议家具", items: ["演讲台", "接待台", "屏风工位", "洽谈桌", "主席台", "礼堂椅"] },
    ],
  },
  {
    name: "生活电器/大型家电",
    icon: "shop",
    groups: [
      { title: "大型家电", items: ["空调", "冰箱", "洗衣机", "电视机", "热水器", "净水器", "冷柜"] },
      { title: "生活电器", items: ["饮水机", "电风扇", "吸尘器", "空气净化器", "微波炉", "消毒柜", "取暖器"] },
      { title: "厨房设备", items: ["电磁炉", "蒸饭柜", "烟灶设备", "商用厨具", "开水器", "制冰机"] },
    ],
  },
  {
    name: "办公设备/硒鼓油墨",
    icon: "tools",
    groups: [
      { title: "办公用纸", items: ["其他功能用纸", "标签打印纸/条码纸", "彩色复印纸", "传真纸", "复写纸", "喷墨/相片纸/卡纸"] },
      { title: "办公设备/耗材", items: ["碎纸机", "碎纸机配件", "扫描仪", "复印机", "保险箱/柜", "保管箱", "切纸机", "多功能一体机配件", "彩色激光多功能一体机", "其它多功能一体机", "触控一体机", "黑白激光多功能一体机", "墨仓式多功能一体机", "喷墨多功能一体机", "打字机/配件", "绘图仪", "其它销毁设备", "销毁设备", "光标阅卷机", "刻字机", "冷裱机", "一体化速印机", "幻灯机", "办税终端机", "其它", "高拍仪", "手机屏蔽柜"] },
      { title: "打印/复印及配件", items: ["打印机", "打印机配件", "喷墨打印机", "针式打印机", "复印机", "复印机配件", "硒鼓", "墨盒", "粉盒", "色带"] },
      { title: "传真/通信", items: ["传真机", "电话机", "对讲机", "录音电话", "视频会议终端", "通信配件"] },
    ],
  },
  {
    name: "清洁日化/居家日用",
    icon: "entry",
    groups: [
      { title: "清洁用品", items: ["洗手液", "消毒液", "垃圾袋", "拖把", "扫把", "清洁剂", "纸巾", "擦手纸"] },
      { title: "日用百货", items: ["雨具", "劳保用品", "收纳用品", "床上用品", "饮用水", "一次性用品", "保温用品"] },
      { title: "防疫物资", items: ["口罩", "手套", "体温计", "防护服", "酒精", "应急包", "消杀设备"] },
    ],
  },
  {
    name: "商务中介/广告服务",
    icon: "edit",
    groups: [
      { title: "商务服务", items: ["审计服务", "资产评估", "法律服务", "会计服务", "招标代理", "会议服务", "咨询服务"] },
      { title: "广告服务", items: ["广告制作", "标识标牌", "宣传册", "喷绘写真", "展板展架", "视频制作", "活动策划"] },
      { title: "印刷服务", items: ["文件印刷", "票据印刷", "资料装订", "证书制作", "档案整理", "包装印刷"] },
    ],
  },
  {
    name: "信息技术/数据处理",
    icon: "settle",
    groups: [
      { title: "软件服务", items: ["软件开发", "系统集成", "运维服务", "云服务", "信息安全", "等保测评", "软件测试"] },
      { title: "数据服务", items: ["数据处理", "数据采集", "数据标注", "档案数字化", "信息化咨询", "数据治理"] },
      { title: "硬件维护", items: ["电脑维修", "网络维护", "机房维护", "设备租赁", "驻场服务", "巡检服务"] },
    ],
  },
  {
    name: "维修保养/装配服务",
    icon: "lock",
    groups: [
      { title: "设备维修", items: ["办公设备维修", "家电维修", "空调维修", "电梯维保", "消防维保", "安防维保"] },
      { title: "装配安装", items: ["家具安装", "设备安装", "监控安装", "网络布线", "门禁安装", "弱电施工"] },
      { title: "车辆服务", items: ["车辆维修", "车辆保养", "车辆检测", "轮胎更换", "洗车服务", "救援服务"] },
    ],
  },
  {
    name: "工程咨询/工程造价",
    icon: "download",
    groups: [
      { title: "工程咨询", items: ["项目建议书", "可研报告", "工程设计", "勘察服务", "监理服务", "项目管理"] },
      { title: "工程造价", items: ["预算编制", "清单编制", "结算审核", "跟踪审计", "招标控制价", "工程审计"] },
      { title: "工程施工", items: ["装修改造", "零星维修", "园林绿化", "安防工程", "市政工程", "水电安装"] },
    ],
  },
  {
    name: "租赁租借/场地租赁",
    icon: "orbit",
    groups: [
      { title: "设备租赁", items: ["电脑租赁", "打印机租赁", "车辆租赁", "机械租赁", "音视频设备", "办公设备租赁"] },
      { title: "场地租赁", items: ["会议室租赁", "培训场地", "展览场地", "仓储场地", "停车场", "活动场地"] },
      { title: "服务租借", items: ["工位租赁", "临时办公", "物业配套", "活动执行", "会务服务", "展会服务"] },
    ],
  },
];

const zctGuideItems: Array<{ name: string; icon: HotServiceIconType }> = [
  { name: "供应商指南", icon: "orbit" },
  { name: "采购单位指南", icon: "edit" },
  { name: "法律声明", icon: "shop" },
  { name: "履约交付标准", icon: "book" },
  { name: "付费指导", icon: "tools" },
  { name: "资料审核条款", icon: "form" },
  { name: "付费协议", icon: "lock" },
  { name: "资质管理办法", icon: "entry" },
  { name: "隐私政策", icon: "shield" },
  { name: "发票申请说明", icon: "settle" },
];

function HotServiceIcon({ type }: { type: HotServiceIconType }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (type) {
    case "entry":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="8" y="8" width="32" height="32" rx="2" {...common} />
          <path d="M16 16h8v8h-8zM28 16h4M28 22h4M16 28h4M16 34h4M28 28h4M28 34h4" {...common} />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="8" y="16" width="32" height="22" rx="2" {...common} />
          <path d="M17 16v-2a7 7 0 0 1 14 0v2M18 27h12M22 23l-4 4 4 4M30 23l4 4-4 4" {...common} />
        </svg>
      );
    case "form":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="12" y="9" width="24" height="30" rx="2" {...common} />
          <path d="M18 15h12M18 21h12M18 27h7M32 31l5-5 3 3-5 5-5 1z" {...common} />
        </svg>
      );
    case "shop":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M9 38h30M12 38V21h24v17M10 21l4-11h20l4 11M17 38V27h14v11" {...common} />
          <path d="M14 21v5M24 21v5M34 21v5" {...common} />
        </svg>
      );
    case "tools":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M11 37l12-12M8 18l7-7 6 6-7 7zM27 13l8 8M31 9l8 8M25 29l10 10M35 29l-10 10" {...common} />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 8l16 6v9c0 10-6.5 16-16 19C14.5 39 8 33 8 23v-9z" {...common} />
          <path d="M18 25l4 4 8-10" {...common} />
        </svg>
      );
    case "settle":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M13 39V27M24 39V18M35 39V24M10 39h28" {...common} />
          <circle cx="24" cy="14" r="5" {...common} />
          <path d="M24 11v6M21 14h6" {...common} />
        </svg>
      );
    case "orbit":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <ellipse cx="24" cy="24" rx="17" ry="8" transform="rotate(35 24 24)" {...common} />
          <ellipse cx="24" cy="24" rx="17" ry="8" transform="rotate(-35 24 24)" {...common} />
          <circle cx="24" cy="24" r="3" {...common} />
        </svg>
      );
    case "download":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 8v21M16 21l8 8 8-8M11 39h26M14 39v-8h20v8" {...common} />
        </svg>
      );
    case "edit":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <rect x="10" y="11" width="28" height="28" rx="2" {...common} />
          <path d="M17 31l3-8 12-12 5 5-12 12zM28 15l5 5" {...common} />
        </svg>
      );
    case "book":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M14 8h16l4 5v27H14zM30 8v7h6M19 21h10M19 27h10M19 33h7" {...common} />
        </svg>
      );
    case "upload":
      return (
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path d="M24 40V19M16 27l8-8 8 8M12 14a10 10 0 0 1 18-4 8 8 0 0 1 2 16h-2" {...common} />
          <path d="M14 36h20" {...common} />
        </svg>
      );
  }
}

const floatNoticeText = "促进企业发展，深化政采制度改革，优化政采流程，突出政采公正、公平、公开、透明，现全国已展开优质供应商入驻政采平台，开通线上政采电子卖场，开办网上超市等相关登记报名工作。";
const floatHotlineLabel = "全国政采入驻咨询热线";
const floatButtonLabel = "立即登记报名";
const floatingMenuItems: Array<{ label: string; icon: HotServiceIconType }> = [
  { label: "投标人", icon: "orbit" },
  { label: "招标人", icon: "edit" },
  { label: "招标代理", icon: "settle" },
  { label: "专家评委", icon: "book" },
  { label: "监管部门", icon: "entry" },
  { label: "工作人员", icon: "shield" },
  { label: "工程大厅", icon: "download" },
  { label: "采购大厅", icon: "shop" },
  { label: "产权自主交易", icon: "form" },
];

export default function Home() {
  const todayDisplayDate = getTodayDisplayDate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activePhone, setActivePhone] = useState("");
  const [detectedProvince, setDetectedProvince] = useState("北京");
  const [phone400, setPhone400] = useState("400-999-8839");
  const [resolvedIp, setResolvedIp] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllQueryLinks, setShowAllQueryLinks] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);
  const [activeMarketplaceCategory, setActiveMarketplaceCategory] = useState<number | null>(null);
  const [tradeAnnouncements, setTradeAnnouncements] = useState<TradeAnnouncement[]>(fallbackTradeAnnouncements);
  const [pendingEntryPrompt, setPendingEntryPrompt] = useState<EntryPromptTarget | null>(null);
  const [cnbmNoticeGroups, setCnbmNoticeGroups] = useState<CnbmNoticeGroupMap>(emptyCnbmNoticeGroups);
  const [cnbmNoticesLoaded, setCnbmNoticesLoaded] = useState(false);
  const [ceecNoticeGroups, setCeecNoticeGroups] = useState<CeecNoticeGroupMap>(emptyCeecNoticeGroups);
  const [ceecNoticesLoaded, setCeecNoticesLoaded] = useState(false);
  const [ispaceNoticeGroups, setIspaceNoticeGroups] = useState<IspaceNoticeGroupMap>(emptyIspaceNoticeGroups);
  const [ispaceNoticesLoaded, setIspaceNoticesLoaded] = useState(false);
  const [ygcgNoticeGroups, setYgcgNoticeGroups] = useState<YgcgNoticeGroupMap>(emptyYgcgNoticeGroups);
  const [ygcgNoticesLoaded, setYgcgNoticesLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/trade-announcements")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { items?: TradeAnnouncement[] } | null) => {
        if (!ignore && data?.items?.length) {
          setTradeAnnouncements(data.items);
        }
      })
      .catch(() => {
        // Keep the built-in announcement list when the source site is unavailable.
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/cnbm-notices?limit=10", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { groups?: CnbmNoticeGroupMap } | null) => {
        if (!ignore && data?.groups) {
          setCnbmNoticeGroups(data.groups);
        }
        if (!ignore) {
          setCnbmNoticesLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCnbmNoticesLoaded(true);
        }
        // Keep the card empty if the source site is temporarily unavailable.
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/ceec-notices?limit=10", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { groups?: CeecNoticeGroupMap } | null) => {
        if (!ignore && data?.groups) {
          setCeecNoticeGroups(data.groups);
        }
        if (!ignore) {
          setCeecNoticesLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setCeecNoticesLoaded(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/ispace-notices?limit=10", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { groups?: IspaceNoticeGroupMap } | null) => {
        if (!ignore && data?.groups) {
          setIspaceNoticeGroups(data.groups);
        }
        if (!ignore) {
          setIspaceNoticesLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIspaceNoticesLoaded(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    fetch("/api/ygcg-notices?limit=10", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { groups?: YgcgNoticeGroupMap } | null) => {
        if (!ignore && data?.groups) {
          setYgcgNoticeGroups(data.groups);
        }
        if (!ignore) {
          setYgcgNoticesLoaded(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setYgcgNoticesLoaded(true);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);
  
  const resolveArticleId = (title: string, defaultId?: string) => {
    if (defaultId && articlesById[defaultId]) return defaultId;
    const matched = Object.values(articlesById).find((article) => article.title === title);
    return matched?.id ?? defaultId ?? title;
  };

  // Header and Search States
  const [showProgressQuery, setShowProgressQuery] = useState(false);
  const [queryPhone, setQueryPhone] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Navigation hover indexes
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);

  const [cggglist, setCggglist] = useState<NewsItem[]>(readableCggglist);
  const [xjlist, setXjlist] = useState<NewsItem[]>(readableXjlist);
  const [jjlist, setJjlist] = useState<NewsItem[]>(readableJjlist);
  const [ddlist, setDdlist] = useState<NewsItem[]>(readableDdlist);

  // Bidding Announcement Cards State (Track selected tab per card ID)
  const [cardActiveTab, setCardActiveTab] = useState<Record<string, number>>({
    infoopenlist1zb: 0,
    infoopenlist2zb: 0,
    infoopenlist3zb: 0,
    infoopenlist6zb: 0,
  });

  // Inline Form States (Middle form)
  const [inlineOrgName, setInlineOrgName] = useState("");
  const [inlineContactName, setInlineContactName] = useState("");
  const [inlineMobile, setInlineMobile] = useState("");
  const [inlineCode, setInlineCode] = useState("");
  const [inlineYinsi, setInlineYinsi] = useState(false);
  const [inlineTimer, setInlineTimer] = useState(0);
  const [inlineMockCode, setInlineMockCode] = useState("");
  const [isSendingInlineSms, setIsSendingInlineSms] = useState(false);

  // Admin and Floating window states
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsTab, setNewNewsTab] = useState<NewsTabId>("cggglist");
  
  const [showFloatWindow, setShowFloatWindow] = useState(true);

  // Geolocation and News mount setup
  useEffect(() => {
    // 1. Real IP Geolocation via Next.js API endpoint (leverages Vercel Edge headers)
    const geolocate = async () => {
      try {
        const res = await fetch("/api/ip");
        if (res.ok) {
          const data = await res.json();
          if (data.ip) {
            setResolvedIp(data.ip);
          }
          if (data.province && provinces.includes(data.province)) {
            setDetectedProvince(data.province);
            return;
          }
        }
      } catch (e) {
        console.error("Client geolocation fetch failed:", e);
      }
      // Fallback
      setDetectedProvince("北京");
    };
    geolocate();

    // 2. Load custom 400 hotline and news from localStorage
    window.setTimeout(() => {
      const savedPhone = getStorageItem("zcy_400_phone");
      if (savedPhone) {
        setPhone400(savedPhone);
      }

    }, 0);
  }, []);

  // SMS Timer
  useEffect(() => {
    if (inlineTimer > 0) {
      const timer = setTimeout(() => setInlineTimer(inlineTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [inlineTimer]);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value;
    setDetectedProvince(prov);
  };

  // Inline Form SMS code sender
  const handleSendInlineSms = () => {
    if (!/^1[3-9]\d{9}$/.test(inlineMobile)) {
      alert("请输入正确的11位手机号");
      return;
    }
    setIsSendingInlineSms(true);
    setInlineTimer(60);
    setTimeout(() => {
      setIsSendingInlineSms(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setInlineMockCode(code);
      alert(`【全国政采云】您的验证码是：${code}，请在页面中输入完成验证。`);
    }, 800);
  };

  // Inline Form Submit
  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineOrgName.trim()) return alert("请输入您的公司名称");
    if (!inlineContactName.trim()) return alert("请输入您的姓名");
    if (!/^1[3-9]\d{9}$/.test(inlineMobile)) return alert("请输入正确的11位手机号");
    if (inlineCode !== inlineMockCode && inlineCode !== "1234") return alert("验证码不正确");
    if (!inlineYinsi) return alert("请先同意个人信息与隐私保护条款");

    // Write progress directly to Step 2
    const savedMembers = getStorageItem("zcy_members");
    const members = parseStorageJson<MemberRecord>(savedMembers, {});
    members[inlineMobile] = {
      companyName: inlineOrgName,
      contactName: inlineContactName,
      phone: inlineMobile,
      code: inlineCode,
      email: "",
      province: detectedProvince,
      step: 2,
      updatedAt: new Date().toISOString(),
    };
    setStorageItem("zcy_members", JSON.stringify(members));
    setStorageItem("zcy_active_user", inlineMobile);

    alert("资料登记成功，已为您开启第二步：资质资料提交。");
    
    // Reset inline form fields
    setInlineOrgName("");
    setInlineContactName("");
    setInlineMobile("");
    setInlineCode("");
    setInlineYinsi(false);

    // Open Form Modal directly at Step 2
    setActivePhone(inlineMobile);
    setIsFormOpen(true);
  };

  // Retrieve progression handler
  const handleProgressQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^1[3-9]\d{9}$/.test(queryPhone)) {
      alert("请输入正确的11位注册手机号");
      return;
    }
    
    const savedMembers = getStorageItem("zcy_members");
    if (savedMembers) {
      const members = parseStorageJson<MemberRecord>(savedMembers, {});
      if (members[queryPhone]) {
        setActivePhone(queryPhone);
        setShowProgressQuery(false);
        setIsFormOpen(true);
        return;
      }
    }
    
    alert("系统暂未查询到该手机号的申报记录，已为您进入首次申请通道。");
    setActivePhone(queryPhone);
    setShowProgressQuery(false);
    setIsFormOpen(true);
  };

  // Quick triggers for wizard form
  const triggerRegistration = (phoneVal = "") => {
    setActivePhone(phoneVal);
    setIsFormOpen(true);
  };

  const handleAnnouncementEntry = () => {
    setPendingEntryPrompt(null);
    triggerRegistration();
  };

  const handleAnnouncementDetail = () => {
    if (pendingEntryPrompt?.detailUrl) {
      window.location.href = pendingEntryPrompt.detailUrl;
      return;
    }

    setPendingEntryPrompt(null);
  };

  const handleCloseFloat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFloatWindow(false);
    setTimeout(() => {
      setShowFloatWindow(true);
    }, 30000); // reappear after 30s
  };

  // Admin operations
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNewsTitle.trim()) return alert("请输入标题");
    const item: NewsItem = {
      id: Date.now().toString(),
      title: newNewsTitle,
      date: new Date().toISOString().split("T")[0],
      newBadge: true
    };

    if (newNewsTab === "cggglist") {
      const updated = [item, ...cggglist];
      setCggglist(updated);
      setStorageItem("zcy_news_cggg", JSON.stringify(updated));
    } else if (newNewsTab === "xjlist") {
      const updated = [item, ...xjlist];
      setXjlist(updated);
      setStorageItem("zcy_news_xj", JSON.stringify(updated));
    } else if (newNewsTab === "jjlist") {
      const updated = [item, ...jjlist];
      setJjlist(updated);
      setStorageItem("zcy_news_jj", JSON.stringify(updated));
    } else if (newNewsTab === "ddlist") {
      const updated = [item, ...ddlist];
      setDdlist(updated);
      setStorageItem("zcy_news_dd", JSON.stringify(updated));
    }

    setNewNewsTitle("");
    alert("新闻通知已发布，列表已成功更新。");
  };

  const handleDeleteNews = (tab: "cggglist" | "xjlist" | "jjlist" | "ddlist", id: string) => {
    if (confirm("确定要删除这篇新闻吗？")) {
      if (tab === "cggglist") {
        const u = cggglist.filter(n => n.id !== id);
        setCggglist(u);
        setStorageItem("zcy_news_cggg", JSON.stringify(u));
      } else if (tab === "xjlist") {
        const u = xjlist.filter(n => n.id !== id);
        setXjlist(u);
        setStorageItem("zcy_news_xj", JSON.stringify(u));
      } else if (tab === "jjlist") {
        const u = jjlist.filter(n => n.id !== id);
        setJjlist(u);
        setStorageItem("zcy_news_jj", JSON.stringify(u));
      } else if (tab === "ddlist") {
        const u = ddlist.filter(n => n.id !== id);
        setDdlist(u);
        setStorageItem("zcy_news_dd", JSON.stringify(u));
      }
    }
  };

  // Hot Search click handler
  const handleHotSearch = (kw: string) => {
    setSearchKeyword(kw);
    triggerRegistration();
  };

  return (
    <div className="home-page-shell min-h-screen bg-slate-50 flex flex-col font-sans select-none text-slate-800">
      
      {/* Top status bar */}
      <div className="w-full bg-[#f8fafc] border-b border-gray-200 py-2 text-xs">
        <div className="w1200 flex_center_space_between px-4">
          <div className="flex_align_center gap-4 text-gray-500 w-full md:w-auto justify-between">
            <div className="flex_align_center gap-1">
              <span className="text-gray-400">定位：</span>
              <select 
                value={detectedProvince} 
                onChange={handleProvinceChange}
                className="font-bold text-[#3991F6] bg-transparent focus:outline-none cursor-pointer border-none"
              >
                {provinces.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
              {resolvedIp && (
                <span className="text-gray-400 text-[10px] font-mono ml-0.5">
                  ({resolvedIp})
                </span>
              )}
            </div>
            {/* Login button shown on mobile right side */}
            <div className="md:hidden">
              <button onClick={() => setShowProgressQuery(true)} className="text-[#3991F6] font-bold flex_align_center gap-0.5 transition-colors">
                登录/查询
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center md:justify-end md:flex-nowrap gap-5 text-gray-500 whitespace-nowrap flex-1 min-w-0">
            <div className="text-gray-400 shrink-0">
              您好，欢迎来到政采信息服务平台
            </div>
            <span className="font-bold text-[#3991F6] shrink-0">服务热线：{phone400}</span>
            <span className="text-gray-300">|</span>
            <button onClick={() => triggerRegistration()} className="shrink-0 hover:text-[#3991F6] transition-colors">采购公告</button>
            <button onClick={() => triggerRegistration()} className="shrink-0 hover:text-[#3991F6] transition-colors">直采大厅</button>
            <button onClick={() => triggerRegistration()} className="shrink-0 hover:text-[#3991F6] transition-colors">入驻大厅</button>
            
            <Link href="/paid-guide" className="shrink-0 hover:text-[#3991F6] transition-colors">
              付费指导
            </Link>
            
            <span className="text-gray-300">|</span>
            <button onClick={() => setShowProgressQuery(true)} className="shrink-0 hover:text-[#3991F6] font-bold flex_align_center gap-1 transition-colors">
              登录 / 进度查询
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Search Area */}
      <div className="w-full bg-white py-4 md:py-6 border-b border-gray-100">
        <div className="w1200 flex flex-col md:flex-row md:items-center justify-between px-4 gap-4">
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <img 
                src="/logo.png" 
                alt="全国政采云服务云平台Logo" 
                className="w-9 h-9 md:w-12 md:h-12 object-contain shrink-0"
              />
              <div>
                <div className="text-lg md:text-3xl font-bold text-slate-800 tracking-wide leading-tight">
                  全国政采云服务云平台
                </div>
                <div className="hidden md:block text-[10px] text-gray-400 font-mono tracking-widest mt-0.5">
                  QUAN GUO ZHENG CAI YUN FU WU YUN PING TAI
                </div>
              </div>
            </div>
            
            {/* Collapsible mobile navigation menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-[#3991F6] focus:outline-none transition-colors border border-gray-200 rounded"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>

          <div className="w-full md:w-auto flex flex-col gap-2">
            <div className="semzxy_header_search_blue w-full">
              <span className="ml10 mr5 text-gray-400">搜索</span>
              <input 
                type="text" 
                placeholder="请输入搜索关键字" 
                className="semzxy_header_search_input"
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && triggerRegistration()}
              />
              <div 
                className="flex_center_center semzxy_header_search_btn_blue"
                onClick={() => triggerRegistration()}
              >
                搜索
              </div>
            </div>
            
            {/* Hot search list - horizontally scrollable on mobile */}
            <ul className="hot-search-list flex items-center gap-2 text-[10px] md:text-xs mt-1 text-gray-400 overflow-x-auto whitespace-nowrap py-1 scrollbar-none flex-nowrap md:flex-wrap">
              <li className="flex items-center text-rose-500 font-semibold gap-0.5 shrink-0">
                <span>热门搜索:</span>
              </li>
              {["CA锁", "供应商注册", "电子交易", "项目采购", "框架协议", "网上超市"].map(kw => (
                <li 
                  key={kw} 
                  onClick={() => handleHotSearch(kw)}
                  className="cursor-pointer hover:text-[#3991F6] bg-gray-100 px-2 py-0.5 rounded transition-all shrink-0"
                >
                  {kw}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Collapsed mobile drawer nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 py-3 px-4 shadow-md transition-all duration-300">
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
            {[
              { name: "首页" },
              { name: "供应商入驻" },
              { name: "CA锁办理" },
              { name: "入驻和CA锁" },
              { name: "供应商账户重置" },
              { name: "投标报名" },
              { name: "搭建政采店铺" },
              { name: "店铺产品上架" },
              { name: "政采竞价" },
              { name: "政采订单结算" },
              { name: "上传标书" }
            ].map((menu, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMobileMenuOpen(false);
                  triggerRegistration();
                }}
                className="text-left py-2 px-3 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#3991F6] rounded border border-gray-100 transition-colors"
              >
                {menu.name}
              </button>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowProgressQuery(true);
              }}
              className="col-span-2 text-center py-2.5 px-3 bg-[#3991F6] hover:bg-blue-600 text-white rounded font-bold transition-colors shadow-sm"
            >
              登录 / 进度查询
            </button>
          </div>
        </div>
      )}

      {/* Blue Theme Horizontal Navigation Bar */}
      <div className="www-content semzxy4_dh bg-3991F6 z-40">
        <div className="w1200 flex_center_space_between relative" style={{ height: "100%" }}>
          
          <div 
            onClick={() => triggerRegistration()}
            className="semzxy4_dh_item semzxy4_dh_item_border_top semzxy4_dh_item_border_bottom flex_center_center"
          >
            首页
          </div>

          {[
            {
              name: "供应商入驻",
              items: ["供应商入驻", "招标代理入驻", "评标专家入驻"]
            },
            {
              name: "CA锁办理",
              items: ["CA锁办理", "CA锁续费"]
            },
            { name: "供应商入驻和CA锁" },
            { name: "供应商账户重置" },
            { name: "投标报名" },
            { name: "搭建政采店铺" },
            { name: "店铺产品上架" },
            { name: "政采竞价" },
            { name: "政采订单结算" },
            { name: "上传标书" },
            {
              name: "更多",
              items: ["招标文件下载", "电子增信办理", "投标托管"]
            }
          ].map((nav, idx) => (
            <div 
              key={idx}
              className="semzxy4_dh_item relative"
              onMouseEnter={() => nav.items && setHoveredNavIndex(idx)}
              onMouseLeave={() => setHoveredNavIndex(null)}
              onClick={() => triggerRegistration()}
            >
              <div className="flex_align_center gap-1">
                <span>{nav.name}</span>
                {nav.items && (
                  <span className="text-[10px] text-blue-200">▼</span>
                )}
              </div>

              {nav.items && hoveredNavIndex === idx && (
                <div className="semzxy4_dh_item_down">
                  {nav.items.map((sub, sidx) => (
                    <div 
                      key={sidx}
                      className="flex_align_center gap-2 mb-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerRegistration();
                      }}
                    >
                      <div className="semzxy4_dh_item_down_one"></div>
                      <a href="javascript:void(0);" className="hoverablue semzxy4_dh_item_down_one_title">
                        {sub}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      {/* Top marketplace category area */}
      <section className="top-category-section" aria-label="政采服务类目">
        <div className="w1200 px-4 md:px-0">
          <div
            className="top-marketplace-panel"
            onMouseLeave={() => setActiveMarketplaceCategory(null)}
          >
            <aside className="top-marketplace-categories" aria-label="商品服务类目">
              {zctCategoryItems.map((item, index) => (
                <button
                  key={item.name}
                  type="button"
                  className={`top-marketplace-category ${activeMarketplaceCategory === index ? "active" : ""}`}
                  onMouseEnter={() => setActiveMarketplaceCategory(index)}
                  onFocus={() => setActiveMarketplaceCategory(index)}
                  onClick={() => triggerRegistration()}
                >
                  <span className="top-marketplace-icon" aria-hidden="true">
                    <HotServiceIcon type={item.icon} />
                  </span>
                  <span>{item.name}</span>
                </button>
              ))}
            </aside>

            {activeMarketplaceCategory !== null && zctCategoryItems[activeMarketplaceCategory] && (
              <div
                className="top-marketplace-subcategory-panel"
                onMouseEnter={() => setActiveMarketplaceCategory(activeMarketplaceCategory)}
              >
                {zctCategoryItems[activeMarketplaceCategory].groups.map((group) => (
                  <div className="top-marketplace-subcategory-group" key={group.title}>
                    <h3>{group.title}</h3>
                    <div>
                      {group.items.map((name) => (
                        <button
                          key={`${group.title}-${name}`}
                          type="button"
                          onClick={() => triggerRegistration()}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <main className="top-marketplace-main">
              <button
                type="button"
                className="top-marketplace-banner"
                onClick={() => triggerRegistration()}
              >
                <div className="top-marketplace-banner-copy">
                  <span>全国政采云服务云平台</span>
                  <small>zcyfwgov.com</small>
                  <strong>政采供应商火热入驻中</strong>
                  <div>
                    <b>服务采购单位：</b>
                    <p>国央企、行政事业单位</p>
                    <p>定点服务、分散服务市场、货物、设备、材料、小额工程直采</p>
                  </div>
                </div>
                <div className="top-marketplace-visual" aria-hidden="true">
                  <div className="top-marketplace-shield">✓</div>
                </div>
                <em>全国政采咨询专线：{phone400}</em>
              </button>

              <section className="top-marketplace-notice" aria-label="平台公告">
                <div className="top-marketplace-notice-head">
                  <h3>平台公告</h3>
                  <button type="button" onClick={() => triggerRegistration()}>
                    &gt;&gt;更多
                  </button>
                </div>
                <div className="top-marketplace-notice-scroll">
                  <div className="top-marketplace-notice-track">
                    {[...tradeAnnouncements, ...tradeAnnouncements].map((item, index) => (
                      <button
                        key={`${item.url}-${index}`}
                        type="button"
                        className={`top-marketplace-notice-item${item.isNew ? " is-new" : ""}`}
                        onClick={() => setPendingEntryPrompt({
                          title: item.title,
                          detailUrl: `/announcement/${encodeURIComponent(item.id)}`,
                        })}
                        title={item.title}
                      >
                        <span className="top-marketplace-notice-dot" aria-hidden="true" />
                        <span className="top-marketplace-notice-title">{item.title}</span>
                        {item.isNew && <span className="top-marketplace-notice-new">new</span>}
                        <time dateTime={item.date}>{item.date}</time>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </main>

            <aside className="top-marketplace-side">
              <div className="top-marketplace-login">
                <div className="top-marketplace-login-icon" aria-hidden="true">
                  <HotServiceIcon type="shield" />
                </div>
                <h3>欢迎供应商申请入驻</h3>
                <div>
                  <button type="button" onClick={() => triggerRegistration()}>用户登录</button>
                  <button type="button" onClick={() => triggerRegistration()}>用户注册</button>
                </div>
              </div>

              <div className="top-marketplace-guide">
                <h3>业务指南</h3>
                <div>
                  {zctGuideItems.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => triggerRegistration()}
                    >
                      <span aria-hidden="true">
                        <HotServiceIcon type={item.icon} />
                      </span>
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Hero Big Ad Banner */}
      <div className="w1200 mt10">
        <div className="bigad0317">
          <div className="w-full h-full text-white flex_center_center px-8">
            <div className="flex_center_space_between w-full">
              <div>
                <div className="bigad0317-title leading-tight">
                  全国政企采购信息查询 店铺交易 供应商入驻服务平台
                </div>
                <div className="f18 font-light text-blue-100">
                  提高采购效率，推进供应商企业供采流程电子化。
                </div>
              </div>
              
              <div className="flex_align_center">
                <div 
                  className="flex_center_center bigad0317-btn" 
                  onClick={() => triggerRegistration()}
                >
                  供应商登记入驻窗口
                </div>
                <div className="text-right text-xs text-blue-200 ml-6">
                  <div className="font-semibold text-white f16 font-mono">{phone400}</div>
                  <div>全国统一咨询服务电话</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hot Services Grid */}
      <div className="w1200 mt20">
        <div className="semzxy4_fw">
          <div className="hot-service-grid">
            {hotServiceItems.map((srv) => (
              <button
                key={srv.name}
                type="button"
                onClick={() => triggerRegistration()}
                className="hot-service-card"
              >
                <span className="hot-service-icon">
                  <HotServiceIcon type={srv.icon} />
                </span>
                <span className="hot-service-name">{srv.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier Newbie Guide 5 Steps */}
      <div className="w1200 mt20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 guide">
          <div className="text-lg md:text-2xl font-bold text-slate-800 mb-6 flex_align_center gap-2">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
            供应商新手入门
          </div>
          
          <div 
            className="newbie-steps-list flex_center_space_between flex-wrap gap-4 py-2 cursor-pointer"
            onClick={() => triggerRegistration()}
          >
            {[
              { num: "01", title: "供应商入驻", desc: "提交基础资料，核验企业信息" },
              { num: "02", title: "申请协议", desc: "确定入库方案，签订服务协议" },
              { num: "03", title: "发布商品", desc: "规范导入商品，完成产品上架" },
              { num: "04", title: "参与交易", desc: "参与报价磋商，争取采购订单" },
              { num: "05", title: "常见问题", desc: "日常账单结算，系统维护支持" }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center group w-[180px]">
                  <div className="flex_center_center mb-2">
                    <div className="w-14 h-14 bg-white hover:bg-blue-50 border border-blue-100 rounded-full flex_center_center text-2xl shadow-sm transition-all duration-300 transform group-hover:scale-110">
                      {idx === 0 && "01"}
                      {idx === 1 && "02"}
                      {idx === 2 && "03"}
                      {idx === 3 && "04"}
                      {idx === 4 && "05"}
                    </div>
                  </div>
                  <div className="f16 fw600 fc-333 hover:text-[#3991F6] transition-colors">
                    {step.num}. {step.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{step.desc}</div>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:block">
                    <span className="text-[#3991F6] text-xl font-bold animate-pulse">→</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bidding Announcement Directory Layout */}
      <div className="mt20 w1200 mb20">
        <div className="flex_center_center mt-8 mb-4">
          <div className="semzxy4_pt_title_line hidden md:block"></div>
          <div className="text-lg md:text-2xl font-bold text-slate-800 ml20 mr20">
            招标采购及直采项目信息公告
          </div>
          <div className="semzxy4_pt_title_line hidden md:block"></div>
        </div>

        <div className="announcement-directory flex_jspace gap-6 w-full items-stretch">
          
          {/* Left query systems list (16 links) - Collapsible on mobile */}
          <div className="info-open-el query-system-panel w-full md:w-[280px] shrink-0 select-none bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
            <div className="query-system-title text-slate-800 font-bold f15 mb-3 border-b border-gray-100 pb-2">
              招采资质与核验查询系统
            </div>
            <div className="query-system-list grid grid-cols-1 gap-2.5">
              {[
                { title: "政府采购网登录系统", icon: "网" },
                { title: "中国物品编码中心", icon: "码" },
                { title: "公共资源交易中心登录", icon: "公" },
                { title: "信用中国查询系统", icon: "信", link: "https://www.creditchina.gov.cn/" },
                { title: "国家信用公示查询系统", icon: "企", link: "https://www.gsxt.gov.cn/index.html" },
                { title: "商标查询系统", icon: "标", link: "https://sbj.cnipa.gov.cn/sbj/index.html" },
                { title: "ISO认证体系查询系统", icon: "证", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "质检报告登录查询系统", icon: "检", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "裁判文书网查询", icon: "法", link: "https://wenshu.court.gov.cn/" },
                { title: "电子卖场查询登录系统", icon: "卖" },
                { title: "国铁商城登录系统", icon: "铁" },
                { title: "国家电网查询登录系统", icon: "电" },
                { title: "慧采平台查询登录系统", icon: "采" },
                { title: "军队采购查询登录系统", icon: "军" }
              ].slice(0, isMobile && !showAllQueryLinks ? 6 : undefined).map((link, idx) => (
                <div key={idx} className="info-open-link-item">
                  <a 
                    className="info-open-link query-system-link flex_align_center px-4 rounded transition-all border border-gray-100 text-sm py-2 text-gray-600" 
                    href={link.link || "javascript:void(0);"} 
                    target={link.link ? "_blank" : undefined}
                    onClick={() => !link.link && triggerRegistration()}
                  >
                    <span className="query-system-icon text-lg mr-2.5 shrink-0">{link.icon}</span>
                    <span className="truncate">{link.title}</span>
                  </a>
                </div>
              ))}
            </div>
            {isMobile && (
              <button 
                onClick={() => setShowAllQueryLinks(!showAllQueryLinks)}
                className="w-full mt-3 py-2 text-center text-xs font-bold text-[#3991F6] bg-blue-50/50 border border-blue-100 hover:bg-blue-100/50 rounded-lg transition-colors flex_center_center gap-1"
              >
                {showAllQueryLinks ? "收起部分系统 ▲" : "展开全部查询系统 ▼"}
              </button>
            )}
          </div>

          {/* Right Cards List (8 Cards) - Collapsible on mobile */}
          <div
            className="info-open-er flex-1 grid gap-6"
            style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))" }}
          >
            {(isMobile && !showAllCards ? openCards.slice(0, 3) : openCards).map((card) => (
              <div 
                key={card.id} 
                className="info-open-ip-card bg-white border border-gray-200 border-t-4 border-t-[#3991F6] p-4 rounded-xl shadow-sm"
              >
                <div className="info-open-card-header flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-2 border-b border-gray-100 gap-2">
                  <div className="info-open-card-title flex_align_center">
                    <span 
                      onClick={() => triggerRegistration()}
                      className="font-bold text-base sm:f18 text-[#1871D7] cursor-pointer hover:underline decoration-2"
                    >
                      {card.title}
                    </span>
                  </div>
                  
                  {/* Card specific tabs */}
                  <div className="info-open-card-splits">
                    <div className="info-open-el-radio-group flex flex-wrap gap-1.5 sm:gap-2">
                      {card.tabs.map((tab, tidx) => {
                        const isChecked = (cardActiveTab[card.id] || 0) === tidx;
                        return (
                          <div 
                            key={tidx}
                            onClick={() => setCardActiveTab(prev => ({ ...prev, [card.id]: tidx }))}
                            className={`info-open-erg-one px-2 py-0.5 rounded text-[10px] sm:text-xs cursor-pointer border ${
                              isChecked 
                                ? "info-open-erg-one-checked border-[#3991F6] text-[#3991F6] bg-blue-50/50 font-bold" 
                                : "border-gray-200 text-gray-400 hover:text-[#3991F6]"
                            }`}
                          >
                            {tab}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="info-open-card-body pt-1">
                  <div className="grid grid-cols-1 gap-2">
                    {(() => {
                      if (card.id === "infoopenlist1zb") {
                        const activeIndex = cardActiveTab[card.id] || 0;
                        const activeNoticeTab = cnbmNoticeTabs[activeIndex] ?? cnbmNoticeTabs[0];
                        const cnbmItems = (cnbmNoticeGroups[activeNoticeTab.type] ?? []).slice(0, 10);

                        if (!cnbmItems.length) {
                          return (
                            <div className="px-2 py-6 text-center text-xs text-slate-400">
                              {cnbmNoticesLoaded ? "暂无平台公告" : "平台公告加载中..."}
                            </div>
                          );
                        }

                        return cnbmItems.map((item, iidx) => (
                          <button
                            key={item.id || iidx}
                            type="button"
                            className="card-body-ip-item flex w-full items-start border-0 bg-transparent py-1.5 px-2 text-left rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group"
                            onClick={() => setPendingEntryPrompt({
                              title: item.title,
                              detailUrl: `/cnbm-notice/${encodeURIComponent(item.id)}`,
                            })}
                          >
                            <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                            <div className="title min-w-0 flex-1 flex items-center gap-2 select-none">
                              <div className="min-w-0 flex-1 truncate text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                                {item.title}
                              </div>
                              <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums">
                                {todayDisplayDate}
                              </span>
                            </div>
                          </button>
                        ));
                      }

                      if (card.id === "infoopenlist2zb") {
                        const activeIndex = cardActiveTab[card.id] || 0;
                        const activeNoticeTab = ygcgNoticeTabs[activeIndex] ?? ygcgNoticeTabs[0];
                        const ygcgItems = (ygcgNoticeGroups[activeNoticeTab.type] ?? []).slice(0, 10);

                        if (!ygcgItems.length) {
                          return (
                            <div className="px-2 py-6 text-center text-xs text-slate-400">
                              {ygcgNoticesLoaded ? "暂无政企采购公告" : "政企采购公告加载中..."}
                            </div>
                          );
                        }

                        return ygcgItems.map((item, iidx) => (
                          <button
                            key={item.id || iidx}
                            type="button"
                            className="card-body-ip-item flex w-full items-start border-0 bg-transparent py-1.5 px-2 text-left rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group"
                            onClick={() => setPendingEntryPrompt({
                              title: item.title,
                              detailUrl: `/ygcg-notice/${encodeURIComponent(item.id)}`,
                            })}
                          >
                            <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                            <div className="title min-w-0 flex-1 flex items-center gap-2 select-none">
                              <div className="min-w-0 flex-1 truncate text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                                {item.title}
                              </div>
                              <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums">
                                {todayDisplayDate}
                              </span>
                            </div>
                          </button>
                        ));
                      }

                      if (card.id === "infoopenlist3zb") {
                        const activeIndex = cardActiveTab[card.id] || 0;
                        const activeNoticeTab = ceecNoticeTabs[activeIndex] ?? ceecNoticeTabs[0];
                        const ceecItems = (ceecNoticeGroups[activeNoticeTab.type] ?? []).slice(0, 10);

                        if (!ceecItems.length) {
                          return (
                            <div className="px-2 py-6 text-center text-xs text-slate-400">
                              {ceecNoticesLoaded ? "暂无央国企采购公告" : "央国企采购公告加载中..."}
                            </div>
                          );
                        }

                        return ceecItems.map((item, iidx) => (
                          <button
                            key={item.id || iidx}
                            type="button"
                            className="card-body-ip-item flex w-full items-start border-0 bg-transparent py-1.5 px-2 text-left rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group"
                            onClick={() => setPendingEntryPrompt({
                              title: item.title,
                              detailUrl: `/ceec-notice/${encodeURIComponent(item.id)}`,
                            })}
                          >
                            <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                            <div className="title min-w-0 flex-1 flex items-center gap-2 select-none">
                              <div className="min-w-0 flex-1 truncate text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                                {item.title}
                              </div>
                              <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums">
                                {todayDisplayDate}
                              </span>
                            </div>
                          </button>
                        ));
                      }

                      if (card.id === "infoopenlist6zb") {
                        const activeIndex = cardActiveTab[card.id] || 0;
                        const activeNoticeTab = ispaceNoticeTabs[activeIndex] ?? ispaceNoticeTabs[0];
                        const ispaceItems = (ispaceNoticeGroups[activeNoticeTab.type] ?? []).slice(0, 10);

                        if (!ispaceItems.length) {
                          return (
                            <div className="px-2 py-6 text-center text-xs text-slate-400">
                              {ispaceNoticesLoaded ? "暂无军队采购公告" : "军队采购公告加载中..."}
                            </div>
                          );
                        }

                        return ispaceItems.map((item, iidx) => (
                          <button
                            key={item.id || iidx}
                            type="button"
                            className="card-body-ip-item flex w-full items-start border-0 bg-transparent py-1.5 px-2 text-left rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group"
                            onClick={() => setPendingEntryPrompt({
                              title: item.title,
                              detailUrl: `/ispace-notice/${encodeURIComponent(item.id)}`,
                            })}
                          >
                            <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                            <div className="title min-w-0 flex-1 flex items-center gap-2 select-none">
                              <div className="min-w-0 flex-1 truncate text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                                {item.title}
                              </div>
                              <span className="shrink-0 text-[10px] sm:text-xs text-gray-400 tabular-nums">
                                {todayDisplayDate}
                              </span>
                            </div>
                          </button>
                        ));
                      }

                      const baseItems: Array<NewsItem & { desc: string }> = [
                        { id: "open-1001", title: "吉安县行政事业单位国企产权转让格式范本及操作指南", desc: "适配公共资源交易目录规范，供应商可快速准备入驻方案。", date: "2026-07-03" },
                        { id: "open-1002", title: "行政事业单位政府采购格式范本说明", desc: "规范政府采购合规要点，降低资料退单率与审核驳回率。", date: "2026-07-03" },
                        { id: "open-1003", title: "关于电子卖场直购、竞价、询价的实施办法指导", desc: "梳理电子交易规则，协助企业搭建专属线上产品页面。", date: "2026-07-03" },
                        { id: "open-1004", title: "关于集中采购类目数字安全协议及 CA 锁申领指引", desc: "汇总安全加密与电子签章要件，是线上商务响应的必要工具。", date: "2026-07-03" }
                      ];

                      const dynamicItems: NewsItem[] = [];

                      const mergedItems: Array<NewsItem & { desc: string }> = [
                        ...dynamicItems.map(di => ({ title: di.title, desc: "", date: di.date, newBadge: di.newBadge, id: di.id })),
                        ...baseItems
                      ].slice(0, 4);

                      return mergedItems.map((item, iidx) => (
                        <Link
                          key={item.id || iidx}
                          className="card-body-ip-item flex items-start py-1.5 px-2 rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group" 
                          href={`/article/${encodeURIComponent(resolveArticleId(item.title, item.id))}`}
                        >
                          <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                          <div className="title flex-1 flex items-start gap-1 select-none">
                            <div className="flex-1 text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                              <strong>[{card.title}]</strong> {item.title} 
                              {item.desc && <span className="text-[10px] text-gray-400 font-normal block mt-0.5">{item.desc}</span>}
                            </div>
                            {item.newBadge !== false && <span className="info-open-tag text-[8px] sm:text-[9px] shrink-0 text-blue-500 select-none bg-blue-50 px-1 py-0.5 rounded ml-2">[NEW]</span>}
                          </div>
                        </Link>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            ))}
            {isMobile && !showAllCards && openCards.length > 3 && (
              <button
                onClick={() => setShowAllCards(true)}
                className="w-full py-3 bg-white border border-gray-200 hover:bg-slate-50 text-[#3991F6] font-bold rounded-xl text-xs transition-colors shadow-sm text-center flex_center_center gap-1"
              >
                加载更多项目公告及政策 ▼
              </button>
            )}
            {isMobile && showAllCards && (
              <button
                onClick={() => setShowAllCards(false)}
                className="w-full py-3 bg-white border border-gray-200 hover:bg-slate-50 text-[#3991F6] font-bold rounded-xl text-xs transition-colors shadow-sm text-center flex_center_center gap-1"
              >
                收起项目公告 ▲
              </button>
            )}
          </div>

        </div>
      </div>

      <ProcurementPlatforms onOpenForm={() => triggerRegistration()} />

      {/* Inline Quick Registration Form Section */}
      <div className="w1200 mt20 mb20">
        <div className="semzxy4_header_add flex_center_space_between gap-4 py-4 px-6 bg-[#E0EFFF] border border-[#3991F6] rounded-xl shadow-inner">
          <div className="flex_column_center_center bg-[#1871D7] text-white p-3 rounded-lg w-[110px] h-[110px] shadow shrink-0">
            <span className="text-3xl mb-1">通</span>
            <div className="font-bold f15 leading-tight text-center">
              供应商<br/>快捷通道
            </div>
          </div>
          
          <form onSubmit={handleInlineSubmit} className="inline-reg-form flex-1 grid grid-cols-2 gap-x-4 gap-y-2.5 max-w-3xl">
            {/* Company Name */}
            <div className="flex_align_center">
              <span className="semzxy4_popup_c5_name shrink-0">企业名称：</span>
              <div className="semzxy4_popup_c5_in flex-1">
                <input 
                  type="text" 
                  placeholder="您的公司名称" 
                  className="semzxy4_popup_c5_input"
                  value={inlineOrgName}
                  onChange={e => setInlineOrgName(e.target.value)}
                />
              </div>
            </div>

            {/* Contact Name */}
            <div className="flex_align_center">
              <span className="semzxy4_popup_c5_name shrink-0">姓名：</span>
              <div className="semzxy4_popup_c5_in flex-1">
                <input 
                  type="text" 
                  placeholder="您的姓名" 
                  className="semzxy4_popup_c5_input"
                  value={inlineContactName}
                  onChange={e => setInlineContactName(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Phone */}
            <div className="flex_align_center">
              <span className="semzxy4_popup_c5_name shrink-0">联系方式：</span>
              <div className="semzxy4_popup_c5_in flex-1">
                <input 
                  type="text" 
                  placeholder="您的手机号" 
                  className="semzxy4_popup_c5_input"
                  value={inlineMobile}
                  onChange={e => setInlineMobile(e.target.value)}
                />
              </div>
            </div>

            {/* SMS Verification Code */}
            <div className="flex_align_center">
              <span className="semzxy4_popup_c5_name shrink-0">验证码：</span>
              <div className="semzxy4_popup_c6 flex-1">
                <input 
                  type="text" 
                  placeholder="验证码" 
                  className="semzxy4_popup_c5_input"
                  value={inlineCode}
                  onChange={e => setInlineCode(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={handleSendInlineSms}
                  disabled={inlineTimer > 0 || isSendingInlineSms}
                  className="semzxy4_popup_c5_yzm_blue text-xs font-semibold text-[#3991F6] hover:bg-blue-100 h-full shrink-0 border-l border-gray-300"
                >
                  {inlineTimer > 0 ? `${inlineTimer}s` : "获取验证码"}
                </button>
              </div>
            </div>

            {/* Privacy policy agreement check */}
            <div className="col-span-2 flex_align_center text-xs text-slate-500 pl-[74px]">
              <input 
                type="checkbox" 
                id="inline_privacy" 
                className="mr-2"
                checked={inlineYinsi}
                onChange={e => setInlineYinsi(e.target.checked)}
              />
              <label htmlFor="inline_privacy">
                授权并同意
                <a href="/SemH5/privacy" target="_blank" className="privacy-link font-semibold">《个人信息与隐私保护条款》</a>
              </label>
            </div>
          </form>

          <div className="flex_column_center_center shrink-0">
            <button 
              onClick={handleInlineSubmit}
              type="button" 
              className="semzxy4_popup_c7_btn2_blue w-[180px] h-[44px] font-bold"
            >
              提交资料进入下一步
            </button>
            <div className="text-[10px] text-gray-500 mt-1 font-semibold text-center">
              入驻咨询：{phone400}
            </div>
          </div>
        </div>
      </div>

      <ServiceConsulting onOpenForm={() => triggerRegistration()} />

      {/* Floating Hotline widget */}
      {showFloatWindow && (
        <>
          <div
            onClick={() => triggerRegistration()}
            className="float-window float-window-left flex flex-col cursor-pointer"
          >
            <div className="w-full flex justify-end mb-1">
              <button
                onClick={handleCloseFloat}
                className="text-gray-400 hover:text-gray-700 font-bold text-sm bg-gray-100/50 hover:bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
            <div className="float-window-content flex-1 text-left">
              <p className="text-[13px] leading-6 text-slate-700">
                {floatNoticeText}
              </p>
              <div className="mt-3 rounded bg-blue-50 px-3 py-2 text-center">
                <div className="text-[12px] font-bold text-blue-700">{floatHotlineLabel}</div>
                <div className="mt-0.5 font-mono text-[18px] font-extrabold text-slate-900">{phone400}</div>
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); triggerRegistration(); }}
              className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold"
            >
              {floatButtonLabel}
            </button>
          </div>

          <nav className="floating-menu-right" aria-label="政采快捷菜单">
            <div className="floating-menu-list">
              {floatingMenuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="floating-menu-item"
                  onClick={() => triggerRegistration()}
                >
                  <span className="floating-menu-icon" aria-hidden="true">
                    <HotServiceIcon type={item.icon} />
                  </span>
                  <span className="floating-menu-label">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </>
      )}

      <nav className="mobile-action-bar" aria-label="手机端入驻快捷菜单">
        <button type="button" className="mobile-action-item" onClick={() => triggerRegistration()}>
          <span className="mobile-action-icon" aria-hidden="true">
            <HotServiceIcon type="orbit" />
          </span>
          <span>入驻电话</span>
        </button>
        <button type="button" className="mobile-action-item" onClick={() => triggerRegistration()}>
          <span className="mobile-action-icon" aria-hidden="true">
            <HotServiceIcon type="shield" />
          </span>
          <span>会员登录</span>
        </button>
        <button type="button" className="mobile-action-item" onClick={() => triggerRegistration()}>
          <span className="mobile-action-icon" aria-hidden="true">
            <HotServiceIcon type="entry" />
          </span>
          <span>入驻报名</span>
        </button>
      </nav>

      {/* Login Progress Query Modal Dialog */}
      {showProgressQuery && (
        <div className="modal-overlay">
          <div className="modal-container max-w-sm p-6 text-slate-800">
            <div className="flex-between border-b pb-2 mb-4">
              <h3 className="text-sm font-bold">查询申报进度 / 会员登录</h3>
              <button 
                onClick={() => setShowProgressQuery(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleProgressQuerySubmit} className="space-y-4">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                输入您在 Step 1 中填写的联系电话，系统将读取申报进度并协助继续完成资料提交。
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">注册手机号</label>
                <input 
                  type="tel"
                  required
                  placeholder="请输入11位手机号"
                  value={queryPhone}
                  onChange={e => setQueryPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow"
              >
                查询进度并进入会员中心
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer copyright with admin triggers */}
      <footer className="bg-slate-900 text-gray-400 py-8 border-t-2 border-[#3991F6] mt-auto">
        <div className="w1200 text-center space-y-4 text-xs">
          
          <div className="flex justify-center gap-6 text-gray-300 font-semibold mb-2">
            <a href="#" onClick={(e) => { e.preventDefault(); triggerRegistration(); }} className="hover:underline">付费协议</a>
            <span>|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); triggerRegistration(); }} className="hover:underline">资质提交办法</a>
            <span>|</span>
            <a href="#" onClick={(e) => { e.preventDefault(); triggerRegistration(); }} className="hover:underline">会员中心</a>
            <span>|</span>
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="text-amber-500 hover:underline">
              后台管理（发布新闻/会员管理）
            </button>
          </div>

          {/* Admin news editor and progress monitor */}
          {showAdminPanel && (
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-left max-w-2xl mx-auto space-y-6">
              
              <div>
                <h4 className="text-xs font-bold text-amber-500 mb-2 border-b border-slate-700 pb-1">后台管理模块 - 新闻中心维护</h4>
                <form onSubmit={handleAddNews} className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-[10px] text-gray-300 mb-0.5">新闻标题</label>
                    <input 
                      type="text"
                      required
                      placeholder="关于政采平台采购注意事项..."
                      value={newNewsTitle}
                      onChange={e => setNewNewsTitle(e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-950 text-white border border-slate-700 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-300 mb-0.5">发布板块</label>
                    <select
                      value={newNewsTab}
                      onChange={e => setNewNewsTab(e.target.value as NewsTabId)}
                      className="w-full px-2 py-1.5 bg-slate-950 text-white border border-slate-700 rounded text-xs"
                    >
                      <option value="cggglist">政采头条</option>
                      <option value="xjlist">供应商动态</option>
                      <option value="jjlist">政策法规</option>
                      <option value="ddlist">新闻通知</option>
                    </select>
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <button 
                      type="submit"
                      className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded text-xs hover:bg-amber-400"
                    >
                      发布新闻 (自动标记 NEW)
                    </button>
                  </div>
                </form>

                {/* News listing under active tab with delete */}
                <div className="mt-4 max-h-[150px] overflow-y-auto border border-slate-700 rounded p-2 space-y-1">
                  <div className="font-bold text-[#3991F6] text-[10px] mb-1">当前展示的四个板块新闻数据：</div>
                  {cggglist.map(n => (
                    <div key={n.id} className="flex-between text-[10px] py-1 border-b border-slate-800">
                      <span className="truncate flex-1 pr-2">[政采头条] {n.title}</span>
                      <button onClick={() => handleDeleteNews("cggglist", n.id)} className="text-red-500 hover:underline">删除</button>
                    </div>
                  ))}
                  {xjlist.map(n => (
                    <div key={n.id} className="flex-between text-[10px] py-1 border-b border-slate-800">
                      <span className="truncate flex-1 pr-2">[供应商动态] {n.title}</span>
                      <button onClick={() => handleDeleteNews("xjlist", n.id)} className="text-red-500 hover:underline">删除</button>
                    </div>
                  ))}
                  {jjlist.map(n => (
                    <div key={n.id} className="flex-between text-[10px] py-1 border-b border-slate-800">
                      <span className="truncate flex-1 pr-2">[政策法规] {n.title}</span>
                      <button onClick={() => handleDeleteNews("jjlist", n.id)} className="text-red-500 hover:underline">删除</button>
                    </div>
                  ))}
                  {ddlist.map(n => (
                    <div key={n.id} className="flex-between text-[10px] py-1 border-b border-slate-800">
                      <span className="truncate flex-1 pr-2">[新闻通知] {n.title}</span>
                      <button onClick={() => handleDeleteNews("ddlist", n.id)} className="text-red-500 hover:underline">删除</button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-500 mb-2 border-b border-slate-700 pb-1">已注册会员及申报进度查询</h4>
                <div className="max-h-[150px] overflow-y-auto border border-slate-700 rounded p-2 text-[10px] space-y-1.5">
                  {(() => {
                    if (typeof window !== "undefined") {
                      const savedMembers = getStorageItem("zcy_members");
                      if (savedMembers) {
                        const members = parseStorageJson<MemberRecord>(savedMembers, {});
                        const list = Object.keys(members);
                        if (list.length > 0) {
                          return list.map(phone => (
                            <div key={phone} className="border-b border-slate-800 pb-1 flex justify-between items-center">
                              <div>
                                <strong>公司:</strong> {members[phone].companyName} | <strong>联系人:</strong> {members[phone].contactName} | <strong>电话:</strong> {phone}
                              </div>
                              <span className="bg-slate-900 text-emerald-500 px-1.5 py-0.5 rounded">
                                已进行到第 {members[phone].step || 1} 步
                              </span>
                            </div>
                          ));
                        }
                      }
                    }
                    return <p className="text-gray-500">暂无已提交的第一步会员数据。</p>;
                  })()}
                </div>
              </div>

            </div>
          )}

          <p className="text-[10px] text-gray-500">
            Copyright © 2026 全国政采云服务云平台 All Rights Reserved. 招采云服（北京）科技发展有限公司 版权所有
          </p>
          <p className="text-[10px] text-gray-500">
            公司介绍：招采云服（北京）科技发展有限公司 | 联系我们：北京市通州区漷县镇漷兴北大街16号 | 客服电话：{phone400}
          </p>
          <p className="text-[10px] text-rose-500 bg-rose-500/5 max-w-3xl mx-auto p-2.5 rounded-lg leading-relaxed">
            免责声明：本站为综合政府采购信息展示和服务平台，展示的政策及招标采购信息来源于公开发布机构。平台提供资料整理、系统代填报等技术咨询服务。
          </p>
        </div>
      </footer>

      {pendingEntryPrompt && (
        <div
          className="announcement-entry-mask"
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-entry-title"
          onClick={() => setPendingEntryPrompt(null)}
        >
          <div className="announcement-entry-dialog" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="announcement-entry-close"
              onClick={() => setPendingEntryPrompt(null)}
              aria-label="关闭"
            >
              ×
            </button>
            <h3 id="announcement-entry-title">您还没有入驻平台</h3>
            <p>{pendingEntryPrompt.title}</p>
            <div className="announcement-entry-actions">
              <button type="button" className="announcement-entry-primary" onClick={handleAnnouncementEntry}>
                现在入驻
              </button>
              <button type="button" className="announcement-entry-secondary" onClick={handleAnnouncementDetail}>
                稍后入驻
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Multi-step wizard dialog popup form */}
      <FormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialPhone={activePhone}
        detectedProvince={detectedProvince}
      />

    </div>
  );
}
