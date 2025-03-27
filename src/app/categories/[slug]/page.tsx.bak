import { use } from "react";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import StarChart from "@/components/page/categories/StarChart";
import PackageItem from "@/components/page/categories/PackageItem";
import { getCategory } from "@/app/service/categories";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage(props: Props) {
  const params = use(props.params);
  const res = use(getCategory(params.slug));

  const packageInfoList = (res.data || [])?.sort((a, b) => {
    return b.github.stars - a.github.stars;
  });
  const chartData = packageInfoList.slice(0, 5).map((item) => ({
    packageName: item.name,
    star: item.github.stars,
  }));

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -top-24 md:-top-48 -right-12 md:-right-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -bottom-24 md:-bottom-48 -left-12 md:-left-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative flex flex-col justify-end items-center pt-8 md:pt-12 px-4 md:px-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <TypographyH3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#f7df1e] via-amber-400 to-[#f7df1e] bg-clip-text text-transparent bg-size-300 animate-gradient text-center">
            {params.slug}
          </TypographyH3>
          <TypographyP className="text-slate-400 mt-2 text-sm md:text-base text-center">
            Show {params.slug} more packages details
          </TypographyP>

          <div className="mt-6 md:mt-8 w-full max-w-[1200px] flex flex-col gap-4 md:gap-6 pb-8">
            {/* 图表卡片 - 增加高度和调整内边距 */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-xl p-3 md:p-8 backdrop-blur-sm animate-in fade-in duration-700">
              <div className="h-[200px] md:h-[400px] w-full">
                <StarChart chartData={chartData} />
              </div>
            </div>

            {/* 包列表 */}
            <div className="flex flex-col gap-3 md:gap-4">
              {packageInfoList.map((item, idx) => (
                <div
                  key={item.name}
                  className="animate-in fade-in slide-in-from-bottom-5 duration-500"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <PackageItem info={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
