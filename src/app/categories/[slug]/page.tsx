import { use } from "react";

import { TypographyH3, TypographyP } from "@/components/ui/typography";

import StarChart from "./components/StarChart";
import PackageItem from "./components/PackageItem";

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
    <div className="mt-5">
      <div className="flex flex-col justify-end items-center">
        <TypographyH3>{params.slug}</TypographyH3>
        <TypographyP>show {params.slug} more packages details</TypographyP>

        <div className="mt-2 w-5/6 flex flex-col gap-6">
          <StarChart chartData={chartData} />

          <div className="flex flex-col gap-3">
            {packageInfoList.map((item) => (
              <PackageItem key={item.name} info={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
