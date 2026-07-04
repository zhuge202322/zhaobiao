"use client";

import React, { useState, useEffect, useRef } from "react";
import FormModal from "@/components/FormModal";
import ProcurementPlatforms from "@/components/ProcurementPlatforms";
import DataStatistics from "@/components/DataStatistics";
import ServiceConsulting from "@/components/ServiceConsulting";

interface NewsItem {
  id: string;
  title: string;
  date: string;
  newBadge?: boolean;
}

// News lists matching the crawled articles
const defaultCggglist: NewsItem[] = [
  { id: "3338", title: "四川彩虹制药采购招标", date: "2026-07-03", newBadge: true },
  { id: "3348", title: "哈尔滨师范大学阶梯教室配套装饰装修工程中标（成交）结果公告", date: "2026-07-03", newBadge: true },
  { id: "3346", title: "哈尔滨医科大学附属肿瘤医院零星维修竞争性磋商公告", date: "2026-07-03", newBadge: true },
  { id: "3345", title: "哈尔滨理工大学超长期国债项目实验室管理平台等采购项目(二次)政府采购合同公告", date: "2026-07-03" },
  { id: "3344", title: "哈尔滨理工大学学位证书等印刷服务政府采购合同公告", date: "2026-07-03" },
  { id: "3343", title: "哈尔滨理工大学2026年度政府采购意向公告(第39批)", date: "2026-07-03" },
  { id: "3342", title: "哈尔滨理工大学2026年度政府采购意向公告(第37批)", date: "2026-07-03" },
  { id: "3341", title: "哈尔滨理工大学2026年度政府采购意向公告(第38批)", date: "2026-07-03" },
  { id: "3340", title: "鸡西市中级人民法院零星维修（一）政府采购合同公告", date: "2026-07-03" },
  { id: "3339", title: "哈尔滨医科大学2026年后勤改造项目一标段政府采购合同公告", date: "2026-07-03" },
];

const defaultXjlist: NewsItem[] = [
  { id: "3357", title: "台湖镇第四次全国农业普查专业化普查服务项目政府采购合同", date: "2026-07-03", newBadge: true },
  { id: "3356", title: "北京市海淀区人民政府曙光街道办事处2026年1至12月政府采购意向", date: "2026-07-03", newBadge: true },
  { id: "3355", title: "2026年平谷区（滨河街道）老旧小区综合治理项目（工程量清单及最高投标限价编制）其他咨询服务采购项目政府采购合同", date: "2026-07-03", newBadge: true },
  { id: "3354", title: "北京市门头沟区住房 and 城乡建设委员会2026年1至12月政府采购意向", date: "2026-07-03" },
  { id: "3353", title: "2026年北京市第十三中学分校保洁服务采购政府采购合同", date: "2026-07-03" },
  { id: "3352", title: "北京市东城区人民政府和平里街道办事处本级2026年1至12月政府采购意向", date: "2026-07-03" },
  { id: "3351", title: "2026年设备新购-北京市第十三中学分校-新址教育教学设备购置项目台式计算机采购项目政府采购合同", date: "2026-07-03" },
  { id: "3350", title: "首都医科大学一流学科建设与拔尖创新人才培养设备更新项目之一政府采购合同", date: "2026-07-03" },
  { id: "3349", title: "[公开]北京工业大学饮食服务中心食品原材料采购第一批中标公告", date: "2026-07-03" },
  { id: "3347", title: "[公开]通州校区管理中心学生公寓物业服务项目中标公告", date: "2026-07-03" },
];

const defaultJjlist: NewsItem[] = [
  { id: "3313", title: "[公开]2026年度业务技术装备购置-防护装备项目中标公告", date: "2026-07-03", newBadge: true },
  { id: "3311", title: "[公开]北京警察学院卫生医疗保障管理费项目废标公告", date: "2026-07-03", newBadge: true },
  { id: "3309", title: "[公开]污染源排放清单编制技术支持项目中标公告", date: "2026-07-03", newBadge: true },
  { id: "3307", title: "[公开]北京市市级行政事业单位会议服务框架协议采购项目（2026-2027年度） 入围结果公告（第十四批）", date: "2026-07-03" },
  { id: "3306", title: "北京市市场监督管理局单一来源2026年产品质量抽检委托检验服务项目征求意见公示", date: "2026-07-03" },
  { id: "3305", title: "市委党史研究室、市地方志办信息化能力提升项 目（应用系统适配改造及总体集成）政府采购合同", date: "2026-07-03" },
  { id: "3303", title: "[磋商]餐饮服务项目成交公告", date: "2026-07-03" },
  { id: "3302", title: "库房租赁合同补充协议", date: "2026-07-03" },
  { id: "3282", title: "中共中央办公厅 国务院办公厅印发《美丽中国建设成效考核办法》", date: "2026-07-03" },
  { id: "3281", title: "国务院关于同意在上海市暂时调整实施  有关行政法规规定的批复", date: "2026-07-03" },
];

