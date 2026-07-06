import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "付费指导 - 招采云服政采服务云平台",
  description: "招采云服政采服务云平台付费协议与服务说明",
};

const intro = [
  "本协议由客户与【招采云服政采服务云平台】平台共同签署，请客户在进行交易支付之前，务必审慎阅读，充分理解各条款内容。客户提交订单并付款，即视为已阅读并接受本协议所有条款，并对本协议条款的含义及相应的法律后果已全部知晓并充分认可，自愿接受本协议所有内容的约束。如客户不同意本协议任何内容，请停止下单付款。",
];

const sections = [
  {
    title: "一、定义",
    items: [
      "1. 招采云服政采服务云平台平台：指由招采云服（北京）科技有限公司运营的提供包含集采平台交易运营技术服务、信息查询服务、招投标流程服务、标书定制制作等业务的综合服务平台 “招采云服政采服务云平台”网站（www.zcyfgov.com）。以下简称“招采云服”或“平台”。",
      "2. 客户：指在招采云服平台付费购买技术服务、文件资料或数据增值服务的企业主体或者个人用户。",
    ],
  },
  {
    title: "二、协议效力",
    items: [
      "1. 本协议生效后，客户在平台内完成付款流程，该协议对招采云服政采服务云平台及客户均产生法律约束力。",
      "2. 客户以本协议及招采云服政采服务云平台平台其他相关规定为准，如本协议及招采云服政采服务云平台平台其他相关规定也未约定或约定不明的，双方同意依照法律规定、行业惯例进行处理。",
    ],
  },
  {
    title: "三、关于发票",
    items: [
      "1. 客户申请开具发票的，可以在订单支付完成后，联系客服为您申请开票。",
      "2. 招采云服政采服务云平台在收到客户款项后根据客户实际付款金额开具等额发票，开票信息以客户在开票管理申请登记的内容为准。",
      "3. 如由于客户原因引起的换票、退票、错票、遗失等，而导致的招采云服政采服务云平台财务损失、登报挂失、税费的产生，责任将由客户全部承担。",
    ],
  },
  {
    title: "四、客户权利和义务",
    items: [
      "1. 客户自愿在招采云服政采服务云平台平台购买相应付费服务，且客户承诺并保证客户本人在申请开通付费服务时具有完全民事行为能力。",
      "2. 客户保证其在招采云服政采服务云平台绑定的手机号码、微信账号等联系方式或账户为客户本人合法获得且真实有效，并处于客户本人有效掌控下。因绑定账户转借、转租他人使用，或因客户原因造成的资料及交易信息等泄露所产生的风险及损失，由客户自行承担，招采云服政采服务云平台平台不承担任何责任。",
      "3. 客户不得以商业化经营为目的进行转售、转租招采云服政采服务云平台会员帐户或者有偿代查，否则招采云服政采服务云平台有权关停其会员帐户并追究其法律责任。",
      "4. 严禁使用非法手段获取本产品数据。一旦发现客户存在相关行为，招采云服政采服务云平台有权对账号进行降权、拒绝服务、封禁等措施，并追究相关主体的法律责任。",
      "5. 客户承认并同意，客户在招采云服政采服务云平台平台上进行的各类交易所产生的电子信息均为该交易的有效凭证；客户可通过招采云服政采服务云平台平台-我的订单核对交易记录。客户通过招采云服政采服务云平台平台支付指令一经发出，不得撤销。客户同意，客户通过招采云服政采服务云平台平台发出的指令均视为客户真实意思的表示。客户应妥善保管支付密码、绑定手机、手机动态验证码等个人信息和设备，谨防各种形式的诈骗，并对通过上述信息完成的交易指令负责，以客户上述信息所进行的一切交易，均视为客户本人办理。如因客户原因造成上述信息或设备出现遗失、泄露或被他人盗用的情况，已发生的损失由客户自行承担，与招采云服政采服务云平台无关。",
      "6. 客户知悉并理解，因互联网产品经营需要，在客户购买相应的服务权益后，招采云服政采服务云平台有权对产品服务形式、运营方式、经营策略等进行调整。招采云服政采服务云平台平台承诺上述调整将尽可能不对客户利益造成实质性损害，具体调整以招采云服政采服务云平台平台相应服务页面更新展示为准。",
      "7. 客户知悉并理解招采云服政采服务云平台为信息聚合类产品，所以企业信息均来自互联网公开信息，无法保证信息的准确性。",
      "8. 所有服务内容及具体版本及功能权益类型，均以招采云服平台官网信息为准，不同服务内容、版本的价格和有效期限不同。客户在购买后可在个人中心查阅服务剩余有效期，有效期届满则服务自动停止，客户可以通过续费或再次购买以重新激活付费服务。招采云服政采服务云平台服务为虚拟商品，原则上不支持退款。",
      "9. 软件的所有权及版权等相关权利均归招采云服政采服务云平台所有。如因客户电脑/电脑操作系统/手机配置/版本低于本协议签订时的主流配置/版本、与其他软件不兼容，导致招采云服政采服务云平台产品难以正常使用，平台将向客户提出改进配置建议，但招采云服政采服务云平台不承担相关责任也不退还任何费用。",
      "10. 客户同意遵守国家有关法律法规、政策及招采云服政采服务云平台有关业务规章制度。因客户操作不当造成的损失，由客户自行承担，招采云服政采服务云平台不承担任何责任。客户保证其在招采云服政采服务云平台平台用于交易的资金来源合法，不存在违法违规情形。客户承诺不得利用招采云服政采服务云平台提供的服务，进行造谣滋事、违法乱纪、不正当交易及其他犯罪活动。如客户存在以上违法违规情形，招采云服政采服务云平台不承担相关责任并有权限制或终止服务。",
      "11. 客户理解并认可，招采云服政采服务云平台提供的服务不构成招采云服政采服务云平台向客户或任何第三人承担保证责任或其他任何形式的连带赔偿责任，不构成客户经营风险、道德风险的担保。客户在招采云服政采服务云平台平台的资金不能对抗有权国家机关的查封、冻结、扣划。",
      "12. 客户有任何违反本协议约定的行为，招采云服政采服务云平台有权单方面宣布终止本协议，因协议终止导致的损失，由客户承担，与招采云服政采服务云平台无关。",
      "13. 服务期内，因不可抗力因素，包含但不限于因国家政策、法律、法规、运营商政策的调整，招采云服政采服务云平台有权配合国家和运营商政策采取对客户账户禁用等措施，由此对客户造成的损失招采云服政采服务云平台不承担任何赔偿责任。",
      "14. 鉴于招采云服政采服务云平台为技术软件的特性，招采云服政采服务云平台需要定时或者不定时地根据市场需求对产品作出相关升级和修正，由此对客户使用产品造成的影响不属于违约，客户对此承诺理解并接受。",
      "15. 条款和政策的修改及关注义务：本软件新推出的产品、服务，新增加的功能均受到本协议的规范。招采云服政采服务云平台有权修改、变更本协议条款和服务政策，您有责任定期查看。如您不接受变更、修改后的协议条款和服务政策的，应立即停止使用本软件，并按照终止条款的规定卸载已下载使用的软件产品。若您接受变更后的条款或继续使用本软件，表明您接受变更后的协议约束。",
      "16. 如果您对本协议内容有任何疑问，请通过招采云服政采服务云平台网页“我的”中“联系客服”或“客服中心400咨询热线”来进行反馈。",
    ],
  },
];

