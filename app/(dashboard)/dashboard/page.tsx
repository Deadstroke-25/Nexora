"use client";

import { useOrganization } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

import { EmptyOrg } from "../_components/empty-org";
import { BoardList } from "../_components/board-list";

const DashboardPage = () => {
  const { organization } = useOrganization();
  const searchParams = useSearchParams();

  const query = {
    search: searchParams.get("search") || undefined,
    favorites: searchParams.get("favorites") || undefined,
  };

  return ( 
    <div className="flex-1 h-[calc(100%-80px)] p-6 bg-slate-50/50">
      {!organization ? (
        <EmptyOrg />
      ) : (
        <BoardList
          orgId={organization.id}
          query={query}
        />
      )}
    </div>
  );
};
 
export default DashboardPage;
