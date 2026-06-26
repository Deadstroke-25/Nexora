"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { 
  UserButton, 
  OrganizationSwitcher, 
  useOrganization
} from "@clerk/nextjs";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { SearchInput } from "./search-input";
import { InviteButton } from "./invite-button";

export const Navbar = () => {
  const { organization } = useOrganization();

  return (
    <div className="flex items-center gap-x-4 p-5">
      <div className="hidden lg:flex lg:flex-1">
        <SearchInput />
      </div>
      <div className="block lg:hidden flex-1">
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "376px",
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
      </div>
      {organization && (
        <InviteButton />
      )}
      <Hint label="Back to home" side="bottom" sideOffset={10}>
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-slate-100">
          <Link href="/">
            <Home className="h-4 w-4 text-slate-600" />
          </Link>
        </Button>
      </Hint>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
};
