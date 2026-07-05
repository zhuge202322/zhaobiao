"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import FormModal from "@/components/FormModal";
import ProcurementPlatforms from "@/components/ProcurementPlatforms";
import DataStatistics from "@/components/DataStatistics";
import ServiceConsulting from "@/components/ServiceConsulting";
import {
  articlesById,
  defaultCggglist as readableCggglist,
  defaultDdlist as readableDdlist,
  defaultJjlist as readableJjlist,
  defaultXjlist as readableXjlist,
} from "@/lib/articles";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  newBadge?: boolean;
}

type NewsTabId = "cggglist" | "xjlist" | "jjlist" | "ddlist";

const provinces = [
  "北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江",
  "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
  "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
  "内蒙古", "广西", "西藏", "宁夏", "新疆", "香港", "澳门"
];

const carouselItems = [
  {
    title: "发挥政府采购政策功能，支持中小企业健康发展",
    img: "/carousel-1.jpg",
    url: "https://www.teda.gov.cn/contents/21/72948.html"
  },
  {
    title: "招标投标公共服务平台 CA 扫码互认共享试点",
    img: "/carousel-2.jpg",
    url: "http://www.cebpubservice.com/monitorindustry/monitorplat/2019/07/11252.shtml"
  },
  {
    title: "黄河流域政府采购协同发展工作研讨会",
    img: "/carousel-3.jpg",
    url: "http://www.360doc.com/content/23/0825/16/7288840_1093848366.shtml"
  },
  {
    title: "呼和浩特市召开 2025 年政府采购工作会议",
    img: "/carousel-4.jpg",
    url: "http://czj.huhhot.gov.cn/slb/czyw/202501/t20250110_1836060.html"
  }
];

interface OpenCard {
  id: string;
  title: string;
  keywords: string;
  tabs: string[];
}

