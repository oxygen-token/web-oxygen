"use client";
import { useTranslations } from "next-intl";

export default function Blog_Header() {
  const t = useTranslations("Blog");

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <h2 className="text-3xl font-bold text-teal-300">
        {t("allPosts")}
      </h2>
      
      <div className="relative">
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          className="pl-10 pr-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
