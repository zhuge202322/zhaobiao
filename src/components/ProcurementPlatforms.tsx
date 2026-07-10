"use client";

import React, { useEffect, useRef } from "react";

type PlatformImage = {
  alt: string;
  src: string;
};

type ProcurementPlatformsProps = {
  onOpenForm?: () => void;
};

const nationalPlatforms: PlatformImage[] = [
  { alt: "北京市政府采购网", src: "/platforms/national-cards/beijing-1.png" },
  { alt: "重庆市政府采购平台", src: "/platforms/national-cards/beijing-2.png" },
  { alt: "辽宁政府采购网", src: "/platforms/national-cards/beijing-3.png" },
  { alt: "江苏政府采购网", src: "/platforms/national-cards/beijing-4.png" },
  { alt: "山东政府采购网", src: "/platforms/national-cards/shandong-1.png" },
  { alt: "浙江政府采购网", src: "/platforms/national-cards/shandong-2.png" },
  { alt: "湖南政府采购网", src: "/platforms/national-cards/shandong-3.png" },
  { alt: "江西政府采购网", src: "/platforms/national-cards/shandong-4.png" },
  { alt: "上海市政府采购网", src: "/platforms/national-cards/shanghai-1.png" },
  { alt: "山西政府采购网", src: "/platforms/national-cards/shanghai-2.png" },
  { alt: "广东政府采购网", src: "/platforms/national-cards/shanghai-3.png" },
  { alt: "宁夏政府采购网", src: "/platforms/national-cards/shanghai-4.png" },
  { alt: "陕西政府采购网", src: "/platforms/national-cards/shaanxi-1.png" },
  { alt: "内蒙古政府采购网", src: "/platforms/national-cards/shaanxi-2.png" },
  { alt: "黑龙江政府采购网", src: "/platforms/national-cards/shaanxi-3.png" },
  { alt: "湖北政府采购网", src: "/platforms/national-cards/shaanxi-4.png" },
  { alt: "吉林政府采购网", src: "/platforms/national-cards/jilin-1.png" },
  { alt: "安徽政府采购网", src: "/platforms/national-cards/jilin-2.png" },
  { alt: "四川政府采购网", src: "/platforms/national-cards/jilin-3.png" },
  { alt: "832平台", src: "/platforms/national-cards/jilin-4.png" },
  { alt: "新疆政府采购网", src: "/platforms/national-cards/xinjiang-1.png" },
  { alt: "天津政府采购网", src: "/platforms/national-cards/xinjiang-2.png" },
  { alt: "甘肃政府采购网", src: "/platforms/national-cards/xinjiang-3.png" },
  { alt: "广西政府采购网", src: "/platforms/national-cards/xinjiang-4.png" },
  { alt: "福建政府采购网", src: "/platforms/national-cards/fujian-1.png" },
  { alt: "河北政府采购网", src: "/platforms/national-cards/fujian-2.png" },
  { alt: "河南政府采购网", src: "/platforms/national-cards/fujian-3.png" },
  { alt: "海南政府采购网", src: "/platforms/national-cards/fujian-4.png" },
  { alt: "青海政府采购网", src: "/platforms/national-cards/qinghai-1.png" },
  { alt: "云南政府采购网", src: "/platforms/national-cards/qinghai-2.png" },
  { alt: "贵州政府采购网", src: "/platforms/national-cards/qinghai-3.png" },
  { alt: "西藏政府采购网", src: "/platforms/national-cards/qinghai-4.png" },
];

