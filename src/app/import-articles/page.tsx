"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportArticles() {
  const [status, setStatus] = useState('准备导入...');
  const [imported, setImported] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const articles = {
      "cggg": [
        {"id":"3338","title":"四川彩虹制药采购招标","date":"2026-07-05","newBadge":true},
        {"id":"3375","title":"临洮县康家集乡学区临洮县康家集乡学区便携式计算机直接选定采购合同政府采购合同公告","date":"2026-07-05","newBadge":true},
        {"id":"3374","title":"临洮县康家集乡学区临洮县康家集乡学区台式计算机直接选定采购合同政府采购合同公告","date":"2026-07-05","newBadge":true},
        {"id":"3373","title":"定西市安定区教育局福台高级中学校舍维修改造建设施工合同政府采购合同公告","date":"2026-07-05"},
        {"id":"3372","title":"岷县林业和草原局2026年度政府采购意向公告","date":"2026-07-05"},
        {"id":"3371","title":"金塔县教育局甘肃省政府采购框架协议直购选定金塔政府采购合同公告","date":"2026-07-05"},
        {"id":"3370","title":"四川省盐业学校食堂食材配送服务政府采购合同公告","date":"2026-07-05"},
        {"id":"3369","title":"成都市郫都区人民医院2026年度政府采购意向公告(第20批)","date":"2026-07-05"},
        {"id":"3368","title":"成都市龙泉驿区第一小学校成都市龙泉驿区第一小学校复印纸直接选定采购合同政府采购合同公告","date":"2026-07-05"},
        {"id":"3367","title":"成都工业职业技术学院电子电路微组装工艺生产性实训室建设项目政府采购合同公告","date":"2026-07-05"}
      ],
      "xj": [
        {"id":"3396","title":"2026-2028年度西城区公共管理综合保险项目政府采购合同","date":"2026-07-05","newBadge":true},
        {"id":"3395","title":"[顺义区]中教-内高班补助其他农副食品，动、植物油制品采购项目中标公告","date":"2026-07-05","newBadge":true},
        {"id":"3394","title":"办学条件项目-十一学校朝阳实验学校教育教学设备设施项目-其他办公设备采购项目政府采购合同","date":"2026-07-05","newBadge":true},
        {"id":"3393","title":"2026年校舍安全改造提升-管线改造类（热力改造工程）政府采购合同","date":"2026-07-05"},
        {"id":"3392","title":"基建-2026年中小学校园食堂质量提升项目政府采购合同","date":"2026-07-05"},
        {"id":"3391","title":"北京市房山区河北镇人民政府2026年8至12月政府采购意向","date":"2026-07-05"},
        {"id":"3390","title":"北京市平谷区妇幼保健计划生育服务中心2026年1至12月政府采购意向","date":"2026-07-05"},
        {"id":"3389","title":"[公开]北京市交通综合治理事务中心北京市道路停车电子收费运行调度和客诉处理中标公告","date":"2026-07-05"},
        {"id":"3388","title":"[顺义区]中教-内高班补助其他农副食品，动、植物油制品采购项目中标公告","date":"2026-07-05"},
        {"id":"3387","title":"[公开]2026年基础医学实验教学中心平台建设公开招标公告","date":"2026-07-05"}
      ],
      "jj": [
        {"id":"3386","title":"国务院关于同意在上海市 设立上海辰山国家植物园的批复","date":"2026-07-05","newBadge":true},
        {"id":"3384","title":"国务院关于《残疾人保障和发展 十五五规划》的批复","date":"2026-07-05","newBadge":true},
        {"id":"3313","title":"[公开]2026年度业务技术装备购置-防护装备项目中标公告","date":"2026-07-05","newBadge":true},
        {"id":"3311","title":"[公开]北京警察学院卫生医疗保障管理费项目废标公告","date":"2026-07-05"},
        {"id":"3309","title":"[公开]污染源排放清单编制技术支持项目中标公告","date":"2026-07-05"},
        {"id":"3307","title":"[公开]北京市市级行政事业单位会议服务框架协议采购项目（2026-2027年度） 入围结果公告（第十四批）","date":"2026-07-05"},
        {"id":"3306","title":"北京市市场监督管理局单一来源2026年产品质量抽检委托检验服务项目征求意见公示","date":"2026-07-05"},
        {"id":"3305","title":"市委党史研究室、市地方志办信息化能力提升项 目（应用系统适配改造及总体集成）政府采购合同","date":"2026-07-05"},
        {"id":"3303","title":"[磋商]餐饮服务项目成交公告","date":"2026-07-05"},
        {"id":"3302","title":"库房租赁合同补充协议","date":"2026-07-05"}
      ],
      "dd": [
        {"id":"3282","title":"中共中央办公厅 国务院办公厅印发《美丽中国建设成效考核办法》","date":"2026-07-05","newBadge":true},
        {"id":"3281","title":"国务院关于同意在上海市暂时调整实施 有关行政法规规定的批复","date":"2026-07-05","newBadge":true},
        {"id":"3280","title":"中华人民共和国行政复议法实施条例","date":"2026-07-05","newBadge":true},
        {"id":"3279","title":"国务院2026年度立法工作计划","date":"2026-07-05"},
        {"id":"3278","title":"中共中央办公厅印发《中国共产党发展党员工作细则》","date":"2026-07-05"},
        {"id":"3277","title":"行政法规制定程序条例","date":"2026-07-05"},
        {"id":"3276","title":"中共中央办公厅、国务院办公厅印发《关于用好乡镇（街道）履行职责事项清单的具体措施》","date":"2026-07-05"},
        {"id":"3275","title":"中华人民共和国矿产资源法实施条例","date":"2026-07-05"},
        {"id":"3274","title":"国务院关于推行常住地提供 基本公共服务的实施意见","date":"2026-07-05"},
        {"id":"3273","title":"教育发展十五五规划","date":"2026-07-05"}
      ]
    };

    try {
      setStatus('正在导入文章数据...');
      
      // 导入文章数据到 localStorage
      localStorage.setItem('zcy_news_cggg', JSON.stringify(articles.cggg));
      localStorage.setItem('zcy_news_xj', JSON.stringify(articles.xj));
      localStorage.setItem('zcy_news_jj', JSON.stringify(articles.jj));
      localStorage.setItem('zcy_news_dd', JSON.stringify(articles.dd));

      // 验证数据已保存
      const verify1 = localStorage.getItem('zcy_news_cggg');
      const verify2 = localStorage.getItem('zcy_news_xj');
      const verify3 = localStorage.getItem('zcy_news_jj');
      const verify4 = localStorage.getItem('zcy_news_dd');
      
      console.log('验证导入结果:');
      console.log('政采头条:', verify1 ? JSON.parse(verify1).length : 0, '篇');
      console.log('供应商动态:', verify2 ? JSON.parse(verify2).length : 0, '篇');
      console.log('政策法规:', verify3 ? JSON.parse(verify3).length : 0, '篇');
      console.log('新闻通知:', verify4 ? JSON.parse(verify4).length : 0, '篇');

      const total = articles.cggg.length + articles.xj.length + articles.jj.length + articles.dd.length;
      setStatus(`✅ 成功导入 ${total} 篇文章！`);
      setImported(true);
      
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      setStatus(`❌ 导入失败: ${error}`);
      console.error('导入错误:', error);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            {imported ? (
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-4">文章数据导入</h1>
          <p className="text-lg text-gray-600 mb-6">{status}</p>
          
          {imported && (
            <div className="space-y-2 text-sm text-gray-500">
              <p>- 政采头条: 10篇</p>
              <p>- 供应商动态: 10篇</p>
              <p>- 政策法规: 10篇</p>
              <p>- 新闻通知: 10篇</p>
              <p className="font-bold text-blue-600 mt-4">3秒后自动跳转到首页...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
