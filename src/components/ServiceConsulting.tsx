"use client";

import React from "react";

const serviceGroups = [
  {
    title: "政企采购电子卖场服务",
    icon: "📄",
    items: ["入驻", "托管/运营", "政采业务陪跑", "培训"],
  },
  {
    title: "招投标服务",
    icon: "🚩",
    items: ["CA办理", "标书制作服务", "投标资质办理", "线上投标服务"],
  },
  {
    title: "商机数据服务",
    icon: "🌐",
    items: ["商务信息发布", "投标商机", "政采商机", "招采数据分析"],
  },
  {
    title: "软件技术服务",
    icon: "⚙",
    items: ["信息推送软件", "产品上架精灵", "标书制作软件", "电子签章软件"],
  },
];

const ServiceConsulting = () => {
  return (
    <section id="service-consulting" className="bg-white py-12 border-t border-gray-200">
      <div className="w1200">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-full max-w-lg">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mx-6">服务咨询中心</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>

        <div className="mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-100 border-b border-gray-200 mb-4">
            {serviceGroups.map((group) => (
              <div key={group.title} className="py-3 px-4 font-bold text-gray-700 text-sm flex items-center justify-center gap-2">
                {group.title} <span className="text-blue-500 text-lg">{group.icon}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            {serviceGroups.map((group) => (
              <div key={group.title} className="flex justify-center">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                  {group.items.map((item) => (
                    <a key={item} href="#service-consult-form" className="text-left hover:text-blue-500 transition-colors">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-600 overflow-hidden relative p-8 md:p-12 text-center rounded">
          <div className="absolute inset-0 opacity-40 mix-blend-color-dodge">
            <svg width="100%" height="100%" preserveAspectRatio="none">
              <path d="M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50 L1200,100 L0,100 Z" fill="#fbbf24" opacity="0.3" />
              <circle cx="10%" cy="30%" r="5" fill="#fcd34d" />
              <circle cx="20%" cy="70%" r="3" fill="#fcd34d" />
              <circle cx="45%" cy="80%" r="6" fill="#fcd34d" />
              <circle cx="75%" cy="20%" r="4" fill="#fcd34d" />
              <circle cx="85%" cy="60%" r="7" fill="#fcd34d" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-widest relative z-10" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
            深入推进政府采购改革 助力国家数字化采购平台建设
          </h2>
        </div>

        <div className="mt-8 bg-[#eef5fd] border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="bg-[#1f7ae1] text-white rounded-lg w-full md:w-36 h-32 flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="text-3xl mb-1">🏁</span>
            <span className="font-bold text-lg leading-tight text-center tracking-widest">供应商<br />快捷通道</span>
          </div>

          <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700 w-[70px] shrink-0 text-right">企业名称:</label>
              <input type="text" placeholder="您的公司名称" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 shadow-inner" />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-bold text-gray-700 w-[70px] shrink-0 text-right">姓名:</label>
              <input type="text" placeholder="您的姓名" className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 shadow-inner" />
            </div>
            <div className="flex items-start gap-2">
              <label className="text-sm font-bold text-gray-700 w-[70px] shrink-0 text-right pt-2">联系方式:</label>
              <div className="flex-1">
                <input type="text" placeholder="您的手机号" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-2 shadow-inner" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-3.5 h-3.5" />
                  <span className="text-xs text-gray-500">授权并同意 <a href="/SemH5/privacy" target="_blank" rel="noreferrer" className="text-blue-500">《个人信息与隐私保护条款》</a></span>
                </label>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <label className="text-sm font-bold text-gray-700 w-[70px] shrink-0 text-right pt-2">验证码:</label>
              <div className="flex-1 flex h-[38px] shadow-inner rounded">
                <input type="text" placeholder="验证码" className="w-24 flex-1 border border-r-0 border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                <button type="button" className="bg-[#e0efff] text-blue-500 border border-gray-300 rounded-r px-3 text-xs hover:bg-blue-100 transition-colors shrink-0">获取验证码</button>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center">
            <a href="#service-consult-form" className="bg-[#4695fb] hover:bg-blue-600 text-white font-bold text-lg py-3 px-8 rounded shadow-md transition-colors w-full md:w-auto">
              提交资料进入下一步
            </a>
            <div className="text-[11px] text-gray-500 mt-2 font-mono">入驻咨询: 400-999-8839</div>
          </div>
        </div>
      </div>

      <div id="service-consult-form" className="service-consult-popup">
        <a href="#service-consulting" className="absolute inset-0" aria-label="关闭咨询表单"></a>
        <div className="relative z-10 w-[92%] max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-start justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-800">服务咨询登记</h3>
              <p className="mt-1 text-xs text-gray-500">提交后客服会尽快联系您，协助办理相关服务。</p>
            </div>
            <a href="#service-consulting" className="text-xl font-bold text-gray-400 hover:text-gray-700">×</a>
          </div>
          <form className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">企业名称</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="请输入公司名称" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">联系人</label>
              <input type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="请输入联系人姓名" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">联系电话</label>
              <input type="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500" placeholder="请输入手机号" />
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <input id="service-consult-privacy" type="checkbox" className="h-3.5 w-3.5" />
              <label htmlFor="service-consult-privacy">授权并同意《个人信息与隐私保护条款》</label>
            </div>
            <button type="button" className="mt-2 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              提交咨询
            </button>
          </form>
        </div>
      </div>
      <style>{`
        .service-consult-popup {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
        }
        .service-consult-popup:target {
          display: flex;
        }
      `}</style>
    </section>
  );
};

export default ServiceConsulting;
