export type ArticleCategory = "cggglist" | "xjlist" | "jjlist" | "ddlist";

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  newBadge?: boolean;
}

export interface ArticleDetails extends NewsItem {
  category: ArticleCategory;
  categoryLabel: string;
  source: string;
  views: number;
  content: string;
}

export const categoryLabels: Record<ArticleCategory, string> = {
  cggglist: "政采头条",
  xjlist: "供应商动态",
  jjlist: "政策法规",
  ddlist: "新闻通知",
};

const contractContent = (
  contractNo: string,
  buyer: string,
  supplier: string,
  amount: string,
  scope: string
) => `一、合同编号：${contractNo}
二、合同名称：${scope}政府采购合同
三、项目编号：${contractNo.replace("HT", "CG")}
四、项目名称：${scope}
五、合同主体
采购人（甲方）：${buyer}
地址：采购人指定办公地点
联系方式：以采购文件载明信息为准
供应商（乙方）：${supplier}
地址：供应商注册地址
联系方式：以投标文件载明信息为准

六、合同主要信息
主要标的名称：${scope}
规格型号及服务要求：供应商应按照采购文件、响应文件及合同约定完成供货、安装、调试、培训、售后维护等工作，确保项目按期交付并通过验收。
合同金额：${amount}
履约期限：自合同签订之日起至项目验收合格并完成售后服务承诺止。
采购方式：竞争性磋商

七、合同签订日期
2026年07月03日

八、合同公告日期
2026年07月03日

九、其他补充事宜
本公告内容以采购人与成交供应商最终签署的合同文本为准。`;

const bidContent = (
  projectNo: string,
  buyer: string,
  agency: string,
  budget: string,
  demand: string
) => `项目概况
${demand}采购项目的潜在供应商应按公告要求获取采购文件，并于规定时间前提交响应文件。

一、项目基本情况
项目编号：${projectNo}
项目名称：${demand}
采购方式：公开招标
预算金额：${budget}
采购需求：本项目包括方案深化、设备或服务交付、安装调试、人员培训、质量验收及后续维护等内容，具体要求详见采购文件。

二、申请人的资格要求
1. 满足《中华人民共和国政府采购法》第二十二条规定；
2. 落实政府采购政策需满足的资格要求；
3. 本项目的特定资格要求以采购文件为准；
4. 参加采购活动前三年内，在经营活动中没有重大违法记录。

三、获取采购文件
时间：2026年07月03日至2026年07月10日，每日09:00至17:00。
方式：线上获取，供应商按平台提示完成登记后下载采购文件。

四、提交响应文件截止时间、开标时间和地点
截止时间：2026年07月24日09:30。
地点：采购人或代理机构指定开标地点。

五、公告期限
自本公告发布之日起5个工作日。

六、凡对本次采购提出询问，请按以下方式联系
采购人：${buyer}
采购代理机构：${agency}`;

const policyContent = (summary: string, points: string[]) => `${summary}

一、总体要求
坚持公开、公平、公正和诚实信用原则，进一步规范政府采购活动，提高采购效率，维护采购人、供应商和社会公众的合法权益。

二、重点内容
${points.map((point, index) => `${index + 1}. ${point}`).join("\n")}

三、执行要求
各采购单位应结合项目实际完善内控制度，规范采购需求编制、采购文件确认、评审组织、合同签订、履约验收和档案管理等环节。

四、监督管理
财政部门将依法加强采购活动监督检查，对违法违规行为及时纠正并按规定处理。`;

const noticeContent = (summary: string, items: string[]) => `${summary}

一、通知事项
${items.map((item, index) => `${index + 1}. ${item}`).join("\n")}

二、办理要求
相关采购人、代理机构和供应商应按照平台提示完成信息维护、材料提交和结果确认，确保业务办理真实、准确、完整。

三、咨询方式
如需了解具体操作流程，请通过平台客服或业务咨询电话联系工作人员。`;

