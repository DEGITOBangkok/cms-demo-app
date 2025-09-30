"use client"
/* eslint-disable @next/next/no-img-element */
import { ArrowIcon } from "@/components";
import React from "react";
import Link from "next/link";
import { useTranslations } from "use-intl";

export default function NotFoundClient() {
  const t = useTranslations("notfound")
  return (
    <div className="flex h-full w-full pt-[154px] pb-[58px] items-center justify-center">
      <div className="w-[599px] flex flex-col items-center text-center gap-6">
        <img src="/images/404.png" alt="404" className="w-[187px] h-[187px]" />
        <h1 className="text-[32px] text-[#E60000]  px-4 font-bold">
       {t("title")}
        </h1>
        <p className="text-[20px] text-black px-4">
       {t("subtitle")}
        </p>
        <Link href="/">
          <button className="flex cursor-pointer flex-row bg-[#E60000] py-3.5 px-12 rounded-[100px] text-white justify-center items-center gap-2">
            <span>{t("button")}</span>
            <ArrowIcon width={24} height={24} />
          </button>
        </Link>
      </div>
    </div>
  );
}
