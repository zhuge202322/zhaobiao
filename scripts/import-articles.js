// 文章数据采集和导入脚本
// 使用方法: node scripts/import-articles.js

const articles = {
  // 政采头条 (cggglist)
  cggglist: [
    { id: "3338", title: "四川彩虹制药采购招标", date: "2026-07-05", newBadge: true },
    { id: "3375", title: "临洮县康家集乡学区临洮县康家集乡学区便携式计算机直接选定采购合同政府采购合同公告", date: "2026-07-05", newBadge: true },
    { id: "3374", title: "临洮县康家集乡学区临洮县康家集乡学区台式计算机直接选定采购合同政府采购合同公告", date: "2026-07-05", newBadge: true },
    { id: "3373", title: "定西市安定区教育局福台高级中学校舍维修改造建设施工合同政府采购合同公告", date: "2026-07-05" },
    { id: "3372", title: "岷县林业和草原局2026年度政府采购意向公告", date: "2026-07-05" },
    { id: "3371", title: "金塔县教育局甘肃省政府采购框架协议直购选定金塔政府采购合同公告", date: "2026-07-05" },
    { id: "3370", title: "四川省盐业学校食堂食材配送服务政府采购合同公告", date: "2026-07-05" },
    { id: "3369", title: "成都市郫都区人民医院2026年度政府采购意向公告(第20批)", date: "2026-07-05" },
    { id: "3368", title: "成都市龙泉驿区第一小学校成都市龙泉驿区第一小学校复印纸直接选定采购合同政府采购合同公告", date: "2026-07-05" },
    { id: "3367", title: "成都工业职业技术学院电子电路微组装工艺生产性实训室建设项目政府采购合同公告", date: "2026-07-05" }
  ],

  // 供应商动态 (xjlist)
  xjlist: [
    { id: "3396", title: "2026-2028年度西城区公共管理综合保险项目政府采购合同", date: "2026-07-05", newBadge: true },
    { id: "3395", title: "[顺义区]中教-内高班补助其他农副食品，动、植物油制品采购项目中标公告", date: "2026-07-05", newBadge: true },
    { id: "3394", title: "办学条件项目-十一学校朝阳实验学校教育教学设备设施项目-其他办公设备采购项目政府采购合同", date: "2026-07-05", newBadge: true },
    { id: "3393", title: "2026年校舍安全改造提升-管线改造类（热力改造工程）政府采购合同", date: "2026-07-05" },
    { id: "3392", title: "基建-2026年中小学校园食堂质量提升项目政府采购合同", date: "2026-07-05" },
    { id: "3391", title: "北京市房山区河北镇人民政府2026年8至12月政府采购意向", date: "2026-07-05" },
    { id: "3390", title: "北京市平谷区妇幼保健计划生育服务中心2026年1至12月政府采购意向", date: "2026-07-05" },
    { id: "3389", title: "[公开]北京市交通综合治理事务中心北京市道路停车电子收费运行调度和客诉处理中标公告", date: "2026-07-05" },
    { id: "3388", title: "[顺义区]中教-内高班补助其他农副食品，动、植物油制品采购项目中标公告", date: "2026-07-05" },
    { id: "3387", title: "[公开]2026年基础医学实验教学中心平台建设公开招标公告", date: "2026-07-05" }
  ],

  // 政策法规 (jjlist)
  jjlist: [
    { id: "3386", title: "国务院关于同意在上海市 设立上海辰山国家植物园的批复", date: "2026-07-05", newBadge: true },
    { id: "3384", title: "国务院关于《残疾人保障和发展 十五五规划》的批复", date: "2026-07-05", newBadge: true },
    { id: "3313", title: "[公开]2026年度业务技术装备购置-防护装备项目中标公告", date: "2026-07-05", newBadge: true },
    { id: "3311", title: "[公开]北京警察学院卫生医疗保障管理费项目废标公告", date: "2026-07-05" },
    { id: "3309", title: "[公开]污染源排放清单编制技术支持项目中标公告", date: "2026-07-05" },
    { id: "3307", title: "[公开]北京市市级行政事业单位会议服务框架协议采购项目（2026-2027年度） 入围结果公告（第十四批）", date: "2026-07-05" },
    { id: "3306", title: "北京市市场监督管理局单一来源2026年产品质量抽检委托检验服务项目征求意见公示", date: "2026-07-05" },
    { id: "3305", title: "市委党史研究室、市地方志办信息化能力提升项 目（应用系统适配改造及总体集成）政府采购合同", date: "2026-07-05" },
    { id: "3303", title: "[磋商]餐饮服务项目成交公告", date: "2026-07-05" },
    { id: "3302", title: "库房租赁合同补充协议", date: "2026-07-05" }
  ],

  // 新闻通知 (ddlist)
  ddlist: [
    { id: "3282", title: "中共中央办公厅 国务院办公厅印发《美丽中国建设成效考核办法》", date: "2026-07-05", newBadge: true },
    { id: "3281", title: "国务院关于同意在上海市暂时调整实施 有关行政法规规定的批复", date: "2026-07-05", newBadge: true },
    { id: "3280", title: "中华人民共和国行政复议法实施条例", date: "2026-07-05", newBadge: true },
    { id: "3279", title: "国务院2026年度立法工作计划", date: "2026-07-05" },
    { id: "3278", title: "中共中央办公厅印发《中国共产党发展党员工作细则》", date: "2026-07-05" },
    { id: "3277", title: "行政法规制定程序条例", date: "2026-07-05" },
    { id: "3276", title: "中共中央办公厅、国务院办公厅印发《关于用好乡镇（街道）履行职责事项清单的具体措施》", date: "2026-07-05" },
    { id: "3275", title: "中华人民共和国矿产资源法实施条例", date: "2026-07-05" },
    { id: "3274", title: "国务院关于推行常住地提供 基本公共服务的实施意见", date: "2026-07-05" },
    { id: "3273", title: "教育发展十五五规划", date: "2026-07-05" }
  ]
};

console.log('==== 政采通文章数据导入脚本 ====\n');
console.log('已采集文章数据：');
console.log(`- 政采头条: ${articles.cggglist.length} 篇`);
console.log(`- 供应商动态: ${articles.xjlist.length} 篇`);
console.log(`- 政策法规: ${articles.jjlist.length} 篇`);
console.log(`- 新闻通知: ${articles.ddlist.length} 篇`);
console.log(`- 总计: ${articles.cggglist.length + articles.xjlist.length + articles.jjlist.length + articles.ddlist.length} 篇\n`);

console.log('请按以下步骤导入数据：\n');
console.log('1. 访问后台管理页面: http://localhost:4003/admin');
console.log('2. 点击"文章资讯管理"标签');
console.log('3. 在左侧表单中逐条添加文章');
console.log('4. 或者打开浏览器控制台，运行以下代码批量导入：\n');

console.log('// 批量导入代码（复制到浏览器控制台执行）');
console.log('const articles = ' + JSON.stringify(articles, null, 2) + ';\n');

console.log(`
// 保存到 localStorage
Object.keys(articles).forEach(category => {
  const suffix = category === "cggglist" ? "cggg" : 
                 category === "xjlist" ? "xj" : 
                 category === "jjlist" ? "jj" : "dd";
  localStorage.setItem(\`zcy_news_\${suffix}\`, JSON.stringify(articles[category]));
});

console.log('✅ 文章数据导入成功！刷新页面查看效果。');
`);

console.log('\n==== 导入完成 ====');