export default function PaidGuidePage() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#111827]">
      <div className="border-b border-gray-200 bg-white text-xs text-[#222]">
        <div className="mx-auto flex h-9 w-full max-w-[1200px] items-center justify-between px-4">
          <div className="hidden sm:block">您好，欢迎来到政采信息服务平台</div>
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-end">
            <span className="font-semibold text-[#3991f6]">服务热线：400-999-8839</span>
            <Link href="/" className="hover:text-[#3991f6]">
              返回首页
            </Link>
          </div>
        </div>
      </div>

      <header className="bg-[linear-gradient(180deg,#eef8ff_0%,#dff0ff_100%)]">
        <div className="mx-auto flex min-h-[116px] w-full max-w-[1200px] items-center justify-between px-4 py-6">
          <Link href="/" className="flex items-center gap-4">
            <img src="/logo.png" alt="政采通" className="h-14 w-14 object-contain" />
            <div>
              <div className="text-2xl font-bold tracking-wide text-[#222] md:text-[30px]">
                招采云服政采服务云平台
              </div>
              <div className="mt-1 text-[13px] uppercase tracking-[2px] text-[#555]">
                Zheng Cai Tong Zheng Cai Fu Wu Yun Ping Tai
              </div>
            </div>
          </Link>
          <div className="hidden text-right md:block">
            <div className="text-[24px] tracking-[6px] text-[#222]">公平 / 公正 / 公开</div>
            <div className="mt-1 text-[16px] uppercase tracking-[6px] text-gray-400">Open Fair Just</div>
          </div>
        </div>
      </header>

      <nav className="bg-[#3991f6]">
        <div className="mx-auto flex h-[53px] w-full max-w-[1200px] items-center px-4 text-[15px] font-semibold text-white">
          <Link href="/" className="flex h-full items-center px-4 hover:bg-[#1871d7]">
            首页
          </Link>
          <span className="flex h-full items-center border-b-4 border-[#ffd900] px-4">付费指导</span>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <div className="mb-3 text-sm text-[#333]">
          当前位置：<Link href="/" className="hover:text-[#3991f6]">首页</Link> &gt; 付费指导
        </div>

        <section className="border border-[#d8d8d8] bg-white">
          <div className="inline-flex bg-[#3991f6] px-3 py-1.5 text-sm font-bold text-white">
            付费指导
          </div>
          <div className="px-6 pb-6 pt-2 text-center">
            <h1 className="mx-auto max-w-[960px] text-xl font-bold leading-8 text-[#111] md:text-[24px]">
              招采云服政采服务云平台付费协议
            </h1>
            <div className="mt-4 text-sm text-gray-500">请在购买付费服务前仔细阅读并充分理解以下内容</div>
          </div>
        </section>

        <article className="mt-3 border border-[#d8d8d8] bg-white px-5 py-7 md:px-8">
          <div className="min-h-[620px] text-[15px] leading-[1.9] text-[#111]">
            {intro.map((paragraph) => (
              <p key={paragraph} className="mb-6 text-justify">
                {paragraph}
              </p>
            ))}

            {sections.map((section) => (
              <section key={section.title} className="mt-7">
                <h2 className="mb-3 border-l-4 border-[#3991f6] pl-3 text-[17px] font-bold text-[#111]">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((item) => (
                    <p key={item} className="text-justify">
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>

      <footer className="mt-6 border-t border-gray-300 bg-white py-6 text-center text-xs text-gray-500">
        Copyright 2026 招采云服政采服务云平台 All Rights Reserved.
      </footer>
    </div>
  );
}
