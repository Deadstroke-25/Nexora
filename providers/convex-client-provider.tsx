"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  ConvexReactClient,
} from "convex/react";

import { Loading } from "@/components/auth/loading";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ConvexProviderWithClerk useAuth={useAuth as any} client={convex}>
      <Authenticated>{children}</Authenticated>

      <Unauthenticated>{children}</Unauthenticated>

      <AuthLoading>
        <Loading />
      </AuthLoading>
    </ConvexProviderWithClerk>
  );
};