export const articles: ArticleDetails[] = [
  {
    id: "3338",
    title: "定西市安定区教育局福台高级中学校舍维修改造建设施工合同政府采购合同公告",
    date: "2026-07-03",
    newBadge: true,
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "甘肃政府采购网",
    views: 1061,
    content: contractContent("GF-2017-0201", "定西市安定区教育局", "甘肃陆正建筑有限公司", "1,885,447.47元", "安定区福台高级中学校舍维修改造建设施工"),
  },
  {
    id: "3348",
    title: "哈尔滨师范大学阶梯教室配套装饰装修工程成交结果公告",
    date: "2026-07-03",
    newBadge: true,
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江政府采购网",
    views: 875,
    content: contractContent("HT-2026-0703-01", "哈尔滨师范大学", "黑龙江建工集团有限责任公司", "1,850,000.00元", "阶梯教室配套装饰装修工程"),
  },
  {
    id: "3346",
    title: "哈尔滨医科大学附属肿瘤医院零星维修服务竞争性磋商公告",
    date: "2026-07-03",
    newBadge: true,
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江省公共资源交易中心",
    views: 784,
    content: bidContent("HMUZL-2026-FW-0703", "哈尔滨医科大学附属肿瘤医院", "黑龙江政采咨询有限公司", "900,000.00元", "医院院区零星维修服务"),
  },
  {
    id: "3345",
    title: "哈尔滨理工大学超长期国债项目实验室管理平台采购合同公告",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江政府采购网",
    views: 692,
    content: contractContent("HTLG-2026-GLPT-02", "哈尔滨理工大学", "哈尔滨智联科技有限公司", "2,360,000.00元", "实验室管理平台及配套服务"),
  },
  {
    id: "3344",
    title: "哈尔滨理工大学学位证书等印刷服务政府采购合同公告",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江政府采购网",
    views: 641,
    content: contractContent("HTLG-2026-YS-0703", "哈尔滨理工大学", "哈尔滨文印服务有限公司", "286,000.00元", "学位证书及毕业材料印刷服务"),
  },
  {
    id: "3343",
    title: "哈尔滨理工大学2026年度政府采购意向公告（第19批）",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "哈尔滨理工大学",
    views: 532,
    content: noticeContent("为便于供应商及时了解政府采购信息，现将哈尔滨理工大学2026年度第19批采购意向公开。", ["采购内容主要包括教学实验设备、校园信息化系统及配套服务。", "预计采购时间为2026年第三季度。", "本次公开的采购意向是初步安排，具体采购项目以正式采购公告为准。"]),
  },
  {
    id: "3342",
    title: "哈尔滨理工大学2026年度政府采购意向公告（第17批）",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "哈尔滨理工大学",
    views: 517,
    content: noticeContent("哈尔滨理工大学拟对一批科研实验条件改善项目进行采购，现公开采购意向。", ["采购方向包括实验室环境改造、科研仪器维护和数据采集设备更新。", "项目预算、技术参数和实施周期以采购文件为准。", "欢迎符合条件的供应商持续关注后续公告。"]),
  },
  {
    id: "3341",
    title: "哈尔滨理工大学2026年度政府采购意向公告（第18批）",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "哈尔滨理工大学",
    views: 504,
    content: noticeContent("根据学校年度采购计划，哈尔滨理工大学发布第18批政府采购意向。", ["拟采购项目涉及智慧教室设备、教学资源平台和运维服务。", "供应商可提前做好资质、案例和技术方案准备。", "最终采购信息以财政部门指定媒体发布的公告为准。"]),
  },
  {
    id: "3340",
    title: "鸡西市中级人民法院零星维修（一）政府采购合同公告",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江政府采购网",
    views: 493,
    content: contractContent("JXFY-2026-WX-01", "鸡西市中级人民法院", "鸡西市恒泰建筑维修有限公司", "486,500.00元", "办公用房零星维修工程"),
  },
  {
    id: "3339",
    title: "哈尔滨医科大学2026年后勤改造项目一标段政府采购合同公告",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: categoryLabels.cggglist,
    source: "黑龙江政府采购网",
    views: 488,
    content: contractContent("HYD-2026-HQ-01", "哈尔滨医科大学", "黑龙江华筑建设有限公司", "1,268,000.00元", "后勤区域维修改造一标段"),
  },

  {
    id: "3357",
    title: "台湖镇第四次全国农业普查专业化普查服务项目政府采购合同公告",
    date: "2026-07-03",
    newBadge: true,
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市通州区台湖镇人民政府",
    views: 923,
    content: contractContent("TH-2026-AP04", "北京市通州区台湖镇人民政府", "北京招采信息科技有限公司", "860,000.00元", "第四次全国农业普查专业化普查服务"),
  },
  {
    id: "3356",
    title: "北京市海淀区曙光街道办事处2026年政府采购意向公告",
    date: "2026-07-03",
    newBadge: true,
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市海淀区人民政府",
    views: 801,
    content: noticeContent("为便于供应商了解采购安排，现公开曙光街道办事处2026年采购意向。", ["拟采购物业管理、信息化运维、社区文化活动等服务。", "采购预算和服务周期以正式公告和采购文件为准。", "供应商应关注平台后续公告并按要求参加采购活动。"]),
  },
  {
    id: "3355",
    title: "平谷区滨河街道老旧小区综合治理项目造价咨询服务采购合同公告",
    date: "2026-07-03",
    newBadge: true,
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市平谷区财政局",
    views: 746,
    content: contractContent("PG-BH-2026-ZX", "北京市平谷区滨河街道办事处", "北京中衡造价咨询有限公司", "318,000.00元", "老旧小区综合治理造价咨询服务"),
  },
  {
    id: "3354",
    title: "门头沟区住建委2026年政府采购意向公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市门头沟区住房和城乡建设委员会",
    views: 705,
    content: noticeContent("门头沟区住建委根据年度工作安排，公开2026年采购意向。", ["采购内容包括房屋安全巡查、工程质量辅助检查和信息化服务。", "采购项目将依法依规组织，具体要求以采购文件为准。", "本意向公告不构成采购邀约。"]),
  },
  {
    id: "3353",
    title: "北京市第十三中学分校保洁服务采购合同公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市西城区教育委员会",
    views: 681,
    content: contractContent("XCJY-2026-BJ13", "北京市第十三中学分校", "北京洁诚物业服务有限公司", "760,000.00元", "校园保洁及环境维护服务"),
  },
  {
    id: "3352",
    title: "东城区和平里街道办事处2026年政府采购意向公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市东城区人民政府",
    views: 655,
    content: noticeContent("和平里街道办事处发布2026年度采购意向，方便供应商提前准备。", ["拟采购城市精细化管理、社区活动保障和公共设施维护服务。", "项目采购时间预计为2026年第三季度。", "后续采购公告将在指定平台公开发布。"]),
  },
  {
    id: "3351",
    title: "北京市第十三中学分校教学设备采购项目政府采购合同公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市政府采购网",
    views: 624,
    content: contractContent("BJ13ZX-2026-SB", "北京市第十三中学分校", "北京博学教育装备有限公司", "1,120,000.00元", "新址教育教学设备采购"),
  },
  {
    id: "3350",
    title: "首都医科大学一流学科建设设备更新项目政府采购合同公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市教育委员会",
    views: 603,
    content: contractContent("SDYK-2026-YLXK", "首都医科大学", "北京科仪技术有限公司", "3,780,000.00元", "一流学科建设与创新人才培养设备更新"),
  },
  {
    id: "3349",
    title: "北京工业大学饮食服务中心食品原材料采购中标公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市政府采购网",
    views: 598,
    content: contractContent("BGD-2026-SPYL", "北京工业大学", "北京绿源食品配送有限公司", "按实际配送结算", "饮食服务中心食品原材料采购"),
  },
  {
    id: "3347",
    title: "通州校区学生公寓物业服务项目中标公告",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: categoryLabels.xjlist,
    source: "北京市政府采购网",
    views: 572,
    content: contractContent("TZXX-2026-WY", "通州校区管理中心", "北京安寓物业管理有限公司", "2,450,000.00元", "学生公寓物业服务"),
  },

  {
    id: "3313",
    title: "2026年度业务技术装备购置防护装备项目中标公告",
    date: "2026-07-03",
    newBadge: true,
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市公安局",
    views: 933,
    content: contractContent("GAJ-2026-FHZB", "北京市公安局", "北京安盾装备有限公司", "4,260,000.00元", "业务技术防护装备购置"),
  },
  {
    id: "3311",
    title: "北京警察学院卫生医疗保障管理服务项目废标公告",
    date: "2026-07-03",
    newBadge: true,
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京警察学院",
    views: 812,
    content: noticeContent("北京警察学院卫生医疗保障管理服务项目因有效供应商不足法定数量，本项目作废标处理。", ["采购人将依法重新组织采购活动。", "已递交响应文件的供应商可按代理机构通知办理相关手续。", "后续采购信息请关注指定媒体公告。"]),
  },
  {
    id: "3309",
    title: "污染源排放清单编制技术支持项目中标公告",
    date: "2026-07-03",
    newBadge: true,
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市生态环境局",
    views: 780,
    content: contractContent("STHJ-2026-PFQD", "北京市生态环境局", "北京环科技术服务有限公司", "1,980,000.00元", "污染源排放清单编制技术支持"),
  },
  {
    id: "3307",
    title: "北京市市级行政事业单位会议服务框架协议采购入围结果公告",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市财政局",
    views: 752,
    content: policyContent("北京市市级行政事业单位会议服务框架协议采购完成评审，现将入围结果予以公告。", ["入围供应商应按照框架协议约定提供标准化会议服务。", "采购人应通过框架协议电子系统进行下单和结算。", "供应商不得擅自提高价格或降低服务标准。"]),
  },
  {
    id: "3306",
    title: "产品质量抽检委托检验服务项目单一来源采购征求意见公示",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市市场监督管理局",
    views: 710,
    content: policyContent("根据采购项目专业性和唯一性情况，现对产品质量抽检委托检验服务项目单一来源采购进行公示。", ["公示期内，相关供应商可就采购方式提出书面意见。", "采购人应完整说明单一来源采购理由和专家论证意见。", "财政部门将依法对采购活动进行监督。"]),
  },
  {
    id: "3305",
    title: "信息化能力提升项目政府采购合同公告",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市地方志办公室",
    views: 699,
    content: contractContent("DFZ-2026-XXH", "北京市地方志办公室", "北京数政科技有限公司", "2,080,000.00元", "应用系统适配改造及总体集成"),
  },
  {
    id: "3303",
    title: "餐饮服务项目成交公告",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市公共资源交易服务平台",
    views: 665,
    content: contractContent("CYFW-2026-CJ", "采购单位", "北京惠民餐饮管理有限公司", "按实际服务量结算", "机关食堂餐饮保障服务"),
  },
  {
    id: "3302",
    title: "库房租赁合同补充协议公告",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "北京市政府采购网",
    views: 618,
    content: contractContent("KFZL-2026-BC", "采购单位", "北京仓储服务有限公司", "360,000.00元", "库房租赁合同补充协议"),
  },
  {
    id: "3282",
    title: "美丽中国建设成效考核办法印发",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "生态环境部",
    views: 604,
    content: policyContent("为推进美丽中国建设，相关部门印发成效考核办法，明确考核内容和工作要求。", ["推动绿色低碳采购，优先采购节能、节水、环保产品。", "强化生态环境质量改善和污染防治攻坚成效评价。", "考核结果作为相关工作评价和政策完善的重要依据。"]),
  },
  {
    id: "3281",
    title: "国务院关于同意在上海市暂时调整实施有关行政法规规定的批复",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: categoryLabels.jjlist,
    source: "国务院办公厅",
    views: 590,
    content: policyContent("国务院同意在上海市特定范围内暂时调整实施有关行政法规规定，支持改革创新。", ["调整事项应严格限定范围和期限。", "相关部门应加强风险评估和过程监管。", "成熟经验可按程序复制推广。"]),
  },

  {
    id: "3280",
    title: "中华人民共和国行政复议法实施条例",
    date: "2026-07-03",
    newBadge: true,
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "国务院办公厅",
    views: 1188,
    content: policyContent("为规范行政复议法实施，保障行政复议机关依法履行职责，制定本条例。", ["行政复议机关应坚持合法、公正、公开、及时、便民原则。", "政府采购当事人对监督管理部门处理决定不服的，可依法申请行政复议。", "各级行政复议机关应推进线上申请、受理和审查。"]),
  },
  {
    id: "3279",
    title: "国务院2026年度立法工作计划",
    date: "2026-07-03",
    newBadge: true,
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "国务院办公厅",
    views: 1125,
    content: policyContent("国务院发布2026年度立法工作计划，明确年度法律法规项目安排。", ["拟推进政府采购法、招标投标法等重点领域制度完善。", "加强市场监管、公共服务和营商环境相关立法。", "起草部门应广泛听取市场主体和社会公众意见。"]),
  },
  {
    id: "3278",
    title: "中国共产党发展党员工作细则印发",
    date: "2026-07-03",
    newBadge: true,
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "新华社",
    views: 1019,
    content: noticeContent("有关部门印发发展党员工作细则，对工作程序、培养教育和纪律要求作出规范。", ["各级党组织应严格程序、严肃纪律。", "加强对入党积极分子的教育培养和考察。", "确保发展党员工作质量。"]),
  },
  {
    id: "3277",
    title: "行政法规制定程序条例",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "司法部",
    views: 934,
    content: policyContent("行政法规制定程序条例对立项、起草、审查、决定、公布等环节作出规定。", ["起草行政法规应开展调查研究和合法性审查。", "涉及市场主体权益的，应充分听取意见。", "法规公布后应及时做好解读和实施评估。"]),
  },
  {
    id: "3276",
    title: "关于用好乡镇履行职责事项清单的具体措施",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "民政部",
    views: 912,
    content: policyContent("为提升基层治理效能，相关部门发布用好乡镇履行职责事项清单的具体措施。", ["明确乡镇职责边界，推动权责一致。", "加强公共服务事项标准化管理。", "强化数据共享和业务协同。"]),
  },
  {
    id: "3275",
    title: "中华人民共和国矿产资源法实施条例",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "自然资源部",
    views: 888,
    content: policyContent("矿产资源法实施条例对矿产资源勘查、开采、保护和监督管理作出规定。", ["坚持节约集约利用矿产资源。", "加强矿产资源开发过程生态保护。", "依法规范矿业权取得和交易行为。"]),
  },
  {
    id: "3274",
    title: "关于推行常住地提供基本公共服务的实施意见",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "国家发展改革委",
    views: 861,
    content: policyContent("为推进基本公共服务均等化，相关部门提出在常住地提供基本公共服务的实施意见。", ["完善教育、医疗、社保等公共服务供给。", "推动公共服务资源随人流动合理配置。", "加强财政保障和绩效管理。"]),
  },
  {
    id: "3273",
    title: "教育发展“十五五”规划",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "教育部",
    views: 846,
    content: policyContent("教育发展“十五五”规划提出未来五年教育高质量发展的目标任务。", ["推进教育数字化和智慧校园建设。", "提升职业教育与产业需求匹配度。", "完善教育装备采购和使用绩效评价。"]),
  },
  {
    id: "3263",
    title: "法医硅藻自动分析设备公开招标公告",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "政府采购信息网",
    views: 829,
    content: bidContent("GZCG-2026-FY-001", "某司法鉴定中心", "政采咨询有限公司", "2,800,000.00元", "法医硅藻自动分析设备采购"),
  },
  {
    id: "3262",
    title: "海洋调查卓越人才计划公开招标公告",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: categoryLabels.ddlist,
    source: "政府采购信息网",
    views: 806,
    content: bidContent("HYKC-2026-RC-002", "某海洋研究院", "政采咨询有限公司", "1,600,000.00元", "海洋调查卓越人才培训及咨询服务"),
  },
  {
    id: "open-1001",
    title: "吉安县行政事业单位国企产权转让格式范本及操作指南",
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: "招投标商机",
    source: "公共资源交易服务中心",
    views: 728,
    content: `为规范行政事业单位和国有企业产权转让信息发布、资料编制和交易流程，现整理产权转让格式范本及操作指南，供相关单位和供应商在参与公共资源交易时参考使用。

一、适用范围
本指南适用于行政事业单位、国有企业在公开挂牌、资产处置、产权转让等业务中的公告编制、材料准备、资格核验和交易确认工作。

二、资料准备要求
1. 转让方应提供权属证明、资产评估报告、内部决策文件和公开交易申请材料。
2. 意向受让方应按照公告要求提交主体资格证明、信用承诺、资金证明及其他必要文件。
3. 交易文件应明确标的名称、挂牌价格、保证金金额、报名时间、竞价方式和成交确认程序。

三、操作流程
相关单位应先完成项目登记，再进行公告发布、报名审核、保证金缴纳、竞价组织和成交结果公示。供应商应在规定时间内完成平台注册、资料上传和报名确认。

四、注意事项
产权转让交易应坚持公开、公平、公正原则。涉及资产权属、债权债务、人员安置、税费承担等事项的，应在交易文件中充分披露，避免后续争议。`,
  },
  {
    id: "open-1002",
    title: "行政事业单位政府采购格式范本说明",
    date: "2026-07-03",
    category: "jjlist",
    categoryLabel: "政策法规",
    source: "政采通服务平台",
    views: 693,
    content: `为提升政府采购文件编制质量，降低因格式不统一、条款缺失、资料不完整导致的退回和更正风险，现对行政事业单位常用政府采购格式范本作出说明。

一、采购公告范本
采购公告应包含项目名称、项目编号、采购方式、预算金额、采购需求、供应商资格条件、获取采购文件方式、响应文件提交截止时间及联系方式。

二、采购文件范本
采购文件应完整列明商务要求、技术参数、评分办法、合同条款、响应文件格式和无效响应情形。技术参数不得设置排他性、倾向性条件。

三、合同范本
合同应明确标的名称、数量、单价、总价、交付期限、验收标准、付款方式、违约责任和争议解决方式。涉及售后服务的，应列明服务期限和响应要求。

四、归档要求
采购人、代理机构和供应商应妥善保存公告、文件、评审记录、成交通知书、合同和验收资料，确保采购活动全过程可追溯。`,
  },
  {
    id: "open-1003",
    title: "关于电子卖场直购、竞价、询价的实施办法指导",
    date: "2026-07-03",
    category: "xjlist",
    categoryLabel: "供应商动态",
    source: "政企采购电子卖场",
    views: 665,
    content: `为规范电子卖场直购、竞价、询价等交易方式，帮助采购人和供应商准确理解线上交易规则，现就相关实施办法整理如下。

一、直购方式
直购适用于标准明确、价格透明、供应充足的通用货物和服务。采购人应根据预算、品牌、规格、售后等因素择优选择，不得拆分项目规避采购程序。

二、竞价方式
竞价适用于同类商品或服务可进行价格比较的采购场景。供应商应在规定时间内提交报价，报价应包含税费、运输、安装、调试和售后服务等全部费用。

三、询价方式
询价适用于采购需求明确、市场价格波动较小的项目。采购人应向符合条件的供应商发出询价邀请，并按照报价、响应程度和服务承诺确定成交供应商。

四、供应商准备
供应商应及时维护店铺信息、商品参数、服务承诺、发票信息和联系人资料，确保线上交易、合同确认和履约验收顺利进行。`,
  },
  {
    id: "open-1004",
    title: "关于集中采购类目数字安全协议及 CA 锁申领指引",
    date: "2026-07-03",
    category: "ddlist",
    categoryLabel: "新闻通知",
    source: "政采通服务平台",
    views: 642,
    content: `为保障集中采购项目线上报名、电子签章、响应文件加密和合同确认等环节安全运行，现发布数字安全协议及 CA 锁申领指引。

一、数字安全协议
参与集中采购活动的单位应遵守平台身份认证、数据加密、电子签章和日志留痕要求。供应商不得转借、出租、冒用他人账号或数字证书。

二、CA 锁申领材料
供应商通常需准备营业执照、法定代表人身份证明、授权委托书、经办人身份证明、联系电话及平台要求的其他资料。材料应真实、清晰、有效。

三、办理流程
供应商可通过线上入口提交申请资料，审核通过后按提示完成证书签发、介质领取或电子证书下载。领取后应及时测试登录、签章和文件加密功能。

四、使用提醒
CA 锁属于重要身份认证工具，应由专人保管。证书到期、遗失、损坏或单位信息变更时，应及时办理延期、补办或变更手续，避免影响投标响应。`,
  },
  {
    id: "industry-3001",
    title: "法医硅藻自动分析设备的公开招标公告",
    date: "2026-07-04",
    newBadge: true,
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "政府采购信息网",
    views: 782,
    content: bidContent("FYZA-2026-SB-0704", "司法鉴定技术中心", "政采咨询有限公司", "2,800,000.00元", "法医硅藻自动分析设备"),
  },
  {
    id: "industry-3002",
    title: "海洋调查卓越人才计划的公开招标公告",
    date: "2026-07-04",
    newBadge: true,
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "政府采购信息网",
    views: 756,
    content: bidContent("HYDC-2026-RC-0704", "海洋调查研究院", "政采咨询有限公司", "1,600,000.00元", "海洋调查卓越人才计划培训及咨询服务"),
  },
  {
    id: "industry-3003",
    title: "上海市体育彩票管理中心2026年07月政采意向",
    date: "2026-07-04",
    newBadge: true,
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 731,
    content: noticeContent("为便于供应商及时了解采购信息，上海市体育彩票管理中心现公开2026年07月政府采购意向。", ["拟采购体育彩票销售终端运维、市场宣传物料制作、渠道服务和数据分析支持等项目。", "预计采购时间为2026年07月至2026年08月，具体预算、数量和技术要求以正式采购公告为准。", "供应商可提前准备相关资质、服务案例、项目团队和售后保障方案。"]),
  },
  {
    id: "industry-3004",
    title: "上海鲁迅纪念馆2026年06月政采意向",
    date: "2026-07-04",
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 704,
    content: noticeContent("上海鲁迅纪念馆根据年度工作安排，公开2026年06月政府采购意向，方便社会供应商提前了解采购需求。", ["采购内容包括展陈设备维护、文献数字化整理、公共教育活动服务及安防系统运维。", "相关项目将依法依规组织采购，具体采购方式、预算金额和服务期限以正式公告为准。", "本意向公告不构成采购邀约，供应商应持续关注后续采购文件。"]),
  },
  {
    id: "industry-3005",
    title: "上海市公安局2026年08月政采意向",
    date: "2026-07-04",
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 689,
    content: noticeContent("上海市公安局为推进年度采购计划执行，公开2026年08月政府采购意向。", ["采购方向涵盖办公设备更新、基层单位运维服务、执法辅助系统维护和信息安全保障服务。", "意向公开内容为初步安排，实际采购项目名称、预算金额和采购需求以采购公告为准。", "供应商应关注资质条件、履约能力、保密要求和服务响应时限。"]),
  },
  {
    id: "industry-3006",
    title: "上海市公安局2026年08月警用装备政采意向",
    date: "2026-07-04",
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 676,
    content: noticeContent("上海市公安局拟对一批警用装备更新项目进行政府采购，现公开2026年08月采购意向。", ["拟采购内容包括执法记录设备、通信辅助设备、现场勘查工具及配套耗材。", "供应商应确保产品符合国家和行业标准，并提供检测报告、质保承诺和售后响应方案。", "具体项目以财政部门指定媒体发布的正式采购公告和采购文件为准。"]),
  },
  {
    id: "industry-3007",
    title: "上海市公安局2026年08月信息化服务政采意向",
    date: "2026-07-04",
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 668,
    content: noticeContent("为提升信息系统稳定运行和数据安全保障能力，上海市公安局公开2026年08月信息化服务采购意向。", ["采购内容包括系统运维、数据备份、安全巡检、网络设备维护及应急响应服务。", "项目实施需满足网络安全、数据保密和运维审计要求，服务团队应具备相应经验。", "最终采购范围、服务标准和评审办法以正式采购文件为准。"]),
  },
  {
    id: "industry-3008",
    title: "上海体育科学研究所（上海市反兴奋剂中心）2026年07月政采意向",
    date: "2026-07-04",
    category: "ddlist",
    categoryLabel: "行业新闻",
    source: "上海政府采购网",
    views: 651,
    content: noticeContent("上海体育科学研究所（上海市反兴奋剂中心）结合科研检测和赛事保障工作需要，公开2026年07月政府采购意向。", ["拟采购实验室检测耗材、科研仪器维护、数据管理服务和反兴奋剂宣传培训支持。", "供应商应具备相关实验室服务、质量管理或专业技术支持经验。", "采购意向仅为供应商了解采购安排的参考，具体内容以正式采购公告为准。"]),
  },
];

