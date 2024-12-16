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
      <div className="relative flex flex-col justify-center items-center h-[60vh] px-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute w-[500px] h-[500px] -top-48 -right-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute w-[500px] h-[500px] -bottom-48 -left-24 bg-[#f7df1e]/10 rounded-full blur-[100px] animate-pulse" />
        </div>
        
        <Image
          alt="icon"
          src={JSIcon}
          width={180}
          height={180}
          className="relative animate-float"
        />
        <h1 className="mt-8 text-5xl font-bold bg-gradient-to-r from-[#f7df1e] via-amber-400 to-[#f7df1e] bg-clip-text text-transparent bg-300% animate-gradient">
          JS Toolbox
        </h1>
        <p className="mt-4 text-xl text-slate-400">
          Find the perfect JavaScript packages to enhance your development workflow
        </p>
      </div>

      <main className="min-h-screen bg-gradient-to-b from-slate-950via-slate-900to-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-700">
            {categories.map((cate, idx) => (
              <Link
                key={idx}
                href={`/categories/${cate}`}
                className="group p-6 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800 hover:border-[#f7df1e]/30 transition-all duration-500 animate-in fade-in slide-in-from-bottom-5 fill-mode-both backdrop-blur-sm"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <WrenchIcon className="size-5 text-[#f7df1e] transition-all duration-500 group-hover:rotate-12" />
                  <span className="text-lg text-slate-200 group-hover:text-[#f7df1e] transition-all duration-500">
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