const openCards: OpenCard[] = [
  { id: "infoopenlist1zb", title: "招投标商机", keywords: "", tabs: ["采购公告", "结果通知", "通知公告", "其它公告"] },
  { id: "infoopenlist2zb", title: "政企采购电子卖场", keywords: "局,市,街道,企业,电子卖场", tabs: ["采购公告", "结果通知", "变更通知", "其它公告"] },
  { id: "infoopenlist3zb", title: "央国企采购", keywords: "中央,央企,企业,国企,国家", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist4zb", title: "税务采购", keywords: "税务,税,税务采购,工商", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist5zb", title: "银行采购", keywords: "银行,保险,信用社,证券,金融", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist6zb", title: "军队采购", keywords: "军,部队,地方,国防,后勤,炊事,营房", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist7zb", title: "铁路采购", keywords: "铁路,轨道,工务,机车", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist8zb", title: "电网采购", keywords: "电网,电力,国网,供电", tabs: ["采购公告", "结果公告", "其它公告"] },
];

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activePhone, setActivePhone] = useState("");
  const [detectedProvince, setDetectedProvince] = useState("北京");
  const [phone400, setPhone400] = useState("400-999-8839");
  const [resolvedIp, setResolvedIp] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAllQueryLinks, setShowAllQueryLinks] = useState(false);
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  
  // Geolocation statistics
  const [stats, setStats] = useState({
    suppliers: 3177,
    buyers: 10329,
    items: 39619
  });

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

  // Main News Tabs State
  const [activeNewsTab, setActiveNewsTab] = useState<NewsTabId>("cggglist");
  const newsTabLabels: Record<NewsTabId, string> = {
    cggglist: "政采头条",
    xjlist: "供应商动态",
    jjlist: "政策法规",
    ddlist: "新闻通知",
  };
  const [cggglist, setCggglist] = useState<NewsItem[]>(readableCggglist);
  const [xjlist, setXjlist] = useState<NewsItem[]>(readableXjlist);
  const [jjlist, setJjlist] = useState<NewsItem[]>(readableJjlist);
  const [ddlist, setDdlist] = useState<NewsItem[]>(readableDdlist);
  const [ztbsjList, setZtbsjList] = useState<NewsItem[]>([]);
  const [zqcgList, setZqcgList] = useState<NewsItem[]>([]);

  // Bidding Announcement Cards State (Track selected tab per card ID)
  const [cardActiveTab, setCardActiveTab] = useState<Record<string, number>>({
    infoopenlist1zb: 0,
    infoopenlist2zb: 0,
    infoopenlist3zb: 0,
    infoopenlist4zb: 0,
    infoopenlist5zb: 0,
    infoopenlist6zb: 0,
    infoopenlist7zb: 0,
    infoopenlist8zb: 0,
  });

  // Carousel Slide State
  const [carouselIndex, setCarouselIndex] = useState(0);

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
  const floatRef = useRef<HTMLDivElement>(null);
  const [floatPos, setFloatPos] = useState({ x: 20, y: 180 });
  const floatDir = useRef({ dx: 1.5, dy: 1.5 });
  const animationFrameId = useRef<number | null>(null);
  const isHovered = useRef(false);

  // Statistics calculation helper
  function updateStats(prov: string) {
    const seed = prov.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const suppliers = 2000 + (seed % 1500);
    const buyers = 5000 + (seed % 6000);
    const items = 15000 + (seed % 30000);
    setStats({ suppliers, buyers, items });
  }

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
            updateStats(data.province);
            return;
          }
        }
      } catch (e) {
        console.error("Client geolocation fetch failed:", e);
      }
      // Fallback
      setDetectedProvince("北京");
      updateStats("北京");
    };
    geolocate();

    // 2. Load custom 400 hotline and news from localStorage
    window.setTimeout(() => {
      const savedPhone = localStorage.getItem("zcy_400_phone");
      if (savedPhone) {
        setPhone400(savedPhone);
      }

      const savedZtbsj = localStorage.getItem("zcy_news_ztbsj");
      const savedZqcg = localStorage.getItem("zcy_news_zqcg");

      if (savedZtbsj) setZtbsjList(JSON.parse(savedZtbsj));
      if (savedZqcg) setZqcgList(JSON.parse(savedZqcg));
    }, 0);
  }, []);

  // Carousel Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
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
    updateStats(prov);
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
      alert(`【政采通】您的验证码是：${code}，请在页面中输入完成验证。`);
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
    const savedMembers = localStorage.getItem("zcy_members") || "{}";
    const members = JSON.parse(savedMembers);
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
    localStorage.setItem("zcy_members", JSON.stringify(members));
    localStorage.setItem("zcy_active_user", inlineMobile);

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
    
    const savedMembers = localStorage.getItem("zcy_members");
    if (savedMembers) {
      const members = JSON.parse(savedMembers);
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

  // Floating Bouncing Widget logic
  useEffect(() => {
    const animateFloat = () => {
      if (isHovered.current || !floatRef.current) {
        animationFrameId.current = requestAnimationFrame(animateFloat);
        return;
      }

      const rect = floatRef.current.getBoundingClientRect();
      const elWidth = rect.width || 160;
      const elHeight = rect.height || 150;
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;

      setFloatPos(prev => {
        let newX = prev.x + floatDir.current.dx;
        let newY = prev.y + floatDir.current.dy;

        if (newX <= 0) {
          newX = 0;
          floatDir.current.dx = Math.abs(floatDir.current.dx);
        } else if (newX + elWidth >= viewWidth) {
          newX = viewWidth - elWidth;
          floatDir.current.dx = -Math.abs(floatDir.current.dx);
        }

        if (newY <= 0) {
          newY = 0;
          floatDir.current.dy = Math.abs(floatDir.current.dy);
        } else if (newY + elHeight >= viewHeight) {
          newY = viewHeight - elHeight;
          floatDir.current.dy = -Math.abs(floatDir.current.dy);
        }

        return { x: newX, y: newY };
      });

      animationFrameId.current = requestAnimationFrame(animateFloat);
    };

    if (showFloatWindow) {
      animationFrameId.current = requestAnimationFrame(animateFloat);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [showFloatWindow]);

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
      localStorage.setItem("zcy_news_cggg", JSON.stringify(updated));
    } else if (newNewsTab === "xjlist") {
      const updated = [item, ...xjlist];
      setXjlist(updated);
      localStorage.setItem("zcy_news_xj", JSON.stringify(updated));
    } else if (newNewsTab === "jjlist") {
      const updated = [item, ...jjlist];
      setJjlist(updated);
      localStorage.setItem("zcy_news_jj", JSON.stringify(updated));
    } else if (newNewsTab === "ddlist") {
      const updated = [item, ...ddlist];
      setDdlist(updated);
      localStorage.setItem("zcy_news_dd", JSON.stringify(updated));
    }

    setNewNewsTitle("");
    alert("新闻通知已发布，列表已成功更新。");
  };

  const handleDeleteNews = (tab: "cggglist" | "xjlist" | "jjlist" | "ddlist", id: string) => {
    if (confirm("确定要删除这篇新闻吗？")) {
      if (tab === "cggglist") {
        const u = cggglist.filter(n => n.id !== id);
        setCggglist(u);
        localStorage.setItem("zcy_news_cggg", JSON.stringify(u));
      } else if (tab === "xjlist") {
        const u = xjlist.filter(n => n.id !== id);
        setXjlist(u);
        localStorage.setItem("zcy_news_xj", JSON.stringify(u));
      } else if (tab === "jjlist") {
        const u = jjlist.filter(n => n.id !== id);
        setJjlist(u);
        localStorage.setItem("zcy_news_jj", JSON.stringify(u));
      } else if (tab === "ddlist") {
        const u = ddlist.filter(n => n.id !== id);
        setDdlist(u);
        localStorage.setItem("zcy_news_dd", JSON.stringify(u));
      }
    }
  };

  // Hot Search click handler
  const handleHotSearch = (kw: string) => {
    setSearchKeyword(kw);
    triggerRegistration();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none text-slate-800">
      
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
          
          <div className="hidden md:flex md:items-center gap-4 text-gray-500">
            <div className="text-gray-400 mr-2">
              您好，欢迎来到政采信息服务平台 | 数据监测中心已载入 <span className="font-semibold text-gray-600">供应商 {stats.suppliers} 家</span> | <span className="font-semibold text-gray-600">采购单位 {stats.buyers} 家</span>
            </div>
            <span className="font-bold text-[#3991F6]">服务热线：{phone400}</span>
            <span className="text-gray-300">|</span>
            <button onClick={() => triggerRegistration()} className="hover:text-[#3991F6] transition-colors">采购公告</button>
            <button onClick={() => triggerRegistration()} className="hover:text-[#3991F6] transition-colors">直采大厅</button>
            <button onClick={() => triggerRegistration()} className="hover:text-[#3991F6] transition-colors">入驻大厅</button>
            
            {/* Rules Dropdown */}
            <div className="relative group">
              <span className="cursor-pointer hover:text-[#3991F6] transition-colors flex_align_center gap-0.5">
                平台规则
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </span>
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded shadow-lg py-1 text-xs text-left hidden group-hover:block border border-gray-200 z-50">
                <a href="/rules/legal" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">法律声明</a>
                <a href="/rules/privacy" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">用户服务与隐私保护协议</a>
                <a href="/rules/qualification" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">供应商提交资质管理办法</a>
                <a href="/rules/sla" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">服务 SLA 交付标准</a>
                <a href="/rules/invoice" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">发票开具与退款说明</a>
              </div>
            </div>
            
            <span className="text-gray-300">|</span>
            <button onClick={() => setShowProgressQuery(true)} className="hover:text-[#3991F6] font-bold flex_align_center gap-1 transition-colors">
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
                alt="政采通Logo" 
                className="w-9 h-9 md:w-12 md:h-12 object-contain shrink-0"
              />
              <div>
                <div className="text-lg md:text-3xl font-bold text-slate-800 tracking-wide leading-tight">
                  政采通政采服务云平台
                </div>
                <div className="hidden md:block text-[10px] text-gray-400 font-mono tracking-widest mt-0.5">
                  ZHENG CAI TONG ZHENG CAI FU WU YUN PING TAI
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

      {/* Two Column News & Carousel Section */}
      <div className="w1200 mt10">
        <div className="semzxy4_c1 gap-4">
          
          {/* Left Carousel Image Slider */}
          <div className="semzxy4_c1_left relative group bg-slate-900 border border-gray-200">
            <div className="w-full h-full relative overflow-hidden">
              {carouselItems.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => triggerRegistration()}
                  className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 cursor-pointer ${
                    idx === carouselIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="semzxy4_c1_img w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="semzxy4_c1_ab z-20">
                    <div className="semzxy4_c1_text text-center text-white" title={item.title}>
                      {item.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Carousel navigation dots */}
            <div className="absolute right-4 top-4 z-30 flex gap-1.5 bg-black/45 px-2 py-1 rounded-full">
              {carouselItems.map((_, idx) => (
                <div 
                  key={idx} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCarouselIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    idx === carouselIndex ? "bg-white scale-125" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right tabbed news container */}
          <div className="semzxy4_c1_right">
            <div className="semzxy4_c1_right_top bg-E0EFFF">
              {([
                { id: "cggglist", label: "政采头条" },
                { id: "xjlist", label: "供应商动态" },
                { id: "jjlist", label: "政策法规" },
                { id: "ddlist", label: "新闻通知" }
              ] satisfies Array<{ id: NewsTabId; label: string }>).map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => setActiveNewsTab(tab.id)}
                  className={`semzxy4_c1_right_top_item ${
                    activeNewsTab === tab.id 
                      ? "fc-fff bg-3991F6" 
                      : "fc-333 hover:bg-[#d0e5ff] hover:text-[#3991F6]"
                  }`}
                >
                  {newsTabLabels[tab.id as keyof typeof newsTabLabels]}
                </div>
              ))}
            </div>

            <div className="semzxy4_c1_right_footer">
              <div className="semzxy4_c1_right_footer_list">
                
                {/* Active List Rendering */}
                {(() => {
                  const currentList = 
                    activeNewsTab === "cggglist" ? cggglist :
                    activeNewsTab === "xjlist" ? xjlist :
                    activeNewsTab === "jjlist" ? jjlist : ddlist;

                  return currentList.slice(0, 10).map((news, idx) => (
                    <div key={news.id || idx} className="semzxy4_c1_list_item mb10">
                      <div className="flex_align_center truncate">
                        <span className="text-[#3991F6] mr-2">▶</span>
                        <div className="semzxy4_c1_list_item_title ml5">
                          <Link
                            href={`/article/${encodeURIComponent(resolveArticleId(news.title, news.id))}`}
                            title={news.title}
                            className="text-[#333333] hover:text-[#3991F6] transition-colors"
                          >
                            {news.title}
                          </Link>
                        </div>
                        {news.newBadge && (
                          <span className="semzxy4_c1_list_item_new_blue text-[9px]">new</span>
                        )}
                      </div>
                    </div>
                  ));
                })()}

              </div>
            </div>
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

      {/* Inline Quick Registration Form Section */}
      <div className="w1200 mt20">
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

      {/* Hot Services Grid */}
      <div className="w1200 mt20">
        <div className="semzxy4_fw">
          <div className="semzxy4_fw_left bg-1871D7 flex_center_center text-center">
            <div>
              <div>政采平台</div>
              <div>供应商</div>
              <div className="mt-1 bg-yellow-400 text-slate-900 rounded text-[11px] px-1 font-bold">服务中心</div>
            </div>
          </div>
          
          <div className="semzxy4_fw_right relative overflow-hidden">
            {/* Standard double layout grid container */}
            <div className="flex flex-col h-full justify-between">
              {/* Row 1 */}
              <div className="hot-services-row flex justify-between items-center w-full">
                {[
                  { name: "供应商入驻", step: 1, hot: true },
                  { name: "CA锁办理", step: 2, hot: true },
                  { name: "供应商账户重置", step: 1, hot: true },
                  { name: "搭建政采店铺", step: 3, hot: false }
                ].map((srv, sidx) => (
                  <div 
                    key={sidx} 
                    onClick={() => triggerRegistration()} 
                    className="semzxy4_fw_right_list_item relative cursor-pointer"
                  >
                    <div className="semzxy4_fw_right_list_item_c flex_center_center relative">
                      <span>{srv.name}</span>
                      {srv.hot && (
                        <div className="absolute right-[-10px] top-[-15px]">
                          <span className="bg-rose-500 text-white font-mono text-[8px] px-1 py-0.5 rounded-full scale-75 animate-bounce">hot</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Splitting divider line */}
              <div className="semzxy4_fw_right_list_item_line"></div>
              
              {/* Row 2 */}
              <div className="hot-services-row flex justify-between items-center w-full">
                {[
                  { name: "店铺商品上架", step: 3, hot: true },
                  { name: "政采竞价服务", step: 3, hot: true },
                  { name: "政采业务结算", step: 3, hot: false },
                  { name: "投标报名服务", step: 1, hot: true }
                ].map((srv, sidx) => (
                  <div 
                    key={sidx} 
                    onClick={() => triggerRegistration()} 
                    className="semzxy4_fw_right_list_item relative cursor-pointer"
                  >
                    <div className="semzxy4_fw_right_list_item_c flex_center_center relative">
                      <span>{srv.name}</span>
                      {srv.hot && (
                        <div className="absolute right-[-10px] top-[-15px]">
                          <span className="bg-rose-500 text-white font-mono text-[8px] px-1 py-0.5 rounded-full scale-75 animate-bounce">hot</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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

        <div className="flex_jspace gap-6 w-full items-start">
          
          {/* Left query systems list (16 links) - Collapsible on mobile */}
          <div className="info-open-el w-full md:w-[280px] shrink-0 select-none bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
            <div className="text-slate-800 font-bold f15 mb-3 border-b border-gray-100 pb-2">
              招采资质与核验查询系统
            </div>
            <div className="grid grid-cols-1 gap-2.5">
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
                { title: "节能产品查询系统", icon: "节", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "电子卖场查询登录系统", icon: "卖" },
                { title: "国铁商城登录系统", icon: "铁" },
                { title: "京东查询登录系统", icon: "京" },
                { title: "国家电网查询登录系统", icon: "电" },
                { title: "慧采平台查询登录系统", icon: "采" },
                { title: "军队采购查询登录系统", icon: "军" }
              ].slice(0, isMobile && !showAllQueryLinks ? 6 : undefined).map((link, idx) => (
                <div key={idx} className="info-open-link-item">
                  <a 
                    className="info-open-link flex_align_center px-4 hover:bg-blue-50/50 rounded transition-all border border-gray-100 hover:border-blue-400 text-sm py-2 text-gray-600" 
                    href={link.link || "javascript:void(0);"} 
                    target={link.link ? "_blank" : undefined}
                    onClick={() => !link.link && triggerRegistration()}
                  >
                    <span className="text-lg mr-2.5 shrink-0">{link.icon}</span>
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
                      const baseItems: Array<NewsItem & { desc: string }> = [
                        { id: "open-1001", title: "吉安县行政事业单位国企产权转让格式范本及操作指南", desc: "适配公共资源交易目录规范，供应商可快速准备入驻方案。", date: "2026-07-03" },
                        { id: "open-1002", title: "行政事业单位政府采购格式范本说明", desc: "规范政府采购合规要点，降低资料退单率与审核驳回率。", date: "2026-07-03" },
                        { id: "open-1003", title: "关于电子卖场直购、竞价、询价的实施办法指导", desc: "梳理电子交易规则，协助企业搭建专属线上产品页面。", date: "2026-07-03" },
                        { id: "open-1004", title: "关于集中采购类目数字安全协议及 CA 锁申领指引", desc: "汇总安全加密与电子签章要件，是线上商务响应的必要工具。", date: "2026-07-03" }
                      ];

                      let dynamicItems: NewsItem[] = [];
                      if (card.id === "infoopenlist1zb") dynamicItems = ztbsjList;
                      if (card.id === "infoopenlist2zb") dynamicItems = zqcgList;

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

      <ProcurementPlatforms />
      <DataStatistics />
      <ServiceConsulting />

      {/* Corporate profile section */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="w1200 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider mb-2 inline-block">
              关于我们
            </span>
            <h3 className="text-xl font-bold text-slate-800 mb-4">政采通政采服务云平台简介</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              政采通政采服务云平台专注于“互联网+政府采购”的数字化服务，提供政采、企采、央采平台的信息咨询、供应商入驻、CA办理、店铺搭建、商品上架等一站式服务。
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              团队熟悉招投标业务、电子卖场规则和采购流程，能够协助供应商规范准备资料、提升响应效率，并为企业参与采购活动提供持续支持。
            </p>
          </div>
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-800">服务咨询核心细节</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div><strong>进度记录：</strong>提交后系统会缓存申报数据，可通过手机号找回并继续后续资料提交。</div>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div><strong>渠道范围：</strong>服务覆盖全国多省市电子卖场和政府采购平台，按不同区域政策要求提供资料预审。</div>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div><strong>售后保障：</strong>专业团队按合同标准推进服务交付，并协助完成发票、结算和后续维护。</div>
              </div>
            </div>
            <div className="bg-blue-600 text-white rounded-xl p-4 text-center">
              <div className="text-[10px] uppercase font-bold text-blue-200">政采入驻服务热线</div>
               <div className="text-xl font-bold font-mono mt-1">{phone400}</div>
              <div className="text-[9px] text-blue-100 mt-1">工作时间：周一至周日 09:00 - 22:00</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Hotline widget */}
      {showFloatWindow && (
        <div 
          ref={floatRef}
          onMouseEnter={() => { isHovered.current = true; }}
          onMouseLeave={() => { isHovered.current = false; }}
          onClick={() => triggerRegistration()}
          style={{ 
            left: `${floatPos.x}px`, 
            top: `${floatPos.y}px`,
          }}
          className="float-window flex flex-col items-center justify-between border-2 border-blue-500 shadow-xl cursor-pointer hover:border-amber-500"
        >
          <div className="w-full flex justify-end">
            <button 
              onClick={handleCloseFloat}
              className="text-gray-400 hover:text-gray-700 font-bold text-sm bg-gray-100/50 hover:bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
            >
              ×
            </button>
          </div>
          <div className="text-center flex-1 py-1">
            <span className="text-xl block">电话</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block mt-1">政采咨询热线</span>
            <span className="text-xs font-bold text-gray-800 font-mono block mt-0.5">{phone400}</span>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); triggerRegistration(); }}
            className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
          >
            立即在线登记
          </button>
        </div>
      )}

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
                      const savedMembers = localStorage.getItem("zcy_members");
                      if (savedMembers) {
                        const members = JSON.parse(savedMembers);
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
            Copyright © 2026 政采通政采服务云平台 All Rights Reserved. 招采云服（北京）科技发展有限公司 版权所有
          </p>
          <p className="text-[10px] text-gray-500">
            公司介绍：招采云服（北京）科技发展有限公司 | 联系我们：北京市通州区漷县镇漷兴北大街16号 | 客服电话：{phone400}
          </p>
          <p className="text-[10px] text-rose-500 bg-rose-500/5 max-w-3xl mx-auto p-2.5 rounded-lg leading-relaxed">
            免责声明：本站为综合政府采购信息展示和服务平台，展示的政策及招标采购信息来源于公开发布机构。平台提供资料整理、系统代填报等技术咨询服务。
          </p>
        </div>
      </footer>

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
