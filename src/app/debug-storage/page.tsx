"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DebugStorage() {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const cggg = localStorage.getItem('zcy_news_cggg');
    const xj = localStorage.getItem('zcy_news_xj');
    const jj = localStorage.getItem('zcy_news_jj');
    const dd = localStorage.getItem('zcy_news_dd');

    setData({
      cggg: cggg ? JSON.parse(cggg) : null,
      xj: xj ? JSON.parse(xj) : null,
      jj: jj ? JSON.parse(jj) : null,
      dd: dd ? JSON.parse(dd) : null
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">localStorage 数据调试</h1>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">政采头条 (zcy_news_cggg)</h2>
            <p className="text-green-400 mb-2">数量: {data.cggg?.length || 0} 篇</p>
            {data.cggg && data.cggg.length > 0 && (
              <div className="text-xs text-gray-400 space-y-1">
                {data.cggg.slice(0, 3).map((item: any) => (
                  <div key={item.id}>• {item.title}</div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">供应商动态 (zcy_news_xj)</h2>
            <p className="text-green-400 mb-2">数量: {data.xj?.length || 0} 篇</p>
            {data.xj && data.xj.length > 0 && (
              <div className="text-xs text-gray-400 space-y-1">
                {data.xj.slice(0, 3).map((item: any) => (
                  <div key={item.id}>• {item.title}</div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">政策法规 (zcy_news_jj)</h2>
            <p className="text-green-400 mb-2">数量: {data.jj?.length || 0} 篇</p>
            {data.jj && data.jj.length > 0 && (
              <div className="text-xs text-gray-400 space-y-1">
                {data.jj.slice(0, 3).map((item: any) => (
                  <div key={item.id}>• {item.title}</div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">新闻通知 (zcy_news_dd)</h2>
            <p className="text-green-400 mb-2">数量: {data.dd?.length || 0} 篇</p>
            {data.dd && data.dd.length > 0 && (
              <div className="text-xs text-gray-400 space-y-1">
                {data.dd.slice(0, 3).map((item: any) => (
                  <div key={item.id}>• {item.title}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-x-4">
          <Link href="/" className="inline-block px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            返回首页
          </Link>
          <Link href="/admin" className="inline-block px-4 py-2 bg-green-600 rounded hover:bg-green-700">
            后台管理
          </Link>
          <Link href="/import-articles" className="inline-block px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">
            重新导入
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            刷新页面
          </button>
        </div>
      </div>
    </div>
  );
}
