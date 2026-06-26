"use client";

import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { LayoutDashboard, Star } from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  return (
    <div className="hidden lg:flex flex-col space-y-6 w-[206px] pl-5 pt-5 border-r border-slate-200/30 bg-slate-50/20 backdrop-blur-md h-full">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            height={44}
            width={44}
            className="rounded-lg shadow-sm"
          />
          <span className={cn(
            "font-bold text-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent",
            font.className,
          )}>
            Nexora
          </span>
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            }
          }
        }}
      />
      <div className="space-y-1 w-full">
        <Button
          variant={favorites ? "ghost" : "secondary"}
          asChild
          size="lg"
          className={cn(
            "font-medium justify-start px-3 w-full rounded-xl transition-all duration-200",
            !favorites && "shadow-sm bg-white border border-slate-200/50 hover:bg-slate-50"
          )}
        >
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4 mr-2 text-indigo-600" />
            Team boards
          </Link>
        </Button>
        <Button
          variant={favorites ? "secondary" : "ghost"}
          asChild
          size="lg"
          className={cn(
            "font-medium justify-start px-3 w-full rounded-xl transition-all duration-200",
            favorites && "shadow-sm bg-white border border-slate-200/50 hover:bg-slate-50"
          )}
        >
          <Link href={{
            pathname: "/dashboard",
            query: { favorites: true }
          }}>
            <Star className={cn("h-4 w-4 mr-2", favorites ? "text-amber-500 fill-amber-500" : "text-amber-500")} />
            Favorite boards
          </Link>
        </Button>
      </div>
    </div>
  );
};
