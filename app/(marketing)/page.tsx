import Link from "next/link";
import { ArrowRight, Layers, Zap, Users, ShieldAlert, Sparkles, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28 text-center max-w-5xl mx-auto px-6">
        <div className="inline-flex items-center gap-x-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-300 mb-6 backdrop-blur-sm animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Introducing Nexora v1.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Collaborative{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
            Infinite Whiteboard
          </span>{" "}
          for Teams
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Nexora is a real-time collaborative workspace built featuring an infinite canvas, live multi-user collaboration, secure organization workspaces, and a rich toolset for diagramming and drawing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-none px-8 py-6 text-base font-semibold shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105">
            <Link href="/dashboard" className="flex items-center gap-x-2">
              Start Designing <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full border-slate-700 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60 hover:text-white px-8 py-6 text-base font-semibold transition-transform duration-300 hover:scale-105">
            <Link href="#features">
              Explore Features
            </Link>
          </Button>
        </div>

        {/* Live Whiteboard Canvas Mockup */}
        <div className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-2xl shadow-indigo-500/5 backdrop-blur-sm overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent z-10" />
          <div className="absolute top-4 left-4 flex gap-x-2 z-20">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <div className="w-full aspect-[16/9] rounded-lg border border-slate-800/80 bg-[#121826] relative flex items-center justify-center overflow-hidden">
            {/* Grid Pattern inside Mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-25" />
            
            {/* Visual canvas shapes to demonstrate app */}
            <div className="absolute w-40 h-28 border-2 border-indigo-500 bg-indigo-500/10 rounded-lg flex flex-col justify-center items-center shadow-lg transform -rotate-6 translate-x-[-120px] translate-y-[-40px]">
              <span className="text-xs font-semibold text-indigo-300">UX Flowchart</span>
            </div>
            
            <div className="absolute w-36 h-36 border-2 border-emerald-500 bg-emerald-500/10 rounded-full flex flex-col justify-center items-center shadow-lg transform rotate-12 translate-x-[150px] translate-y-[30px]">
              <span className="text-xs font-semibold text-emerald-300">Idea Mapping</span>
            </div>
            
            <div className="absolute w-44 h-24 bg-amber-500/20 border-2 border-amber-500 rounded-md flex flex-col justify-center items-center shadow-lg transform -rotate-2 translate-x-[40px] translate-y-[-80px] p-2 text-center">
              <span className="text-xs font-bold text-amber-300">Sticky Note</span>
              <span className="text-[10px] text-amber-400 mt-1">&quot;Integrate Clerk Auth &amp; Liveblocks API&quot;</span>
            </div>

            <div className="flex flex-col items-center justify-center z-20 px-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-white font-bold text-lg">Real-Time Board Canvas Preview</p>
              <p className="text-slate-400 text-sm mt-1 max-w-sm text-center">Create organizations, invite teammates, and build boards collaboratively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Everything you need for collaboration
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Nexora brings the simplicity of whiteboard drawing together with the powerful security of corporate-level organization switcher and workspace sync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 hover:border-indigo-500/30 hover:bg-slate-900/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Infinite Canvas</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              Never run out of room. Drag, scroll, zoom, and build large-scale architecture flowcharts, mind maps, or wireframes.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 hover:border-violet-500/30 hover:bg-slate-900/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Instant Real-Time Collaboration</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              Powered by Liveblocks. See teammate cursors move live, view selection highlights instantly, and update board drawings without refresh latency.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/20 p-8 hover:border-pink-500/30 hover:bg-slate-900/40 transition-all duration-300 hover:scale-[1.02] flex flex-col">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rich Creative Drawing Tools</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1">
              Draw freely with a pencil, make perfect ellipses and rectangles, add text, edit sticky notes, change fill colors, and modify layer stacks.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Built on a State-of-the-Art Stack
          </h2>
          <p className="text-slate-400">
            Powered by modern technologies designed to scale efficiently and deliver high-performance user interfaces.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center flex flex-col justify-center items-center">
            <span className="font-bold text-white text-lg">Next.js 14</span>
            <span className="text-slate-500 text-xs mt-1">App Router</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center flex flex-col justify-center items-center">
            <span className="font-bold text-white text-lg">Liveblocks</span>
            <span className="text-slate-500 text-xs mt-1">Real-time Presence</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center flex flex-col justify-center items-center">
            <span className="font-bold text-white text-lg">Convex</span>
            <span className="text-slate-500 text-xs mt-1">Database & Actions</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center flex flex-col justify-center items-center">
            <span className="font-bold text-white text-lg">Clerk</span>
            <span className="text-slate-500 text-xs mt-1">Auth & Organizations</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 text-center flex flex-col justify-center items-center">
            <span className="font-bold text-white text-lg">Tailwind CSS</span>
            <span className="text-slate-500 text-xs mt-1">Premium Styling</span>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="architecture" className="max-w-7xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-r from-slate-950 to-indigo-950/30 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="inline-flex items-center gap-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-3.5 py-1 text-xs font-semibold text-emerald-400 mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>Teammate Isolation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Multi-Tenant Architecture out of the box
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6">
              Nexora relies on Clerk Organizations. Create workspaces for design teams, engineers, or products. Boards created under one organization cannot be queried or updated by other groups, establishing hard corporate tenant boundaries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-x-2 text-xs font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                Live cursor coordination
              </div>
              <div className="flex items-center gap-x-2 text-xs font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Layer manipulation isolation
              </div>
              <div className="flex items-center gap-x-2 text-xs font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                Encrypted JWT connection tokens
              </div>
            </div>
          </div>
          <div className="w-full md:w-80 flex flex-col gap-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex gap-x-3 items-start">
              <div className="text-indigo-400 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Under 16ms Latency</h4>
                <p className="text-slate-500 text-xs mt-1">Liveblocks state-sync processes edits at 60fps.</p>
              </div>
            </div>
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex gap-x-3 items-start">
              <div className="text-pink-400 mt-0.5">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">No Config Data Leaks</h4>
                <p className="text-slate-500 text-xs mt-1">Every Convex query is authenticated dynamically via JWT.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
          Ready to collaborate with your team?
        </h2>
        <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
          Get started with Nexora today and transform how your organization maps, wireframes, and collaborates on whiteboard ideas.
        </p>
        <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white border-none px-10 py-6 text-base font-semibold shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105">
          <Link href="/dashboard">
            Get Started Free
          </Link>
        </Button>
      </section>
    </div>
  );
}
