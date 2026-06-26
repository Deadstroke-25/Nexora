"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Menu } from "lucide-react";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { api } from "@/convex/_generated/api";
import { Actions } from "@/components/actions";
import { Button } from "@/components/ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { useRenameModal } from "@/store/use-rename-modal";

interface InfoProps {
  boardId: string;
};

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const TabSeparator = () => {
  return (
    <div className="text-neutral-300 px-1.5">
      |
    </div>
  );
};

export const Info = ({
  boardId,
}: InfoProps) => {
  const { onOpen } = useRenameModal();

  const data = useQuery(api.board.get, {
    id: boardId as Id<"boards">,
  });

  if (!data) return <InfoSkeleton />;

  return (
    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-xl px-2 h-12 flex items-center shadow-md border border-slate-200/50">
      <Hint label="Back to dashboard" side="bottom" sideOffset={10}>
        <Button asChild size="icon" variant="board" className="h-8 w-8 hover:bg-slate-100/50 transition mr-1">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 text-slate-700" />
          </Link>
        </Button>
      </Hint>
      <Hint label="Go to boards" side="bottom" sideOffset={10}>
        <Button asChild variant="board" className="px-2 hover:bg-slate-100/50 transition">
          <Link href="/dashboard">
            <Image
              src="/logo.svg"
              alt="Nexora Logo"
              height={32}
              width={32}
              className="rounded"
            />
            <span className={cn(
              "font-bold text-lg ml-2 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent",
              font.className,
            )}>
              Nexora
            </span>
          </Link>
        </Button>
      </Hint>
      <TabSeparator />
      <Hint label="Edit title" side="bottom" sideOffset={10}>
        <Button
          variant="board"
          className="text-base font-normal px-2"
          onClick={() => onOpen(data._id, data.title)}
        >
          {data.title}
        </Button>
      </Hint>
      <TabSeparator />
      <Actions
        id={data._id}
        title={data.title}
        side="bottom"
        sideOffset={10}
      >
        <div>
          <Hint label="Main menu" side="bottom" sideOffset={10}>
            <Button size="icon" variant="board">
              <Menu />
            </Button>
          </Hint>
        </div>
      </Actions>
    </div>
  );
};

export const InfoSkeleton = () => {
  return (
    <div 
      className="absolute top-2 left-2 bg-white/90 backdrop-blur-md rounded-xl px-2 h-12 flex items-center shadow-md w-[300px] border border-slate-200/50"
    />
  );
};
