import { List } from "./list";
import { NewButton } from "./new-button";

export const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-[#0b0f19] border-r border-slate-800/40 h-full w-[60px] flex p-3 flex-col gap-y-4 text-white shadow-xl backdrop-blur-md">
      <List />
      <NewButton />
    </aside>
  );
};