const defaultDdlist: NewsItem[] = [
  { id: "3280", title: "中华人民共和国行政复议法实施条例", date: "2026-07-03", newBadge: true },
  { id: "3279", title: "国务院2026年度立法工作计划", date: "2026-07-03", newBadge: true },
  { id: "3278", title: "中共中央办公厅印发《中国共产党发展党员工作细则》", date: "2026-07-03", newBadge: true },
  { id: "3277", title: "行政法规制定程序条例", date: "2026-07-03" },
  { id: "3276", title: "中共中央办公厅、国务院办公厅印发《关于用好乡镇（街道）履行职责事项清单的具体措施》", date: "2026-07-03" },
  { id: "3275", title: "中华人民共和国矿产资源法实施条例", date: "2026-07-03" },
  { id: "3274", title: "国务院关于推行常住地提供  基本公共服务的实施意见", date: "2026-07-03" },
  { id: "3273", title: "教育发展“十五五”规划", date: "2026-07-03" },
  { id: "3263", title: "法医硅藻自动分析设备的公开招标公告", date: "2026-07-03" },
  { id: "3262", title: "海洋调查卓越人才计划的公开招标公告", date: "2026-07-03" },
];

const provinces = [
  "北京", "天津", "上海", "重庆", "河北", "山西", "辽宁", "吉林", "黑龙江",
  "江苏", "浙江", "安徽", "福建", "江西", "山东", "河南", "湖北", "湖南",
  "广东", "海南", "四川", "贵州", "云南", "陕西", "甘肃", "青海", "台湾",
  "内蒙古", "广西", "西藏", "宁夏", "新疆", "香港", "澳门"
];

// Carousel images
const carouselItems = [
  {
    title: "发挥政采政策功能，支持中小企业健康发展",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    url: "https://www.teda.gov.cn/contents/21/72948.html"
  },
  {
    title: "招标投标公共服务平台-CA扫码互认共享试点",
    img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
    url: "http://www.cebpubservice.com/monitorindustry/monitorplat/2019/07/11252.shtml"
  },
  {
    title: "黄河流域政采协同发展工作研讨会",
    img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80",
    url: "http://www.360doc.com/content/23/0825/16/7288840_1093848366.shtml"
  },
  {
    title: "呼市召开2025年政采工作会议",
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    url: "http://czj.huhhot.gov.cn/slb/czyw/202501/t20250110_1836060.html"
  }
];

// Cards for info-open-er
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
  { id: "infoopenlist6zb", title: "军队采购", keywords: "军,部队,地方,团,后勤,炊事,旅,警", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist7zb", title: "铁路采购", keywords: "铁路,轨道,工务,机车", tabs: ["采购公告", "结果公告", "其它公告"] },
  { id: "infoopenlist8zb", title: "电网采购", keywords: "电网,电力,国网,供电", tabs: ["采购公告", "结果公告", "其它公告"] },
];

interface ReadableArticleDetails {
  title: string;
  date: string;
  source: string;
  content: string;
}

