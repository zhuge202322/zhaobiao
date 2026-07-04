import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">个人信息与隐私保护条款</h1>
          <Link href="/">
            <span className="text-[#3991F6] hover:underline cursor-pointer font-semibold">返回首页</span>
          </Link>
        </div>

        <div className="space-y-6 leading-relaxed text-sm md:text-base text-gray-700">
          <p>
            欢迎您访问政采服务云平台（以下简称“本平台”）。我们深知个人信息对您的重要性，并庄重承诺保护您的隐私安全。本《个人信息与隐私保护条款》详细说明了我们在您使用本平台服务时如何收集、使用、保存、共享及保护您的个人信息。
          </p>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">一、信息的收集</h2>
            <p className="mb-2">当您注册本平台账户、申请供应商入驻或办理其他相关业务（如CA锁办理、店铺托管等）时，我们可能会收集以下信息：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>身份信息：</strong> 姓名、身份证号码、手机号码、电子邮箱。</li>
              <li><strong>企业信息：</strong> 公司名称、统一社会信用代码、营业执照副本、法人信息、开户许可证。</li>
              <li><strong>交易与操作记录：</strong> 您在本平台的浏览记录、搜索记录、订单记录、客服沟通记录等。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">二、信息的使用</h2>
            <p className="mb-2">我们收集的上述信息将仅用于以下用途：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>核实您的真实身份及企业资质，确保交易的安全与合规。</li>
              <li>为您提供入驻代办、CA办理、店铺搭建等专业服务。</li>
              <li>向您发送平台通知、业务进度、政策公告等重要信息。</li>
              <li>改进我们的服务质量、进行内部审计及数据分析。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">三、信息的保护与保存</h2>
            <p>
              我们采用业界标准的安全防护措施保护您的个人信息，防止数据遭到未经授权的访问、公开披露、使用、修改、损坏或丢失。我们仅在法律法规要求的期限内，以及为实现本隐私条款所述目的所必需的时间内保留您的个人信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">四、信息的共享与披露</h2>
            <p>
              未经您的明确同意，我们不会向任何第三方共享或披露您的个人信息，但以下情况除外：
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>为办理政采入驻、CA锁等业务，必须向相关政府公共资源交易中心或CA认证机构提交您的资料。</li>
              <li>根据法律法规、法院命令或国家有关主管部门的要求。</li>
              <li>为维护国家安全、公共利益或本平台合法权益所必需。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">五、您的权利</h2>
            <p>
              您有权随时登录您的账户，查阅、更新或更正您的个人信息。如果您希望注销账户或要求删除您的个人信息，可以通过平台客服热线与我们联系，我们将在验证您的身份后及时处理。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 mt-8">六、免责声明</h2>
            <p>
              由于黑客攻击、计算机病毒侵入等不可抗力因素导致的个人信息泄露，本平台在采取了合理的补救措施后，将在法律允许的范围内免于承担责任。
            </p>
          </section>
          
          <div className="mt-12 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            <p>本隐私条款最终解释权归政采服务云平台所有。最近更新日期：2026年7月</p>
          </div>
        </div>
      </div>
    </div>
  );
}