const toList = (category: ArticleCategory): NewsItem[] =>
  articles
    .filter((article) => article.category === category)
    .map(({ id, title, date, newBadge }) => ({ id, title, date, newBadge }));

export const defaultCggglist = toList("cggglist");
export const defaultXjlist = toList("xjlist");
export const defaultJjlist = toList("jjlist");
export const defaultDdlist = toList("ddlist");

export const articlesById = articles.reduce<Record<string, ArticleDetails>>((map, article) => {
  map[article.id] = article;
  return map;
}, {});

export const allArticleIds = articles.map((article) => article.id);

export function getArticleById(id: string) {
  const matched = articlesById[id] ?? articles.find((article) => article.title === id);

  if (matched) {
    return matched;
  }

  const title = decodeURIComponent(id).trim();
  if (!title || title.length < 4 || title.includes("/") || title.includes("\\")) {
    return undefined;
  }

  return {
    id,
    title,
    date: "2026-07-03",
    category: "cggglist",
    categoryLabel: "政采头条",
    source: "政采通服务平台",
    views: 520,
    content: `为方便供应商及时了解采购、招投标和平台入驻相关信息，现将“${title}”整理为标准文章内容，供办理业务和准备材料时参考。

一、事项概述
本事项围绕政府采购、企事业单位采购、电子卖场交易和供应商服务流程展开，重点说明项目公告阅读、资料准备、线上报名、资格核验和后续履约等常见要求。

二、办理要点
1. 供应商应先核对营业执照、资质证书、授权文件、联系人和联系方式等基础资料。
2. 涉及电子交易的，应提前完成平台账号、CA 锁、电子签章和文件加密工具测试。
3. 参与具体项目时，应以采购公告、采购文件、澄清更正公告和成交结果公告为准。

三、风险提示
供应商应关注报名截止时间、响应文件提交时间、保证金缴纳要求、资格条件和评分办法，避免因材料缺失、格式错误或逾期提交影响项目参与。

四、服务说明
平台可提供信息整理、材料清单梳理、系统代填报指导和电子交易流程咨询服务，帮助供应商提升项目响应效率。`,
  };
}
