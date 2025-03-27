import Image from "next/image";
import Link from "next/link";
import { WrenchIcon } from "@heroicons/react/24/outline";
import { use } from "react";

import { JSIcon } from "@/assets";
import { getCategories } from "./service/categories";

export default function HomePage() {
  const { categories } = use(getCategories());

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      <div className="relative flex flex-col justify-center items-center min-h-[50vh] md:h-[60vh] px-4 md:px-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -top-24 md:-top-48 -right-12 md:-right-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] -bottom-24 md:-bottom-48 -left-12 md:-left-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
        </div>
        
        <Image
          alt="icon"
          src={JSIcon}
          width={120}
          height={120}
          className="relative animate-float md:w-[180px] md:h-[180px] w-[120px] h-[120px]"
        />
        <h1 className="mt-6 md:mt-8 text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#f7df1e] via-amber-400 to-[#f7df1e] bg-clip-text text-transparent bg-300% animate-gradient text-center">
          JS Toolbox
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-xl text-slate-400 text-center max-w-xs md:max-w-none px-4">
          Find the perfect JavaScript packages to enhance your development workflow
        </p>
      </div>

      <main className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 animate-in fade-in duration-700">
            {categories.map((cate, idx) => (
              <Link
                key={idx}
                href={`/categories/${cate}`}
                className="group p-4 md:p-6 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-[#f7df1e]/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5 fill-mode-both backdrop-blur-sm"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <WrenchIcon className="size-4 md:size-5 text-[#f7df1e] transition-all duration-500 group-hover:rotate-12" />
                  <span className="text-base md:text-lg text-slate-200 group-hover:text-[#f7df1e] transition-all duration-500">
                    {cate}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
