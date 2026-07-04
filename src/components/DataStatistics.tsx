import React from 'react';

const DataStatistics = () => {
  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="w1200">
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-full max-w-lg">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mx-6">政采数据统计</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          
          {/* Top Left: Pie Chart panel */}
          <div className="border border-gray-200 p-6 shadow-sm rounded">
            <h3 className="font-bold text-base text-slate-800 mb-1 flex items-center gap-2">
              <span className="text-xl text-slate-700">♥</span> 采购交易统计: 河北
            </h3>
            <p className="text-xs text-gray-500 mb-6">当月河北政采平台各类采购占比</p>
            
            <div className="flex items-center justify-between gap-8">
              <div className="space-y-3 flex-1 text-sm">
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-400 block"></span> 竞价采购</span> <span className="text-gray-600">71743.82万元</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-green-400 block"></span> 询价采购</span> <span className="text-gray-600">14368.63万元</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-400 block"></span> 电子反拍</span> <span className="text-gray-600">58476.94万元</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-400 block"></span> 定点采购</span> <span className="text-gray-600">72236.93万元</span></div>
                <div className="flex justify-between items-center"><span className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-500 block"></span> 直接采购</span> <span className="text-gray-600">91689.25万元</span></div>
              </div>
              
              {/* CSS Pie Chart Mockup */}
              <div 
                className="w-36 h-36 rounded-full shrink-0" 
                style={{
                  background: `conic-gradient(
                    #f87171 0% 25%, 
                    #4ade80 25% 30%, 
                    #60a5fa 30% 50%, 
                    #facc15 50% 75%, 
                    #6b7280 75% 100%
                  )`
                }}
              ></div>
            </div>
          </div>

          {/* Top Right: Location Map panel */}
          <div className="border border-gray-200 p-6 shadow-sm rounded">
            <h3 className="font-bold text-base text-slate-800 mb-1 flex items-center gap-2">
              <span className="text-xl text-slate-700">📍</span> 您所在的当前位置: 河北
            </h3>
            <p className="text-xs text-gray-500 mb-6">当月河北政采平台供应商、采购人、商品数据统计</p>
            
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">供应商数量:</div>
                  <div className="text-xl font-bold text-blue-500">46737 <span className="text-sm text-gray-800 font-normal">家</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">采购人数量:</div>
                  <div className="text-xl font-bold text-blue-500">8018 <span className="text-sm text-gray-800 font-normal">家</span></div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">商品总数量:</div>
                  <div className="text-xl font-bold text-blue-500">59157 <span className="text-sm text-gray-800 font-normal">家</span></div>
                </div>
              </div>
              <div className="text-center text-gray-400 relative">
                {/* Map Mockup SVG */}
                <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 20 L60 10 L80 30 L90 50 L70 70 L50 90 L30 70 L10 50 L20 30 Z" stroke="#cbd5e1" strokeWidth="1" fill="#f8fafc" />
                  <path d="M40 20 L50 40 L30 60" stroke="#cbd5e1" strokeWidth="1" />
                  <path d="M70 40 L60 60 L70 70" stroke="#cbd5e1" strokeWidth="1" />
                  <text x="50" y="45" fontSize="6" fill="#64748b" textAnchor="middle">石家庄市</text>
                  <text x="75" y="35" fontSize="5" fill="#64748b">承德市</text>
                  <text x="25" y="40" fontSize="5" fill="#64748b">张家口市</text>
                  <text x="65" y="65" fontSize="5" fill="#64748b">沧州市</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Left: Bar Chart */}
          <div className="border border-gray-200 p-6 shadow-sm rounded">
            <h3 className="font-bold text-base text-slate-800 mb-1 flex items-center gap-2">
              <span className="text-lg text-slate-700">📊</span> 全国政采平台入驻前6排名
            </h3>
            <p className="text-xs text-gray-500 mb-6">当月全国政采平台入驻商家数量排名</p>
            
            <div className="space-y-4">
              {[
                { name: "京华云采", count: 9946, color: "bg-red-400", width: "95%" },
                { name: "齐鲁云采", count: 8601, color: "bg-yellow-400", width: "80%" },
                { name: "徽采云", count: 7872, color: "bg-blue-400", width: "70%" },
                { name: "天津市政采中心网上商城", count: 7713, color: "bg-green-400", width: "60%" },
                { name: "山西省政采电子卖场", count: 4055, color: "bg-purple-400", width: "40%" },
                { name: "江苏政采网上商城", count: 1991, color: "bg-teal-400", width: "20%" }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs text-gray-700 mb-1">
                    <span>{item.name}</span>
                    <span className="text-gray-400">入驻商家: {item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-r">
                    <div className={`${item.color} h-3`} style={{ width: item.width }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Line Chart */}
          <div className="border border-gray-200 p-6 shadow-sm rounded">
            <h3 className="font-bold text-base text-slate-800 mb-1 flex items-center gap-2">
              <span className="text-lg text-slate-700">📈</span> 全国政采品类排名
            </h3>
            <p className="text-xs text-gray-500 mb-6">当月全国政采平台商品品类采购量排名</p>
            
            <div className="relative h-48 w-full">
              {/* Line chart SVG mockup */}
              <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="400" y2="140" stroke="#e2e8f0" strokeWidth="1" />
                
                {/* Line */}
                <polyline points="20,20 80,60 140,80 200,85 260,110 320,130 380,135" fill="none" stroke="#60a5fa" strokeWidth="2" />
                
                {/* Data points */}
                <circle cx="20" cy="20" r="4" fill="#3b82f6" />
                <circle cx="80" cy="60" r="4" fill="#60a5fa" />
                <circle cx="140" cy="80" r="4" fill="#60a5fa" />
                <circle cx="200" cy="85" r="4" fill="#60a5fa" />
                <circle cx="260" cy="110" r="4" fill="#60a5fa" />
                <circle cx="320" cy="130" r="4" fill="#60a5fa" />
                <circle cx="380" cy="135" r="4" fill="#60a5fa" />
              </svg>
              
              {/* Y Axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 py-3 -ml-6">
                <span>1,000</span>
                <span>800</span>
                <span>600</span>
                <span>400</span>
                <span>200</span>
                <span>0</span>
              </div>
              
              {/* X Axis labels */}
              <div className="absolute left-0 bottom-0 w-full flex justify-between text-[10px] text-gray-500 pt-2 px-3 transform translate-y-full">
                <span className="transform -rotate-45 origin-top-left ml-2">物业管理</span>
                <span className="transform -rotate-45 origin-top-left">独腿衣架</span>
                <span className="transform -rotate-45 origin-top-left">班椅</span>
                <span className="transform -rotate-45 origin-top-left">茶水柜</span>
                <span className="transform -rotate-45 origin-top-left">车辆加油</span>
                <span className="transform -rotate-45 origin-top-left mr-4">茶几</span>
              </div>
              
              {/* Leader badge */}
              <div className="absolute left-4 top-1 text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">1</div>
              <div className="absolute left-[72px] top-[41px] text-[10px] bg-blue-400 text-white rounded-full w-4 h-4 flex items-center justify-center">2</div>
            </div>
            
          </div>
        </div>

        {/* Bottom Banner Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {/* News List */}
          <div className="border border-gray-200 shadow-sm rounded flex flex-col">
            <div className="flex bg-[#eef5fd] border-b border-gray-200">
              <div className="px-6 py-3 font-bold text-white bg-blue-500 text-sm">行业新闻</div>
              <div className="px-6 py-3 font-bold text-gray-600 text-sm">招标热点</div>
            </div>
            <div className="p-4 flex-1">
              <ul className="space-y-3 text-sm">
                {[
                  { text: "法医硅藻自动分析设备的公开招标公告", date: "2026-07-04", new: true },
                  { text: "海洋调查卓越人才计划的公开招标公告", date: "2026-07-04", new: true },
                  { text: "上海市体育彩票管理中心2026年07月政采意向", date: "2026-07-04", new: true },
                  { text: "上海鲁迅纪念馆2026年06月政采意向", date: "2026-07-04" },
                  { text: "上海市公安局2026年08月政采意向", date: "2026-07-04" },
                  { text: "上海市公安局2026年08月政采意向", date: "2026-07-04" },
                  { text: "上海市公安局2026年08月政采意向", date: "2026-07-04" },
                  { text: "上海体育科学研究所（上海市反兴奋剂中心）202...", date: "2026-07-04" }
                ].map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center truncate pr-4">
                      <span className="text-blue-300 mr-2">»</span>
                      <span className="text-gray-700 group-hover:text-blue-500 truncate">{item.text}</span>
                      {item.new && <span className="text-[9px] text-blue-500 ml-2 italic">new</span>}
                    </div>
                    <span className="text-xs text-gray-400 shrink-0">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Ad Banner */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-8 rounded shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden border border-blue-200">
            {/* Birds mockup */}
            <div className="absolute top-4 left-4 text-red-500 text-2xl transform rotate-12 flex space-x-1">
              <span>🕊</span>
              <span className="text-lg">🕊</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold text-red-500 tracking-wider mb-2 filter drop-shadow-md" style={{textShadow: "2px 2px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff"}}>点击入驻</h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-red-500 mb-6 filter drop-shadow-md" style={{textShadow: "1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff"}}>政采电子卖场平台</h3>
            
            <div className="flex gap-4 text-sm font-bold text-gray-800 z-10">
              <span className="flex items-center"><span className="text-red-500 mr-1">✔</span>顺应国家趋势</span>
              <span className="flex items-center"><span className="text-red-500 mr-1">✔</span>获取更多商机</span>
              <span className="flex items-center"><span className="text-red-500 mr-1">✔</span>提升企业价值</span>
            </div>
            
            {/* Abstract background elements */}
            <div className="absolute right-[-20%] bottom-[-20%] w-64 h-64 bg-white opacity-20 rounded-full blur-2xl"></div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DataStatistics;
