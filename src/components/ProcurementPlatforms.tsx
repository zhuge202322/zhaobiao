"use client";
import React, { useRef, useEffect } from 'react';

const nationalPlatforms = [
  { name: "吉林政府采购网", sub: "政采云", iconColor: "text-red-500", icon: "〇" },
  { name: "上海市政府采购网", sub: "网上超市", iconColor: "text-yellow-600", icon: "△" },
  { name: "山东政府采购网", sub: "齐鲁云采", iconColor: "text-blue-500", icon: "⚡" },
  { name: "陕西政府采购网", sub: "网上商城", iconColor: "text-red-600", icon: "政" },
  { name: "浙江政府采购网", sub: "政采云", iconColor: "text-blue-600", icon: "◉" },
  { name: "山西政府采购网", sub: "电子卖场", iconColor: "text-blue-400", icon: "■" },
  { name: "湖南政府采购网", sub: "政采云", iconColor: "text-blue-500", icon: "❈" },
  { name: "内蒙古政府采购网", sub: "电子卖场", iconColor: "text-blue-400", icon: "✈" },
  { name: "江西政府采购网", sub: "电子卖场", iconColor: "text-green-500", icon: "◒" },
  { name: "黑龙江政府采购网", sub: "电子卖场", iconColor: "text-blue-600", icon: "☯" },
  { name: "广东政府采购网", sub: "电子卖场", iconColor: "text-blue-500", icon: "ⓔ" },
  { name: "宁夏政府采购网", sub: "网上商城", iconColor: "text-blue-400", icon: "宁" },
  { name: "湖北政府采购网", sub: "网上商城", iconColor: "text-blue-300", icon: "湖" },
  { name: "安徽政府采购网", sub: "徽采云", iconColor: "text-green-700", icon: "🌲" },
  { name: "四川政府采购网", sub: "框架协议电子化采购系统", iconColor: "text-blue-500", icon: "★" },
  { name: "扶贫832平台", sub: "中介服务超市", iconColor: "text-red-500", icon: "⑧" },
];

const enterprisePlatforms = [
  { name: "中铝集团", sub: "中铝集团电子招投标平台", iconColor: "text-blue-700", icon: "A" },
  { name: "云筑网", sub: "助推建筑行业数字化", iconColor: "text-green-500", icon: "☁" },
  { name: "中国电力", sub: "中国电力招标", iconColor: "text-blue-600", icon: "E" },
  { name: "中国南方电网", sub: "CHINA SOUTHERN...", iconColor: "text-blue-800", icon: "☰" },
  { name: "机电设备招标采购...", sub: "机电设备招标采购平台", iconColor: "text-red-500", icon: "⚙" },
  { name: "中电招标网", sub: "中电招标网", iconColor: "text-green-600", icon: "⚡" },
  { name: "中国机电设备招标中心", sub: "中国机电设备招标中心", iconColor: "text-red-600", icon: "T" },
  { name: "中国石化", sub: "SINOPEC", iconColor: "text-red-500", icon: "S" },
  { name: "中国南方航空采...", sub: "CHINA SOUTHERN...", iconColor: "text-blue-500", icon: "✈" },
  { name: "中国安能", sub: "中国安能电子采购平台", iconColor: "text-blue-700", icon: "N" },
  { name: "中国建设招标网", sub: "中国建设招标网", iconColor: "text-red-600", icon: "C" },
  { name: "能源一号网", sub: "中国石油电子采购系统", iconColor: "text-yellow-500", icon: "O" },
  { name: "伟拓招标采购交易...", sub: "伟拓招标采购交易平台", iconColor: "text-red-600", icon: "W" },
  { name: "中国电建", sub: "中国电建集中采购平台", iconColor: "text-blue-600", icon: "P" },
  { name: "中国联通", sub: "联通电子招标投标交易...", iconColor: "text-red-500", icon: "U" },
  { name: "中国政府采购招标网", sub: "中国政府采购招标网", iconColor: "text-blue-500", icon: "G" },
];

export default function ProcurementPlatforms() {
  const nationalRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const autoScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (ref.current) {
        // If we've reached the end (with a small 10px buffer), scroll back to 0
        if (ref.current.scrollLeft + ref.current.clientWidth >= ref.current.scrollWidth - 10) {
          ref.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          ref.current.scrollBy({ left: 280, behavior: 'smooth' }); // Scroll by approximately one card width
        }
      }
    };

    const interval = setInterval(() => {
      autoScroll(nationalRef);
      autoScroll(enterpriseRef);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#eef5fd] py-8 md:py-12 border-t border-gray-200">
      <div className="w1200 overflow-hidden">
        
        {/* National Platforms */}
        <div className="mb-10 relative">
          <div className="flex items-center justify-center mb-6">
            <button 
              onClick={() => scroll(nationalRef, 'left')} 
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &lt;
            </button>
            <div className="flex items-center w-full max-w-3xl">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mx-6">全国政采交易平台</h2>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <button 
              onClick={() => scroll(nationalRef, 'right')}
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &gt;
            </button>
          </div>

          <div className="relative">
            {/* Scrollable Container */}
            <div 
              ref={nationalRef}
              className="grid grid-rows-2 grid-flow-col auto-cols-[260px] md:auto-cols-[280px] lg:auto-cols-[220px] gap-3 md:gap-4 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {nationalPlatforms.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 md:p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow border border-white hover:border-blue-100 cursor-pointer snap-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl shrink-0 bg-gray-50 ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enterprise Platforms */}
        <div className="mb-4 relative">
          <div className="flex items-center justify-center mb-6">
            <button 
              onClick={() => scroll(enterpriseRef, 'left')} 
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &lt;
            </button>
            <div className="flex items-center w-full max-w-3xl">
              <div className="h-px bg-gray-300 flex-1"></div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mx-6">央国企采购平台</h2>
              <div className="h-px bg-gray-300 flex-1"></div>
            </div>
            <button 
              onClick={() => scroll(enterpriseRef, 'right')}
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &gt;
            </button>
          </div>

          <div className="relative">
            {/* Scrollable Container */}
            <div 
              ref={enterpriseRef}
              className="grid grid-rows-2 grid-flow-col auto-cols-[260px] md:auto-cols-[280px] lg:auto-cols-[220px] gap-3 md:gap-4 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {enterprisePlatforms.map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 md:p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow border border-white hover:border-blue-100 cursor-pointer snap-start">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xl shrink-0 bg-gray-50 ${item.iconColor} font-bold`}>
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </section>
  );
}