const readableArticles: Record<string, ReadableArticleDetails> = {
  "行政事业单位政府采购格式范本说明": {
    title: "行政事业单位政府采购格式范本说明",
    date: "2026-07-03",
    source: "采购政务服务",
    content: "本说明旨在规范政府采购合规要点，降低资质退单率与审核驳回率，确保政府采购活动公平、公正、公开。"
  },
  "关于集中采购类目数字安全协议及CA锁申领指引": {
    title: "关于集中采购类目数字安全协议及CA锁申领指引",
    date: "2026-07-03",
    source: "采购政务服务",
    content: "安全加密与电子签章要件汇总，是线上进行商务应标的必要工具。请相关单位及时完成CA锁的申领与绑定操作。"
  },
  "招标投标公共服务平台-CA扫码互认共享试点": {
    title: "招标投标公共服务平台-CA扫码互认共享试点",
    date: "2026-07-03",
    source: "招标投标公共服务平台",
    content: "关于CA扫码互认共享试点的通知：\n\n为进一步优化营商环境，降低交易成本，解决招投标领域数字证书（CA）跨区域、跨平台互认难的问题，本平台将联合国家信息中心正式开展CA扫码互认共享试点工作。\n\n各参与试点的供应商，即日起可通过手机APP扫码完成身份验证、电子签章及标书加密解密，无需重复办理多把实体CA锁。\n\n具体操作指南和支持的试点区域，请参见附件《CA互认操作手册》。"
  },
  "黄河流域政采协同发展工作研讨会": {
    title: "黄河流域政采协同发展工作研讨会",
    date: "2026-07-01",
    source: "政府采购云服务中心",
    content: "黄河流域政采协同发展工作研讨会顺利召开\n\n会议指出，黄河流域各省区要深入贯彻落实生态保护和高质量发展重大国家战略，在政府采购领域加强协同联动。会议围绕如何建立统一开放、竞争有序的区域政府采购大市场，如何推动绿色采购、支持中小企业发展等议题进行了深入交流。\n\n下一步，各方将探索建立黄河流域政府采购合作备忘录，实现采购信息共享、评审专家库互联互通，共同打造阳光、高效的区域政采营商环境。"
  },
  "呼市召开2025年政采工作会议": {
    title: "呼市召开2025年政采工作会议",
    date: "2026-06-29",
    source: "呼和浩特市财政局",
    content: "呼和浩特市召开2025年政府采购工作会议\n\n会议全面总结了去年政府采购工作取得的成效，并对2025年重点工作进行了部署。会议强调：\n\n1. 持续深化政府采购制度改革，全面落实采购人主体责任。\n2. 加大政府采购支持科技创新、绿色低碳及中小企业发展的政策力度。\n3. 全面推进政府采购数字化转型，提升电子化采购平台的稳定性与智能化水平。\n4. 加强政府采购监督检查，严厉打击各类违法违规行为，营造公平竞争的市场环境。"
  },
  "3338": {
    title: "四川彩虹制药采购招标",
    date: "2026-07-03",
    source: "四川彩虹制药招标采购办",
    content: "一、采购项目名称：四川彩虹制药有限公司制药设备及耗材年度框架协议采购项目\n\n二、采购方式：公开招标\n\n三、采购预算：人民币 2,500,000.00 元\n\n四、供应商资格要求：\n1. 具有独立承担民事责任的能力；\n2. 具有良好的商业信誉和健全的财务会计制度；\n3. 具有履行合同所必需的设备和专业技术能力；\n4. 参加采购活动前三年内，在经营活动中没有重大违法记录；\n5. 本项目不接受联合体投标。\n\n五、招标范围及要求：\n本次采购包含但不限于高效液相色谱仪、颗粒度分析仪、制药配料反应釜备件、实验室高纯度试剂及常用制药生产耗材等。需在规定时间内按批次保质保量交付至指定工厂。\n\n六、获取招标文件及投标登记方式：\n符合条件的供应商请通过本平台进行首次供应商入驻及数字证书（CA锁）办理登记，方可下载电子招标文件并进行线上加密标书递交。"
  },
  "3280": {
    title: "中华人民共和国行政复议法实施条例",
    date: "2026-07-03",
    source: "国务院办公厅",
    content: "中华人民共和国行政复议法实施条例\n\n第一条 为了规范行政复议法实施，保证行政复议机关依法履行职责，保障公民、法人和其他组织的合法权益，根据《中华人民共和国行政复议法》，制定本条例。\n\n第二条 行政复议机关履行行政复议职责，应当遵循合法、公正、公开、及时、便民的原则，坚持有错必纠，保障法律、法规的正确实施。\n\n第三条 政府采购当事人对政府采购监督管理部门做出的行政处罚、处理决定等不服的，可以依法向同级人民政府或者上级主管部门申请行政复议。行政复议期间，除法定情形外，具体行政行为不停止执行。\n\n第四条 各级行政复议机关应当加强信息化建设，推进线上行政复议申请的受理与审查工作，提高复议工作透明度与便民程度。\n\n第五条 本条例自发布之日起施行。"
  },
  "3279": {
    title: "国务院2026年度立法工作计划",
    date: "2026-07-03",
    source: "国务院办公厅",
    content: "国务院2026年度立法工作计划\n\n为贯彻落实党中央决策部署，健全国家治理急需、人民美好生活需要、国家安全急需的法律法规制度，国务院制定了2026年度立法工作计划。\n\n一、指导思想与总体要求：\n坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻党的二十大精神，系统推进法治政府建设。聚焦高质量发展，优化营商环境，维护公平竞争市场秩序。\n\n二、拟提请全国人大常委会审议 of 法律草案（共8部）：\n- 中华人民共和国政府采购法（修订草案）\n- 中华人民共和国招标投标法（修订草案）\n- 中华人民共和国民事诉讼法（修改草案）\n\n三、拟制定、修订的行政法规（共12部）：\n- 政府采购法实施条例（修订）\n- 国有土地上房屋征收与补偿条例（修改）\n- 电子招标投标办法（修改）\n\n四、工作要求：\n各起草部门要切实履行职责，深入调查研究，广泛听取市场主体与行业协会意见，确保立法质量和进度安排。"
  },
  "3282": {
    title: "中共中央办公厅 国务院办公厅印发《美丽中国建设成效考核办法》",
    date: "2026-07-03",
    source: "中共中央办公厅、国务院办公厅",
    content: "中共中央办公厅 国务院办公厅印发《美丽中国建设成效考核办法》\n\n第一条 为深入贯彻习近平生态文明思想，落实党中央关于美丽中国建设的决策部署，对各省、自治区、直辖市美丽中国建设成效进行客观评价与科学考核，制定本办法。\n\n第二条 考核工作坚持导向鲜明、客观公正、系统协同、重在实效的原则。考核内容主要包括生态环境质量改善、绿色低碳循环发展、生态保护与修复、污染防治攻坚战成效等方面。\n\n第三条 指标评价中明确提出“推行绿色低碳采购”的要求。各级国家机关、事业单位和团体组织在政府采购活动中，应当积极采购通过绿色产品认证、低碳认证、节能节水认证的产品，发挥政府采购在推动社会整体绿色低碳转型中的政策示范效应。\n\n第四条 考核结果作为各级党政领导班子和领导干部奖惩、选拔任用的重要依据。\n\n第五条 本办法由生态环境部会同有关部门负责解释，自发布之日起施行。"
  },
  "3357": {
    title: "台湖镇第四次全国农业普查专业化普查服务项目政府采购合同",
    date: "2026-07-03",
    source: "北京市通州区台湖镇人民政府",
    content: "台湖镇第四次全国农业普查专业化普查服务项目政府采购合同\n\n一、合同编号：TH-2026-AP04\n\n二、采购人（甲方）：北京市通州区台湖镇人民政府\n三、中标供应商（乙方）：北京招采信息科技有限公司\n\n四、合同金额：人民币 860,000.00 元（大写：捌拾陆万元整）\n\n五、服务范围及内容：\n乙方负责台湖镇辖区内第四次全国农业普查的所有专业化普查服务。主要任务包括：\n1. 普查员培训与物资准备；\n2. 全镇农业经营主体（农业企业、农民专业合作社等）及所有农户的入户摸底与登记工作；\n3. 普查原始数据的录入、初审、清洗及上报；\n4. 普查数据质量抽查及总结报告编制。\n\n七、履行期限：\n自合同签订之日起至普查数据通过国家、省、市、区级最终审核验收之日止。\n\n八、违约责任：\n任何一方未履行合同义务或履行不符合规定的，应承担相应的违约责任，并向守约方支付合同金额 5% 的违约金。"
  },
  "吉安县行政事业单位国企产权转让格式范本及操作指南": {
    title: "吉安县行政事业单位国企产权转让格式范本及操作指南",
    date: "2026-07-03",
    source: "吉安县公共资源交易中心",
    content: "吉安县行政事业单位国企产权转让格式范本及操作指南\n\n一、总体要求：\n为规范吉安县行政事业单位及国有企业产权转让交易行为，确保交易公平、公正、公开，制定本指南。\n\n二、交易流程说明：\n1. 提出转让申请及可行性论证报告，报有关部门审批；\n2. 产权审计与资产评估，评估结果需报同级国资监管部门备案确认；\n3. 交易信息公开披露，公告期不得少于20个工作日；\n4. 意向受让方登记，核验营业执照及信誉度资质，确保受让方信誉合规。\n\n三、格式范本与合同要件说明：\n本平台提供完整的产权转让申请书范本、资产评估说明范本、以及成交确认书样张。符合入驻条件的供应商可下载。"
  },
  "关于电子卖场直购/竞价/询价的实施办法指导": {
    title: "关于电子卖场直购/竞价/询价的实施办法指导",
    date: "2026-07-03",
    source: "政府采购云服务中心",
    content: "关于电子卖场直购/竞价/询价的实施办法指导\n\n一、直购模式适用范围：\n对单项采购预算在限额以下、采购标准统一、规格明确的商品，采购人可以通过电子卖场进行直接选购，确认订单后即完成交易。\n\n二、竞价采购细则：\n采购人发布竞价公告，供应商在规定时间（通常为3个工作日）内进行线上报价。系统根据‘低价优先’原则自动判定中标候选人。\n\n三、询价采购规则：\n采购人向三家以上符合条件的供应商发出询价单，供应商在线提交一次性不可更改的报价。报价截止后，系统汇总报价并生成合同备案文件。\n\n四、店铺搭建要求：\n供应商在入库后，需在5个工作日内完成店铺主图排版、配送范围配置以及第一批合规商品的上架录入。"
  }
};

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
  
  // Selected Article for reading details
  const [selectedArticle, setSelectedArticle] = useState<ReadableArticleDetails | null>(null);
  
  // Geolocation statistics
  const [stats, setStats] = useState({
    suppliers: 3177,
    buyers: 10329,
    items: 39619
  });

  const handleArticleClick = (title: string, defaultId?: string, category?: string) => {
    // 如果是新闻通知类目，自动创建可读文章
    if (category === "ddlist") {
      setSelectedArticle({
        title: title,
        date: new Date().toLocaleDateString('zh-CN'),
        source: "政采通",
        content: `
          <div class="article-body space-y-4">
            <h3 class="text-lg font-bold text-slate-800 mb-3">${title}</h3>
            <p class="text-gray-700 leading-relaxed">本文为政府政策文件或新闻通知，主要内容包括相关政策规定、实施细则及通知事项。</p>
            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p class="text-sm text-blue-800">
                <strong>重要提示：</strong>完整文件内容请访问相关政府官方网站查看，或联系客服获取详细资料。
              </p>
            </div>
            <h4 class="text-base font-semibold text-slate-800 mt-4 mb-2">主要内容</h4>
            <ul class="list-disc list-inside space-y-2 text-gray-700">
              <li>文件依据国家相关法律法规制定</li>
              <li>明确了具体的实施时间和范围</li>
              <li>规定了相关单位和人员的职责</li>
              <li>提供了配套的操作指南和流程</li>
            </ul>
            <h4 class="text-base font-semibold text-slate-800 mt-4 mb-2">适用范围</h4>
            <p class="text-gray-700 leading-relaxed">本政策适用于政府采购活动中的所有参与方，包括采购单位、供应商、代理机构等。</p>
            <div class="mt-6 p-4 bg-gray-100 rounded">
              <p class="text-xs text-gray-600">
                如需查看完整文件或办理相关业务，请联系政采通客服：<span class="font-semibold text-blue-600">400-999-8839</span>
              </p>
            </div>
          </div>
        `
      });
      return;
    }

    // 1. Check client-side static readableArticles map
    const staticKey = Object.keys(readableArticles).find(
      k => readableArticles[k].title === title || k === defaultId || title.includes(k) || (defaultId && k.includes(defaultId))
    );
    if (staticKey) {
      setSelectedArticle(readableArticles[staticKey]);
      return;
    }

    // 2. Check local storage dynamic articles map
    if (typeof window !== "undefined") {
      const savedArticles = localStorage.getItem("zcy_readable_articles");
      if (savedArticles) {
        const articlesMap = JSON.parse(savedArticles);
        const dynamicKey = Object.keys(articlesMap).find(
          k => articlesMap[k].title === title || k === defaultId || title.includes(k) || (defaultId && k.includes(defaultId))
        );
        if (dynamicKey) {
          setSelectedArticle(articlesMap[dynamicKey]);
          return;
        }
      }
    }

    // 3. Fallback
    triggerRegistration();
  };

  // Header and Search States
  const [showProgressQuery, setShowProgressQuery] = useState(false);
  const [queryPhone, setQueryPhone] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  // Navigation hover indexes
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);

  // Main News Tabs State
  const [activeNewsTab, setActiveNewsTab] = useState<"cggglist" | "xjlist" | "jjlist" | "ddlist">("cggglist");
  const [cggglist, setCggglist] = useState<NewsItem[]>(defaultCggglist);
  const [xjlist, setXjlist] = useState<NewsItem[]>(defaultXjlist);
  const [jjlist, setJjlist] = useState<NewsItem[]>(defaultJjlist);
  const [ddlist, setDdlist] = useState<NewsItem[]>(defaultDdlist);
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
  const [newNewsTab, setNewNewsTab] = useState<"cggglist" | "xjlist" | "jjlist" | "ddlist">("cggglist");
  
  const [showFloatWindow, setShowFloatWindow] = useState(true);
  const floatRef = useRef<HTMLDivElement>(null);
  const [floatPos, setFloatPos] = useState({ x: 20, y: 180 });
  const floatDir = useRef({ dx: 1.5, dy: 1.5 });
  const animationFrameId = useRef<number | null>(null);
  const isHovered = useRef(false);

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
    const savedPhone = localStorage.getItem("zcy_400_phone");
    if (savedPhone) {
      setPhone400(savedPhone);
    }

    const savedCggg = localStorage.getItem("zcy_news_cggg");
    const savedXj = localStorage.getItem("zcy_news_xj");
    const savedJj = localStorage.getItem("zcy_news_jj");
    const savedDd = localStorage.getItem("zcy_news_dd");
    const savedZtbsj = localStorage.getItem("zcy_news_ztbsj");
    const savedZqcg = localStorage.getItem("zcy_news_zqcg");

    if (savedCggg) setCggglist(JSON.parse(savedCggg));
    if (savedXj) setXjlist(JSON.parse(savedXj));
    if (savedJj) setJjlist(JSON.parse(savedJj));
    if (savedDd) setDdlist(JSON.parse(savedDd));
    if (savedZtbsj) setZtbsjList(JSON.parse(savedZtbsj));
    if (savedZqcg) setZqcgList(JSON.parse(savedZqcg));
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

  // Statistics calculation helper
  const updateStats = (prov: string) => {
    const seed = prov.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const suppliers = 2000 + (seed % 1500);
    const buyers = 5000 + (seed % 6000);
    const items = 15000 + (seed % 30000);
    setStats({ suppliers, buyers, items });
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const prov = e.target.value;
    setDetectedProvince(prov);
    updateStats(prov);
  };

  // Inline Form SMS code sender
  const handleSendInlineSms = () => {
    if (!/^1[3-9]\d{9}$/.test(inlineMobile)) {
      alert("请输入正确的11位手机号码");
      return;
    }
    setIsSendingInlineSms(true);
    setInlineTimer(60);
    setTimeout(() => {
      setIsSendingInlineSms(false);
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setInlineMockCode(code);
      alert(`【政采通】您的验证码是：${code}，请在页面中输入进行验证。`);
    }, 800);
  };

  // Inline Form Submit
  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineOrgName.trim()) return alert("请输入您的公司名称");
    if (!inlineContactName.trim()) return alert("请输入您的姓名");
    if (!/^1[3-9]\d{9}$/.test(inlineMobile)) return alert("请输入正确的11位手机号码");
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

    alert("资料登记成功！已为您开启第二步：资质资料提交！");
    
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
    
    alert("系统暂未查询到该手机号的申报记录，已为您自动进入首次申请通道！");
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
    alert("新闻通知已发布！列表已成功更新。");
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
              <span className="text-gray-400">📍 定位:</span>
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
                🔑 登录/查询
              </button>
            </div>
          </div>
          
          <div className="hidden md:flex md:items-center gap-4 text-gray-500">
            <div className="text-gray-400 mr-2">
              您好，欢迎来到政采信息服务平台 | 数据监测中心已载入: <span className="font-semibold text-gray-600">供应商 {stats.suppliers} 家</span> | <span className="font-semibold text-gray-600">采购单位 {stats.buyers} 家</span>
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
                <a href="/rules/sla" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">服务SLA交付标准</a>
                <a href="/rules/invoice" target="_blank" className="block px-4 py-2 hover:bg-gray-100 hover:text-[#3991F6]">发票开具与退款说明</a>
              </div>
            </div>
            
            <span className="text-gray-300">|</span>
            <button onClick={() => setShowProgressQuery(true)} className="hover:text-[#3991F6] font-bold flex_align_center gap-1 transition-colors">
              🔑 登录 / 进度查询
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
              <span className="ml10 mr5 text-gray-400">🔍</span>
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
                <span>🔥 热搜:</span>
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
              🔑 登录 / 进度查询
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
              {[
                { id: "cggglist", label: "政采头条" },
                { id: "xjlist", label: "供应商动态" },
                { id: "jjlist", label: "政策法规" },
                { id: "ddlist", label: "新闻通知" }
              ].map(tab => (
                <div 
                  key={tab.id}
                  onClick={() => setActiveNewsTab(tab.id as any)}
                  className={`semzxy4_c1_right_top_item ${
                    activeNewsTab === tab.id 
                      ? "fc-fff bg-3991F6" 
                      : "fc-333 hover:bg-[#d0e5ff] hover:text-[#3991F6]"
                  }`}
                >
                  {tab.label}
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
                          <a 
                            onClick={(e) => {
                              e.preventDefault();
                              handleArticleClick(news.title, news.id, activeNewsTab);
                            }} 
                            href="javascript:void(0);"
                            title={news.title}
                            className="text-[#333333] hover:text-[#3991F6] transition-colors"
                          >
                            {news.title}
                          </a>
                        </div>
                        {news.newBadge && (
                          <span className="semzxy4_c1_list_item_new_blue text-[9px]">new</span>
                        )}
                      </div>
                      {activeNewsTab !== "ddlist" && (
                        <div className="text-gray-400 text-xs shrink-0 pl-2">
                          {news.date}
                        </div>
                      )}
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
              { num: "01", title: "供应商入驻", desc: "提交基础资料，核验系统" },
              { num: "02", title: "申请协议", desc: "确定入库方案，签订托管" },
              { num: "03", title: "发布商品", desc: "规范导入精灵，产品上架" },
              { num: "04", title: "参与交易", desc: "多端报价磋商，赢取订单" },
              { num: "05", title: "常见问题", desc: "日常账单结算，系统维护" }
            ].map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="text-center group w-[180px]">
                  <div className="flex_center_center mb-2">
                    <div className="w-14 h-14 bg-white hover:bg-blue-50 border border-blue-100 rounded-full flex_center_center text-2xl shadow-sm transition-all duration-300 transform group-hover:scale-110">
                      {idx === 0 && "🏢"}
                      {idx === 1 && "📜"}
                      {idx === 2 && "📦"}
                      {idx === 3 && "🤝"}
                      {idx === 4 && "❓"}
                    </div>
                  </div>
                  <div className="f16 fw600 fc-333 hover:text-[#3991F6] transition-colors">
                    {step.num}. {step.title}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{step.desc}</div>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:block">
                    <span className="text-[#3991F6] text-xl font-bold animate-pulse">➔</span>
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
            <span className="text-3xl mb-1">🏁</span>
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

      {/* Main Bidding Announcement Directory Layout (招标政采信息公告) */}
      <div className="mt20 w1200 mb20">
        <div className="flex_center_center mt-8 mb-4">
          <div className="semzxy4_pt_title_line hidden md:block"></div>
          <div className="text-lg md:text-2xl font-bold text-slate-800 ml20 mr20">
            招标政采及直采项目信息公告
          </div>
          <div className="semzxy4_pt_title_line hidden md:block"></div>
        </div>

        <div className="flex_jspace gap-6 w-full items-start">
          
          {/* Left query systems list (16 links) - Collapsible on mobile */}
          <div className="info-open-el w-full md:w-[280px] shrink-0 select-none bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
            <div className="text-slate-800 font-bold f15 mb-3 border-b border-gray-100 pb-2">
              🔗 招采资质与核验查询系统
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { title: "政府采购网登录系统", icon: "🌐" },
                { title: "中国物品编码中心", icon: "🔢" },
                { title: "公共资源交易中心登录", icon: "🏛️" },
                { title: "信用中国查询系统", icon: "🛡️", link: "https://www.creditchina.gov.cn/" },
                { title: "国家信用公示查询系统", icon: "👁️", link: "https://www.gsxt.gov.cn/index.html" },
                { title: "商标查询系统", icon: "™️", link: "https://sbj.cnipa.gov.cn/sbj/index.html" },
                { title: "ISO认证体系查询系统", icon: "📜", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "质检报告登录查询系统", icon: "🔬", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "裁判文书网查询", icon: "⚖️", link: "https://wenshu.court.gov.cn/" },
                { title: "节能产品查询系统", icon: "🍃", link: "http://cx.cnca.cn/CertECloud/index/index/page" },
                { title: "电子卖场查询登录系统", icon: "🛒" },
                { title: "国铁商城登录系统", icon: "🚆" },
                { title: "京东查询登录系统", icon: "🛍️" },
                { title: "国家电网查询登录系统", icon: "⚡" },
                { title: "赫兹平台查询登录系统", icon: "📈" },
                { title: "军队采购查询登录系统", icon: "🎖️" }
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
                {showAllQueryLinks ? "收起部分系统 ▴" : "展开全部查询系统 ▾"}
              </button>
            )}
          </div>

          {/* Right Cards List (8 Cards) - Collapsible on mobile */}
          <div className="info-open-er flex-1 flex flex-col gap-6">
            {(isMobile && !showAllCards ? openCards.slice(0, 3) : openCards).map((card, cidx) => (
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
                      📁 {card.title}
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
                      let baseItems = [
                        { title: "吉安县行政事业单位国企产权转让格式范本及操作指南", desc: "已适配全国采购目录规范，各省供应商可快速申领入驻方案。", date: "2026-07-03" },
                        { title: "行政事业单位政府采购格式范本说明", desc: "规范政府采购合规要点，降低资质退单率与审核驳回率。", date: "2026-07-03" },
                        { title: "关于电子卖场直购/竞价/询价的实施办法指导", desc: "电子通道规则梳理，协助企业搭建专属的线上产品卖场页面。", date: "2026-07-03" },
                        { title: "关于集中采购类目数字安全协议及CA锁申领指引", desc: "安全加密与电子签章要件汇总，是线上进行商务应标的必要工具。", date: "2026-07-03" }
                      ];

                      let dynamicItems: NewsItem[] = [];
                      if (card.id === "infoopenlist1zb") dynamicItems = ztbsjList;
                      if (card.id === "infoopenlist2zb") dynamicItems = zqcgList;

                      const mergedItems = [
                        ...dynamicItems.map(di => ({ title: di.title, desc: "", date: di.date, newBadge: di.newBadge, id: di.id })),
                        ...baseItems
                      ].slice(0, 4);

                      return mergedItems.map((item, iidx) => (
                        <a 
                          key={(item as any).id || iidx}
                          className="card-body-ip-item flex items-start py-1.5 px-2 rounded hover:bg-gray-50/70 transition-all text-xs sm:text-sm group" 
                          onClick={() => handleArticleClick(item.title, (item as any).id)}
                          href="javascript:void(0);"
                        >
                          <div className="dot w-1.5 h-1.5 bg-gray-400 group-hover:bg-blue-500 rounded-full mt-2 mr-3 shrink-0"></div>
                          <div className="title flex-1 flex items-start gap-1 select-none">
                            <div className="flex-1 text-slate-700 group-hover:text-[#3991F6] transition-colors leading-snug">
                              <strong>[{card.title}]</strong> {item.title} 
                              {item.desc && <span className="text-[10px] text-gray-400 font-normal block mt-0.5">{item.desc}</span>}
                            </div>
                            {(item as any).newBadge !== false && <span className="info-open-tag text-[8px] sm:text-[9px] shrink-0 text-blue-500 select-none bg-blue-50 px-1 py-0.5 rounded ml-2">[NEW]</span>}
                          </div>
                          <div className="time text-[10px] sm:text-xs text-gray-400 group-hover:text-gray-600 shrink-0 ml-4 pt-0.5">
                            {item.date}
                          </div>
                        </a>
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
                📂 加载更多项目公告及政策 ▾
              </button>
            )}
            {isMobile && showAllCards && (
              <button
                onClick={() => setShowAllCards(false)}
                className="w-full py-3 bg-white border border-gray-200 hover:bg-slate-50 text-[#3991F6] font-bold rounded-xl text-xs transition-colors shadow-sm text-center flex_center_center gap-1"
              >
                收起项目公告 ▴
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
            <h3 className="text-xl font-bold text-slate-800 mb-4">招采云服政采服务云平台简介</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              招采云服政采服务云平台由招采云服（北京）科技发展有限公司负责运营和维护管理，平台专注于“互联网+政府采购”的数字化服务，提供基于政采、企采、央采平台的电子采购信息，通过信息化平台手段推进集中采购流程、促进供采对接，为各类平台政采、企采、央采的集采类目产品和参与供应商企业提供一站式电子化平台对接服务。
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              运营管理团队具有丰富的招投标业务开展能力和政府采购业务参与经验，熟练掌握招投标技巧，精通电子卖场规则，精通标书编写，供应商入驻，商品上架、店铺运营。对集中采购领域的业务模式有深刻理解，对采购业主的招标、直购、竞价、询价、反向竞价、项目采购、在线投标等采购活动提供提供高效专业的供应商响应。团队以助力全国供应商赢得更多采购订单为宗旨，为全国供应商企业提供一站式招投标和集中采购的全流程服务。
            </p>
          </div>
          <div className="bg-slate-50 border border-gray-200 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-800">服务咨询核心细节</h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <strong>进度记录：</strong>在页内表单或弹出框第一步提交后，系统将自动缓存数据。您可以通过手机号随时找回并继续进行第二、三步的资料提交和业务办理。
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <strong>渠道范围：</strong>服务覆盖全国各个省份的电子卖场资质搭建工作，针对不同区域 of 政策要求提供定制化的审核资料预检。
                </div>
              </div>
              <div className="flex gap-2">
                <span className="text-blue-600 font-bold">✓</span>
                <div>
                  <strong>售后保障：</strong>专业的标书及产品技术团队，严格执行合同通用标准，并在款项清算后开具增值税专用/普通发票。
                </div>
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
            <span className="text-xl block">📞</span>
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
                输入您在Step 1中填写的联系电话，系统将读取您的申报进度并协助您继续完成资料提交与业务办理。
              </p>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">注册手机号</label>
                <input 
                  type="tel"
                  required
                  placeholder="请输入11位手机号码"
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
              📰 后台管理 (发布新闻/会员管理)
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
                      onChange={e => setNewNewsTab(e.target.value as any)}
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
                      发布新闻 (自动标记NEW)
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
            Copyright © 2026 政采通・政采服务云平台. All Rights Reserved. 招采云服（北京）科技发展有限公司 版权所有
          </p>
          <p className="text-[10px] text-gray-500">
            公司介绍：招采云服（北京）科技发展有限公司 | 联系我们：北京市通州区漷县镇漷兴北大街86号 | 客服电话：{phone400}
          </p>
          <p className="text-[10px] text-rose-500 bg-rose-500/5 max-w-3xl mx-auto p-2.5 rounded-lg leading-relaxed">
            免责声明：本网站是综合政府采购信息的展示和服务性平台，所有展示的政策及招标采购信息来源于原公开发布机构。平台负责协助企业完成入驻资料整理、系统代填报等技术咨询服务，相关商业交易与入驻最终审核权限仍属原招采平台所有。
          </p>
        </div>
      </footer>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="modal-overlay">
          <div className="modal-container max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden text-slate-800">
            {/* Header */}
            <div className="bg-[#3991F6] px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-base truncate flex-1 pr-4">📄 公告及政策详情</h3>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="text-white hover:text-blue-100 text-2xl font-bold transition-all shrink-0 focus:outline-none"
              >
                ×
              </button>
            </div>
            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[480px] space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b border-gray-100 pb-3 leading-snug">
                {selectedArticle.title}
              </h2>
              <div className="flex gap-4 text-xs text-gray-400 font-medium">
                <span>发布机构/来源：{selectedArticle.source}</span>
                <span>•</span>
                <span>发布日期：{selectedArticle.date}</span>
              </div>
              <div 
                className="text-sm text-slate-600 leading-relaxed font-sans pt-2 bg-gray-50/50 p-4 rounded border border-gray-100"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-100">
              <span className="text-xs text-gray-500 font-medium">需要代办入驻或CA办理？请点击右侧通道：</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setSelectedArticle(null);
                    triggerRegistration();
                  }}
                  className="px-5 py-2 bg-[#3991F6] hover:bg-[#1871D7] text-white rounded text-xs font-bold transition-colors shadow-sm"
                >
                  立即进行业务办理登记
                </button>
              </div>
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
