import React from 'react';

const ServiceConsulting = () => {
  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="w1200">
        
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center w-full max-w-lg">
            <div className="h-px bg-gray-300 flex-1"></div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 mx-6">服务咨询中心</h2>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>

        <div className="mb-10">
          {/* Header Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 bg-gray-100 border-b border-gray-200 mb-4">
            <div className="py-3 px-4 font-bold text-gray-700 text-sm flex items-center justify-center gap-2">
              政企采购电子卖场服务 <span className="text-blue-500 text-lg">📄</span>
            </div>
            <div className="py-3 px-4 font-bold text-gray-700 text-sm flex items-center justify-center gap-2">
              招投标服务 <span className="text-blue-500 text-lg">🚩</span>
            </div>
            <div className="py-3 px-4 font-bold text-gray-700 text-sm flex items-center justify-center gap-2">
              商机数据服务 <span className="text-blue-500 text-lg">🌐</span>
            </div>
            <div className="py-3 px-4 font-bold text-gray-700 text-sm flex items-center justify-center gap-2">
              软件技术服务 <span className="text-blue-500 text-lg">⚙</span>
            </div>
          </div>

          {/* Links Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6">
            
            {/* Col 1 */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-500">入驻</a>
                <a href="#" className="hover:text-blue-500">托管/运营</a>
                <a href="#" className="hover:text-blue-500">政采业务陪跑</a>
                <a href="#" className="hover:text-blue-500">培训</a>
              </div>
            </div>

            {/* Col 2 */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-500">CA办理</a>
                <a href="#" className="hover:text-blue-500">标书制作服务</a>
                <a href="#" className="hover:text-blue-500">投标资质办理</a>
                <a href="#" className="hover:text-blue-500">线上投标服务</a>
              </div>
            </div>

            {/* Col 3 */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-500">商务信息发布</a>
                <a href="#" className="hover:text-blue-500">投标商机</a>
                <a href="#" className="hover:text-blue-500">政采商机</a>
                <a href="#" className="hover:text-blue-500">招采数据分析</a>
              </div>
            </div>

            {/* Col 4 */}
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-gray-600">
                <a href="#" className="hover:text-blue-500">信息推送软件</a>
                <a href="#" className="hover:text-blue-500">产品上架精灵</a>
                <a href="#" className="hover:text-blue-500">标书制作软件</a>
                <a href="#" className="hover:text-blue-500">电子签章软件</a>
              </div>
            </div>

          </div>
        </div>

        {/* Big Red Banner */}
        <div className="bg-red-600 overflow-hidden relative p-8 md:p-12 text-center rounded">
          {/* Decorative background elements (mocking the golden sparkles in the banner) */}
          <div className="absolute inset-0 opacity-40 mix-blend-color-dodge">
             {/* Creating a simple golden wave pattern via SVG */}
             <svg width="100%" height="100%" preserveAspectRatio="none">
               <path d="M0,50 Q100,0 200,50 T400,50 T600,50 T800,50 T1000,50 T1200,50 L1200,100 L0,100 Z" fill="#fbbf24" opacity="0.3"/>
               <circle cx="10%" cy="30%" r="5" fill="#fcd34d" />
               <circle cx="20%" cy="70%" r="3" fill="#fcd34d" />
               <circle cx="45%" cy="80%" r="6" fill="#fcd34d" />
               <circle cx="75%" cy="20%" r="4" fill="#fcd34d" />
               <circle cx="85%" cy="60%" r="7" fill="#fcd34d" />
             </svg>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-widest relative z-10" style={{textShadow: "2px 2px 4px rgba(0,0,0,0.3)"}}>
            深入推进政府采购改革 助力国家数字化采购平台建设
          </h2>
        </div>

        {/* Supplier Quick Access Form */}
        <div className="mt-8 bg-[#eef5fd] border border-blue-200 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          {/* Left Block */}
          <div className="bg-[#1f7ae1] text-white rounded-lg w-full md:w-36 h-32 flex flex-col items-center justify-center shrink-0 shadow-inner">
            <span className="text-3xl mb-1">🏁</span>
            <span className="font-bold text-lg leading-tight text-center tracking-widest">供应商<br/>快捷通道</span>
          </div>
          
          {/* Form Inputs */}
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
                <button className="bg-[#e0efff] text-blue-500 border border-gray-300 rounded-r px-3 text-xs hover:bg-blue-100 transition-colors shrink-0">获取验证码</button>
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="shrink-0 flex flex-col items-center">
            <button 
              onClick={() => alert("您的信息已提交！我们的专属客服将尽快与您联系。")}
              className="bg-[#4695fb] hover:bg-blue-600 text-white font-bold text-lg py-3 px-8 rounded shadow-md transition-colors w-full md:w-auto"
            >
              提交资料进入下一步
            </button>
            <div className="text-[11px] text-gray-500 mt-2 font-mono">入驻咨询: 400-999-8839</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServiceConsulting;