const enterprisePlatforms: PlatformImage[] = [
  { alt: "中国电力", src: "/platforms/enterprise/zhongguo-dianli.png" },
  { alt: "机电设备招标采购平台", src: "/platforms/enterprise/jidian-shebei.png" },
  { alt: "中国机电设备招标中心", src: "/platforms/enterprise/jidian.png" },
  { alt: "中国南方电网", src: "/platforms/enterprise/nanfang-dianwang.png" },
  { alt: "中国建设招标网", src: "/platforms/enterprise/jianshe-zhaobiao.png" },
  { alt: "中电招标网", src: "/platforms/enterprise/zhongdian-zhaobiao.png" },
  { alt: "中国石化", src: "/platforms/enterprise/zhonghe.png" },
  { alt: "中国安能", src: "/platforms/enterprise/zhongguo-anneng.png" },
  { alt: "能源一号网", src: "/platforms/enterprise/nengyuan-1hao.png" },
  { alt: "国家电网", src: "/platforms/enterprise/guojia-dianwang.png" },
  { alt: "中国电建", src: "/platforms/enterprise/zhongguo-dianjian.png" },
  { alt: "中国联通", src: "/platforms/enterprise/liantong.png" },
  { alt: "南航采招", src: "/platforms/enterprise/nanhang-caizhao.png" },
  { alt: "云筑网", src: "/platforms/enterprise/yunzhuwang.png" },
  { alt: "国药", src: "/platforms/enterprise/guoyao.png" },
  { alt: "大唐电商", src: "/platforms/enterprise/datang-dianshang.png" },
  { alt: "华山云商", src: "/platforms/enterprise/huashan-yunshang.png" },
  { alt: "中央直属机构采购中心", src: "/platforms/enterprise/zhongyang-zhishu.png" },
  { alt: "政采招标网", src: "/platforms/enterprise/zhengcai-zhaobiao.png" },
  { alt: "电力采集招标", src: "/platforms/enterprise/dianli-caiji.png" },
  { alt: "中铝集团", src: "/platforms/enterprise/zhonglv.png" },
  { alt: "国家信息中心", src: "/platforms/enterprise/guojia-xinxi.png" },
];

function PlatformImageCard({
  item,
  onOpenForm,
  fit = "cover",
}: {
  item: PlatformImage;
  onOpenForm?: () => void;
  fit?: "cover" | "contain";
}) {
  return (
    <button
      type="button"
      onClick={onOpenForm}
      className="platform-image-card h-[90px] md:h-[96px] lg:h-[76px] overflow-hidden rounded-lg bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md border border-white hover:border-blue-100 cursor-pointer snap-start"
      aria-label={`${item.alt}登记咨询`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
      />
    </button>
  );
}

export default function ProcurementPlatforms({ onOpenForm }: ProcurementPlatformsProps) {
  const nationalRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (!ref.current) return;
    const scrollAmount = direction === "left" ? -300 : 300;
    ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  useEffect(() => {
    const autoScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return;
      if (ref.current.scrollLeft + ref.current.clientWidth >= ref.current.scrollWidth - 10) {
        ref.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        ref.current.scrollBy({ left: 280, behavior: "smooth" });
      }
    };

    const interval = setInterval(() => {
      autoScroll(nationalRef);
      autoScroll(enterpriseRef);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="procurement-platforms bg-[#eef5fd] py-8 md:py-12 border-t border-gray-200">
      <div className="w1200 overflow-hidden">
        <div className="mb-10 relative">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => scroll(nationalRef, "left")}
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
              onClick={() => scroll(nationalRef, "right")}
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &gt;
            </button>
          </div>

          <div
            ref={nationalRef}
            className="platform-card-grid grid grid-rows-2 grid-flow-col auto-cols-[260px] md:auto-cols-[280px] lg:auto-cols-[220px] gap-3 md:gap-4 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {nationalPlatforms.map((item) => (
              <PlatformImageCard key={item.src} item={item} onOpenForm={onOpenForm} />
            ))}
          </div>
        </div>

        <div className="mb-4 relative">
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={() => scroll(enterpriseRef, "left")}
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
              onClick={() => scroll(enterpriseRef, "right")}
              className="text-blue-400 hover:text-blue-600 text-2xl px-4 cursor-pointer"
            >
              &gt;
            </button>
          </div>

          <div
            ref={enterpriseRef}
            className="platform-card-grid grid grid-rows-2 grid-flow-col auto-cols-[260px] md:auto-cols-[280px] lg:auto-cols-[220px] gap-3 md:gap-4 overflow-x-auto snap-x scroll-smooth pb-4 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {enterprisePlatforms.map((item) => (
              <PlatformImageCard key={item.src} item={item} onOpenForm={onOpenForm} fit="contain" />
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `,
        }}
      />
    </section>
  );
}
