import Link from "next/link";
import Image from "next/image";
import { Poppins } from "next/font/google";
import { auth, UserButton } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  return (
    <div className="min-h-full bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden relative">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-[#0b0f19]/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-x-2.5 group">
            <Image
              src="/logo.svg"
              alt="Nexora Logo"
              height={36}
              width={36}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <span className={cn(
              "font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent",
              font.className
            )}>
              Nexora
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-x-8 text-sm font-medium text-slate-400">
            <Link href="#features" className="hover:text-slate-100 transition-colors">
              Features
            </Link>
            <Link href="#tech-stack" className="hover:text-slate-100 transition-colors">
              Tech Stack
            </Link>
            <Link href="#architecture" className="hover:text-slate-100 transition-colors">
              Architecture
            </Link>
          </nav>

          <div className="flex items-center gap-x-4">
            {userId ? (
              <>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-full px-5 shadow-lg shadow-indigo-500/25 border-none font-medium text-sm transition-all duration-300 hover:scale-102">
                  <Link href="/dashboard">
                    Enter App
                  </Link>
                </Button>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9 border-2 border-indigo-500/40 hover:border-indigo-400 transition-colors",
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-800/40">
                  Sign In
                </Link>
                <Button asChild className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-full px-5 shadow-lg shadow-indigo-500/25 border-none font-medium text-sm transition-all duration-300 hover:scale-102">
                  <Link href="/dashboard">
                    Get Started Free
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-[#070a12] py-12 relative z-10 text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-y-6">
          <div className="flex items-center gap-x-2">
            <Image
              src="/logo.svg"
              alt="Nexora Logo"
              height={28}
              width={28}
              className="opacity-75"
            />
            <span className={cn(
              "font-semibold text-slate-400",
              font.className
            )}>
              Nexora
            </span>
          </div>
          <p className="text-slate-500 text-center md:text-left">
            Built by Suprojeet Sonar
          </p>
          <div className="flex gap-x-6">
            <Link href="#features" className="hover:text-slate-300 transition-colors">
              Features
            </Link>
            <Link href="#tech-stack" className="hover:text-slate-300 transition-colors">
              Stack
            </Link>
            <a href="https://github.com/Deadstroke-25/Nexora" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
