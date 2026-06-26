import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This middleware protects routes and handles auth redirects.
// See https://clerk.com/docs/references/nextjs/auth-middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in", "/sign-up", "/api/liveblocks-auth"],
  afterAuth(auth, req) {
    // If user is signed in and trying to access auth pages, redirect to dashboard
    if (auth.userId && auth.isPublicRoute) {
      const dashboardUrl = new URL("/dashboard", req.url);

      // Only redirect from auth pages, not from marketing or API routes
      if (
        req.nextUrl.pathname === "/sign-in" ||
        req.nextUrl.pathname === "/sign-up"
      ) {
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // If user is NOT signed in and route is NOT public, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // Allow the request to proceed
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/" , "/(api|trpc)(.*)"],
};
