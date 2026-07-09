"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface MemberData {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  province: string;
  step: number;
  updatedAt: string;
  businessLicense?: string | null;
  bankPermit?: string | null;
  idCardFront?: string | null;
  idCardBack?: string | null;
  selectedServices?: string[];
  isPaid?: boolean;  // 是否已支付
  invoice?: {
    title: string;
    taxId: string;
    email: string;
  } | null;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  newBadge?: boolean;
}

const servicesList = [
  { id: "1", name: "政采平台入驻", price: 1500 },
  { id: "2", name: "CA锁申请", price: 500 },
  { id: "3", name: "开通政采店铺及产品上架", price: 1500 },
  { id: "4", name: "店铺托管运营", price: 3000 },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"submissions" | "articles" | "settings">("submissions");
  const [members, setMembers] = useState<Record<string, MemberData>>({});
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);

  // News States
  const [newsTab, setNewsTab] = useState<"cggglist" | "xjlist" | "jjlist" | "ddlist" | "ztbsj" | "zqcg">("cggglist");
  const [newsData, setNewsData] = useState<Record<string, NewsItem[]>>({
    cggglist: [],
    xjlist: [],
    jjlist: [],
    ddlist: [],
    ztbsj: [],
    zqcg: []
  });

  // Add Article Form States
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<"cggglist" | "xjlist" | "jjlist" | "ddlist" | "ztbsj" | "zqcg">("cggglist");
  const [newSource, setNewSource] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newDate, setNewDate] = useState("");

  // Settings State
  const [helpline, setHelpline] = useState("400-999-8839");

  // Load data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    if (typeof window !== "undefined") {
      // 1. Load submissions
      const savedMembers = localStorage.getItem("zcy_members");
      if (savedMembers) {
        setMembers(JSON.parse(savedMembers));
      }

      // 2. Load 400 Phone
      const savedPhone = localStorage.getItem("zcy_400_phone");
      if (savedPhone) {
        setHelpline(savedPhone);
      }

      // 3. Load News Lists
      const savedCggg = localStorage.getItem("zcy_news_cggg");
      const savedXj = localStorage.getItem("zcy_news_xj");
      const savedJj = localStorage.getItem("zcy_news_jj");
      const savedDd = localStorage.getItem("zcy_news_dd");
      const savedZtbsj = localStorage.getItem("zcy_news_ztbsj");
      const savedZqcg = localStorage.getItem("zcy_news_zqcg");

      setNewsData({
        cggglist: savedCggg ? JSON.parse(savedCggg) : [],
        xjlist: savedXj ? JSON.parse(savedXj) : [],
        jjlist: savedJj ? JSON.parse(savedJj) : [],
        ddlist: savedDd ? JSON.parse(savedDd) : [],
        ztbsj: savedZtbsj ? JSON.parse(savedZtbsj) : [],
        zqcg: savedZqcg ? JSON.parse(savedZqcg) : []
      });
    }
  };

  // Seed Mock Data Helper
  const seedMockSubmissions = () => {
    const mockData: Record<string, MemberData> = {
      "13800138000": {
        companyName: "广东彩虹医疗器械发展有限公司",
        contactName: "陈国强",
        phone: "13800138000",
        email: "chen.gq@caihongmed.com",
        province: "广东",
        step: 5,
        isPaid: true,
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        businessLicense: "yyzz_caihong_medical.jpg",
        bankPermit: "khxkz_caihong_ccb.jpg",
        idCardFront: "sfz_chen_front.jpg",
        idCardBack: "sfz_chen_back.jpg",
        selectedServices: ["1", "2"],
        invoice: {
          title: "广东彩虹医疗器械发展有限公司",
          taxId: "91440101MA59XXXXX8",
          email: "finance@caihongmed.com"
        }
      },
      "18912345678": {
        companyName: "四川恒通建设工程有限公司",
        contactName: "李建国",
        phone: "18912345678",
        email: "lijg@hengtongcon.cn",
        province: "四川",
        step: 5,
        isPaid: false,
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        businessLicense: "yyzz_hengtong_build.jpg",
        bankPermit: "khxkz_hengtong_icbc.jpg",
        idCardFront: "sfz_li_front.jpg",
        idCardBack: "sfz_li_back.jpg",
        selectedServices: ["1", "3", "4"],
        invoice: null
      },
      "15998765432": {
        companyName: "北京联想信息科技有限公司",
        contactName: "张小梅",
        phone: "15998765432",
        email: "zhangxm1@lenovo-info.com",
        province: "北京",
        step: 2,
        isPaid: false,
        updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        businessLicense: "yyzz_lenovo_info.jpg",
        bankPermit: "khxkz_lenovo_abchina.jpg",
        idCardFront: "sfz_zhang_front.jpg",
        idCardBack: "sfz_zhang_back.jpg",
        selectedServices: [],
        invoice: null
      }
    };
    localStorage.setItem("zcy_members", JSON.stringify(mockData));
    setMembers(mockData);
    alert("模拟表单数据导入成功！");
  };

  // Update payment status
  const handleUpdatePaymentStatus = (phone: string, isPaid: boolean) => {
    const updated = { ...members };
    if (updated[phone]) {
      updated[phone].isPaid = isPaid;
      updated[phone].updatedAt = new Date().toISOString();
      localStorage.setItem("zcy_members", JSON.stringify(updated));
      setMembers(updated);
      if (selectedMember?.phone === phone) {
        setSelectedMember(updated[phone]);
      }
      alert(`支付状态已更新为: ${isPaid ? "已支付" : "未支付"}`);
    }
  };

  // Delete submission
  const handleDeleteSubmission = (phone: string) => {
    if (confirm(`确定要删除该供应商的登记信息吗？(手机号: ${phone})`)) {
      const updated = { ...members };
      delete updated[phone];
      localStorage.setItem("zcy_members", JSON.stringify(updated));
      setMembers(updated);
      if (selectedMember?.phone === phone) {
        setSelectedMember(null);
      }
    }
  };

  // Add Article Handler
  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("请输入文章标题");

    const articleId = Math.floor(4000 + Math.random() * 6000).toString();
    const dateStr = newDate || new Date().toISOString().split("T")[0];

    const newArticleItem: NewsItem = {
      id: articleId,
      title: newTitle.trim(),
      date: dateStr,
      newBadge: true
    };

    // Save full readable content if input
    if (newContent.trim()) {
      const details = {
        title: newTitle.trim(),
        date: dateStr,
        source: newSource.trim() || "平台发布",
        content: newContent.trim()
      };
      
      // Merge into local storage readableArticles data
      const savedArticles = localStorage.getItem("zcy_readable_articles") || "{}";
      const articlesMap = JSON.parse(savedArticles);
      articlesMap[articleId] = details;
      localStorage.setItem("zcy_readable_articles", JSON.stringify(articlesMap));
      
      // Also write directly to the page.tsx accessible readableArticles map mock
      const globalArticles = localStorage.getItem("zcy_articles_db") || "{}";
      const gMap = JSON.parse(globalArticles);
      gMap[articleId] = details;
      localStorage.setItem("zcy_articles_db", JSON.stringify(gMap));
    }

    // Save to target category list
    const currentList = newsData[newCategory];
    const updatedList = [newArticleItem, ...currentList];
    
    const updatedNewsData = {
      ...newsData,
      [newCategory]: updatedList
    };

    const suffix = newCategory === "cggglist" ? "cggg" : newCategory === "xjlist" ? "xj" : newCategory === "jjlist" ? "jj" : newCategory === "ddlist" ? "dd" : newCategory;
    localStorage.setItem(`zcy_news_${suffix}`, JSON.stringify(updatedList));
    setNewsData(updatedNewsData);

    // Reset Form
    setNewTitle("");
    setNewSource("");
    setNewContent("");
    setNewDate("");
    alert("文章发布成功！新文章已添加至前端对应板块。");
  };

  // Delete Article
  const handleDeleteArticle = (category: string, id: string) => {
    if (confirm("确定要删除此文章吗？")) {
      const targetList = newsData[category as keyof typeof newsData];
      const updatedList = targetList.filter(item => item.id !== id);

      const updatedNewsData = {
        ...newsData,
        [category]: updatedList
      };

      const suffix = category === "cggglist" ? "cggg" : category === "xjlist" ? "xj" : category === "jjlist" ? "jj" : category === "ddlist" ? "dd" : category;
      localStorage.setItem(`zcy_news_${suffix}`, JSON.stringify(updatedList));
      setNewsData(updatedNewsData);

      // Clean detail mapping if exists
      const savedArticles = localStorage.getItem("zcy_readable_articles");
      if (savedArticles) {
        const map = JSON.parse(savedArticles);
        if (map[id]) {
          delete map[id];
          localStorage.setItem("zcy_readable_articles", JSON.stringify(map));
        }
      }
    }
  };

  // Save Settings Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!helpline.trim()) return alert("请输入电话号码");
    localStorage.setItem("zcy_400_phone", helpline.trim());
    alert("全局400电话配置保存成功！");
  };

  // Calculations for dashboard counters
  const totalSubmissions = Object.keys(members).length;
  const step5Count = Object.values(members).filter(m => m.step === 5).length;
  const paidCount = Object.values(members).filter(m => m.step === 5 && m.isPaid === true).length;
  const unpaidCount = Object.values(members).filter(m => m.step === 5 && m.isPaid === false).length;
  const invoiceCount = Object.values(members).filter(m => m.invoice !== null && m.invoice !== undefined).length;
  
  const totalEstRevenue = Object.values(members).reduce((sum, member) => {
    const srvIds = member.selectedServices || [];
    const memberCost = srvIds.reduce((s, id) => {
      const price = servicesList.find(item => item.id === id)?.price || 0;
      return s + price;
    }, 0);
    return sum + memberCost;
  }, 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      
      {/* Sidebar navigation */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🏛️</span>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white">全国政采云服务云平台</h1>
              <p className="text-[10px] text-slate-500 font-semibold">ADMIN DASHBOARD v1.1</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 pt-6">
          <button 
            onClick={() => setActiveTab("submissions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === "submissions" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>📋</span> 登记表单管理
          </button>
          <button 
            onClick={() => setActiveTab("articles")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === "articles" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>📰</span> 文章资讯管理
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === "settings" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-900/40" 
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <span>⚙️</span> 全局系统配置
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link 
            href="/" 
            className="w-full inline-flex justify-center items-center gap-2 px-4 py-2 border border-slate-700 hover:border-slate-500 rounded-lg text-[10px] font-bold text-slate-300 hover:text-white transition-colors"
          >
            <span>🌐</span> 预览前台页面
          </Link>
          <button 
            onClick={seedMockSubmissions}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg text-[10px] font-bold transition-all"
          >
            🧪 导入测试数据
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <div className="text-sm font-semibold text-slate-300">
            {activeTab === "submissions" && "登记表单数据总览"}
            {activeTab === "articles" && "新闻公告及可阅读详情管理"}
            {activeTab === "settings" && "系统客服与全局配置中心"}
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></div>
            <span className="text-xs text-slate-400 font-semibold">服务状态：运行正常</span>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Status Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xxs uppercase tracking-wider font-bold text-slate-500 block">累计登记客户数</span>
                <span className="text-2xl font-bold font-mono text-white mt-1 block">{totalSubmissions}</span>
              </div>
              <span className="text-2xl p-2 bg-blue-500/10 text-blue-500 rounded-lg">👥</span>
            </div>
            
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xxs uppercase tracking-wider font-bold text-slate-500 block">已完成流程供应商</span>
                <span className="text-2xl font-bold font-mono text-emerald-500 mt-1 block">{step5Count}</span>
              </div>
              <span className="text-2xl p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">✅</span>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xxs uppercase tracking-wider font-bold text-slate-500 block">已支付客户数</span>
                <span className="text-2xl font-bold font-mono text-blue-500 mt-1 block">{paidCount}</span>
              </div>
              <span className="text-2xl p-2 bg-blue-500/10 text-blue-500 rounded-lg">💳</span>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xxs uppercase tracking-wider font-bold text-slate-500 block">未支付客户数</span>
                <span className="text-2xl font-bold font-mono text-amber-500 mt-1 block">{unpaidCount}</span>
              </div>
              <span className="text-2xl p-2 bg-amber-500/10 text-amber-500 rounded-lg">⏳</span>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xxs uppercase tracking-wider font-bold text-slate-500 block">模拟签约应收金额</span>
                <span className="text-2xl font-bold font-mono text-blue-400 mt-1 block">¥{totalEstRevenue}</span>
              </div>
              <span className="text-2xl p-2 bg-blue-500/10 text-blue-400 rounded-lg">💰</span>
            </div>
          </div>

          {/* TAB 1: SUBMISSIONS PANEL */}
          {activeTab === "submissions" && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">供应商填报进度列表</h3>
                <span className="text-xxs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-400">
                  共计 {Object.keys(members).length} 条登记信息
                </span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                      <th className="p-4 pl-6">公司名称</th>
                      <th className="p-4">联系人姓名</th>
                      <th className="p-4">联系电话</th>
                      <th className="p-4">入驻省份</th>
                      <th className="p-4">最新提交时间</th>
                      <th className="p-4 text-center">当前进度</th>
                      <th className="p-4 text-center">支付状态</th>
                      <th className="p-4 text-right pr-6">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs">
                    {Object.keys(members).length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          暂无供应商数据。点击左下角“导入测试数据”可快速生成测试数据。
                        </td>
                      </tr>
                    ) : (
                      Object.values(members).map((m) => {
                        const isCompleted = m.step === 5;
                        const isPaid = m.isPaid === true;
                        
                        return (
                        <tr key={m.phone} className="hover:bg-slate-900/40">
                          <td className="p-4 pl-6 font-bold text-white max-w-[200px] truncate">{m.companyName}</td>
                          <td className="p-4 text-slate-300">{m.contactName}</td>
                          <td className="p-4 font-mono">{m.phone}</td>
                          <td className="p-4"><span className="bg-blue-900/20 text-blue-400 border border-blue-800/30 px-2 py-0.5 rounded text-[10px]">{m.province}</span></td>
                          <td className="p-4 text-slate-400 font-mono text-[10px]">{m.updatedAt ? m.updatedAt.slice(0, 16).replace("T", " ") : "未知"}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              isCompleted ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40" :
                              m.step === 4 ? "bg-blue-950 text-blue-400 border border-blue-800/40" :
                              m.step === 3 ? "bg-amber-950 text-amber-400 border border-amber-800/40" :
                              "bg-slate-900 text-slate-400 border border-slate-800"
                            }`}>
                              第 {m.step} 步 {isCompleted ? "(已完成)" : "(填报中)"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {isCompleted ? (
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                isPaid 
                                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40" 
                                  : "bg-rose-950 text-rose-400 border border-rose-800/40"
                              }`}>
                                {isPaid ? "✓ 已支付" : "✗ 未支付"}
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[9px]">-</span>
                            )}
                          </td>
                          <td className="p-4 text-right pr-6 space-x-2">
                            <button 
                              onClick={() => setSelectedMember(m)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-all"
                            >
                              查看详情
                            </button>
                            <button 
                              onClick={() => handleDeleteSubmission(m.phone)}
                              className="px-3 py-1 bg-slate-900 hover:bg-rose-950 text-rose-500 hover:text-rose-400 border border-slate-800 hover:border-rose-900 rounded text-[10px] font-bold transition-all"
                            >
                              删除
                            </button>
                          </td>
                        </tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES PANEL */}
          {activeTab === "articles" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Article Form */}
              <div className="lg:col-span-1 bg-slate-950 p-6 rounded-xl border border-slate-800 h-fit">
                <h3 className="font-bold text-sm text-white mb-4 border-b border-slate-800 pb-2">➕ 新增政策文章/新闻</h3>
                
                <form onSubmit={handleAddArticle} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-bold mb-1">文章标题</label>
                    <input 
                      type="text" 
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="例如: 2026年政府采购节能产品品目明细"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">发布栏目</label>
                    <select 
                      value={newCategory}
                      onChange={e => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white focus:outline-none"
                    >
                      <option value="cggglist">政采头条</option>
                      <option value="xjlist">供应商动态</option>
                      <option value="jjlist">政策法规</option>
                      <option value="ddlist">新闻通知</option>
                      <option value="ztbsj">招投标商机</option>
                      <option value="zqcg">政企采购电子卖场</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">发布机构/来源</label>
                    <input 
                      type="text" 
                      value={newSource}
                      onChange={e => setNewSource(e.target.value)}
                      placeholder="例如: 国务院办公厅、财政部"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">发布日期</label>
                    <input 
                      type="date" 
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 font-bold mb-1">文章详细内容正文 (支持换行，填写后前台可点击查看)</label>
                    <textarea 
                      value={newContent}
                      onChange={e => setNewContent(e.target.value)}
                      rows={8}
                      placeholder="请输入文章正文段落..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white focus:outline-none leading-relaxed"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-md shadow-blue-900/40 transition-all text-xs"
                  >
                    发布文章
                  </button>
                </form>
              </div>

              {/* Articles Listings */}
              <div className="lg:col-span-2 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
                <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between gap-1">
                  {[
                    { id: "cggglist", label: "政采头条" },
                    { id: "xjlist", label: "供应商动态" },
                    { id: "jjlist", label: "政策法规" },
                    { id: "ddlist", label: "新闻通知" },
                    { id: "ztbsj", label: "招投标商机" },
                    { id: "zqcg", label: "政企采购电子卖场" }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setNewsTab(tab.id as any)}
                      className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        newsTab === tab.id 
                          ? "bg-slate-800 text-white border border-slate-700" 
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6">
                  <div className="space-y-3">
                    {newsData[newsTab].length === 0 ? (
                      <p className="text-center py-12 text-slate-500 text-xs">
                        该栏目暂无自定义文章。可在左侧发布表单中发布新公告。
                      </p>
                    ) : (
                      newsData[newsTab].map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 rounded-lg transition-colors text-xs">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-white truncate">{item.title}</h4>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-semibold">
                              <span>ID: {item.id}</span>
                              <span>•</span>
                              <span>时间: {item.date}</span>
                              {item.newBadge && <span className="text-blue-400 font-bold bg-blue-900/10 px-1 py-0.2 rounded border border-blue-900/20">NEW</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteArticle(newsTab, item.id)}
                            className="px-3 py-1 bg-rose-950/40 hover:bg-rose-950 text-rose-500 border border-rose-900/30 hover:border-rose-950 rounded text-[10px] font-bold transition-all shrink-0"
                          >
                            删除
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SETTINGS PANEL */}
          {activeTab === "settings" && (
            <div className="max-w-xl bg-slate-950 p-6 rounded-xl border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-4 border-b border-slate-800 pb-2">⚙️ 客服电话配置及通用设置</h3>
              
              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5">悬浮窗 & 页面全局 400 客服电话</label>
                  <input 
                    type="text" 
                    value={helpline}
                    onChange={e => setHelpline(e.target.value)}
                    placeholder="请输入全国热线，如: 400-999-8839"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded focus:border-blue-500 text-white font-mono text-sm focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                    更改此项设置后，点击保存，首页顶部状态栏、横幅Banner、快捷表单咨询、客服卡片、浮动弹窗以及表单内所有的客服咨询号码均会自动全站热更新。
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded shadow-md shadow-blue-900/40 transition-all text-xs"
                  >
                    保存全局设置
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* VIEW DETAILS MODAL */}
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fadeIn text-xs">
            
            {/* Modal Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>📋</span> 供应商申报详情: {selectedMember.companyName}
              </h3>
              <button 
                onClick={() => setSelectedMember(null)}
                className="text-slate-400 hover:text-white text-xl font-bold focus:outline-none"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[500px] overflow-y-auto space-y-6 text-slate-300">
              
              {/* Row 1: Basic info */}
              <div>
                <h4 className="font-bold text-white border-b border-slate-800 pb-1 mb-2.5 text-xxs uppercase tracking-wider text-blue-400">第一步: 企业基础登记数据</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="text-slate-500 font-semibold">企业名称:</span> <span className="font-bold text-white">{selectedMember.companyName}</span></div>
                  <div><span className="text-slate-500 font-semibold">联系人姓名:</span> <span className="text-white">{selectedMember.contactName}</span></div>
                  <div><span className="text-slate-500 font-semibold">手机号码:</span> <span className="font-mono text-white">{selectedMember.phone}</span></div>
                  <div><span className="text-slate-500 font-semibold">电子邮箱:</span> <span className="text-white">{selectedMember.email || "未填写"}</span></div>
                  <div><span className="text-slate-500 font-semibold">入驻省份:</span> <span className="bg-blue-900/20 border border-blue-800/30 px-2 py-0.2 rounded text-[10px] text-blue-400">{selectedMember.province}</span></div>
                  <div><span className="text-slate-500 font-semibold">当前步骤进度:</span> <span className="font-bold text-amber-400">第 {selectedMember.step} 步</span></div>
                </div>
              </div>

              {/* Row 2: Uploaded documents */}
              <div>
                <h4 className="font-bold text-white border-b border-slate-800 pb-1 mb-2.5 text-xxs uppercase tracking-wider text-blue-400">第二步: 资质资料提交 (三证)</h4>
                <div className="space-y-2">
                  {/* 营业执照 */}
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-semibold">营业执照:</span>
                      {selectedMember.businessLicense ? (
                        <span className="text-emerald-400 text-[10px] font-bold">✓ 已上传</span>
                      ) : (
                        <span className="text-rose-500 text-[10px] font-bold">✗ 未上传</span>
                      )}
                    </div>
                    {selectedMember.businessLicense && (
                      <img 
                        src={selectedMember.businessLicense} 
                        alt="营业执照" 
                        className="w-full h-40 object-contain bg-slate-900 rounded border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => window.open(selectedMember.businessLicense!, '_blank')}
                      />
                    )}
                  </div>

                  {/* 开户许可证 */}
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-semibold">开户许可证/基本户信息:</span>
                      {selectedMember.bankPermit ? (
                        <span className="text-emerald-400 text-[10px] font-bold">✓ 已上传</span>
                      ) : (
                        <span className="text-rose-500 text-[10px] font-bold">✗ 未上传</span>
                      )}
                    </div>
                    {selectedMember.bankPermit && (
                      <img 
                        src={selectedMember.bankPermit} 
                        alt="开户许可证" 
                        className="w-full h-40 object-contain bg-slate-900 rounded border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => window.open(selectedMember.bankPermit!, '_blank')}
                      />
                    )}
                  </div>

                  {/* 法人身份证正面 */}
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-semibold">法人身份证正面 (加盖公章):</span>
                      {selectedMember.idCardFront ? (
                        <span className="text-emerald-400 text-[10px] font-bold">✓ 已上传</span>
                      ) : (
                        <span className="text-rose-500 text-[10px] font-bold">✗ 未上传</span>
                      )}
                    </div>
                    {selectedMember.idCardFront && (
                      <img 
                        src={selectedMember.idCardFront} 
                        alt="身份证正面" 
                        className="w-full h-40 object-contain bg-slate-900 rounded border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => window.open(selectedMember.idCardFront!, '_blank')}
                      />
                    )}
                  </div>

                  {/* 法人身份证反面 */}
                  <div className="p-3 bg-slate-950 rounded border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-slate-400 font-semibold">法人身份证反面 (加盖公章):</span>
                      {selectedMember.idCardBack ? (
                        <span className="text-emerald-400 text-[10px] font-bold">✓ 已上传</span>
                      ) : (
                        <span className="text-rose-500 text-[10px] font-bold">✗ 未上传</span>
                      )}
                    </div>
                    {selectedMember.idCardBack && (
                      <img 
                        src={selectedMember.idCardBack} 
                        alt="身份证反面" 
                        className="w-full h-40 object-contain bg-slate-900 rounded border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
                        onClick={() => window.open(selectedMember.idCardBack!, '_blank')}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Checked services and totals */}
              <div>
                <h4 className="font-bold text-white border-b border-slate-800 pb-1 mb-2.5 text-xxs uppercase tracking-wider text-blue-400">第三步: 业务办理选择与费用计算</h4>
                <div className="bg-slate-950 p-4 rounded border border-slate-850 space-y-3">
                  <div>
                    <span className="text-slate-500 block font-semibold mb-1">选择申请代办的业务目次：</span>
                    {(!selectedMember.selectedServices || selectedMember.selectedServices.length === 0) ? (
                      <span className="text-slate-500 italic block">尚未选择任何业务</span>
                    ) : (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedMember.selectedServices.map(id => {
                          const srv = servicesList.find(item => item.id === id);
                          return (
                            <span key={id} className="bg-emerald-950 text-emerald-400 border border-emerald-800/40 px-2 py-0.5 rounded text-[10px]">
                              {srv ? `${srv.name} (¥${srv.price})` : id}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-850 pt-2 flex justify-between items-center font-bold">
                    <span className="text-slate-400">应付代办服务费总额:</span>
                    <span className="text-base text-emerald-400 font-mono">
                      ¥{(() => {
                        const srvs = selectedMember.selectedServices || [];
                        return srvs.reduce((sum, id) => {
                          const price = servicesList.find(item => item.id === id)?.price || 0;
                          return sum + price;
                        }, 0);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 4: Invoice application details */}
              <div>
                <h4 className="font-bold text-white border-b border-slate-800 pb-1 mb-2.5 text-xxs uppercase tracking-wider text-blue-400">第四步: 增值税发票申请明细</h4>
                {!selectedMember.invoice ? (
                  <div className="p-3 bg-slate-950/60 rounded border border-slate-850/60 text-slate-500 italic">
                    该供应商尚未在此次入驻登记中申请开具发票。
                  </div>
                ) : (
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 space-y-2">
                    <div className="flex justify-between"><span className="text-slate-500 font-semibold">发票抬头:</span> <span className="font-bold text-white">{selectedMember.invoice.title}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-semibold">企业税号:</span> <span className="font-mono text-white">{selectedMember.invoice.taxId}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500 font-semibold">接收邮箱:</span> <span className="text-white">{selectedMember.invoice.email}</span></div>
                  </div>
                )}
              </div>

              {/* Row 5: Payment Status Management */}
              {selectedMember.step === 5 && (
                <div>
                  <h4 className="font-bold text-white border-b border-slate-800 pb-1 mb-2.5 text-xxs uppercase tracking-wider text-blue-400">支付状态人工审核</h4>
                  <div className="bg-slate-950 p-4 rounded border border-slate-850 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-semibold">当前支付状态:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedMember.isPaid 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800/40" 
                          : "bg-rose-950 text-rose-400 border border-rose-800/40"
                      }`}>
                        {selectedMember.isPaid ? "✓ 已支付" : "✗ 未支付"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-slate-500 text-[10px] mb-3">
                        管理员可以根据实际收款情况手动更新支付状态。请在确认收到款项后，点击"标记为已支付"按钮。
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdatePaymentStatus(selectedMember.phone, true)}
                          disabled={selectedMember.isPaid === true}
                          className={`flex-1 py-2 rounded text-xs font-bold transition-all ${
                            selectedMember.isPaid === true
                              ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {selectedMember.isPaid === true ? "✓ 已标记为已支付" : "标记为已支付"}
                        </button>
                        <button
                          onClick={() => handleUpdatePaymentStatus(selectedMember.phone, false)}
                          disabled={selectedMember.isPaid === false}
                          className={`flex-1 py-2 rounded text-xs font-bold transition-all ${
                            selectedMember.isPaid === false
                              ? "bg-slate-900 text-slate-600 cursor-not-allowed"
                              : "bg-rose-600 hover:bg-rose-500 text-white"
                          }`}
                        >
                          {selectedMember.isPaid === false ? "✗ 已标记为未支付" : "标记为未支付"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end">
              <button 
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition-all"
              >
                关闭窗口
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
