import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { use } from "react";

import { JSIcon } from "@/assets";
import { TypographyH1, TypographyP } from "@/components/ui/typography";
import { getCategories } from "./service/categories";

export default function HomePage() {
  const t = useTranslations("HomePage");
  const { categories } = use(getCategories());
  return (
    <div>
      <div className="flex flex-col justify-center items-center relative h-48 px-10">
        <Image
          alt="icon"
          src={JSIcon}
          width={150}
          height={150}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none"
        />
        <TypographyH1>{t("title")}</TypographyH1>
        <TypographyP>{t("about")}</TypographyP>
      </div>
      <main className="p-10">
        <div className="flex flex-col gap-4 mt-10 lg:gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cate, idx) => (
            <Link
              key={idx}
              href={`/categories/${cate}`}
              className="flex items-center py-4 px-5 rounded-lg shadow hover:bg-amber-100 transition-all text-slate-700"
            >
              <WrenchIcon className="size-5" />
              <span className="ml-2">{cate}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
