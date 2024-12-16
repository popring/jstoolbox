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
    <div className="min-h-screen">
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-48 -right-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute w-[500px] h-[500px] -bottom-48 -left-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative flex flex-col justify-end items-center animate-in fade-in slide-in-from-bottom-5 duration-500">
          <TypographyH3 className="text-4xl font-bold bg-gradient-to-r from-[#f7df1e] via-amber-400 to-[#f7df1e] bg-clip-text text-transparent bg-size-300 animate-gradient">
            {params.slug}
          </TypographyH3>
          <TypographyP className="text-slate-400 mt-2">
            Show {params.slug} more packages details
          </TypographyP>

          <div className="mt-8 w-5/6 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-xl p-6 backdrop-blur-sm animate-in fade-in duration-700">
              <StarChart chartData={chartData} />
            </div>

            <div className="flex flex-col gap-4">
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
