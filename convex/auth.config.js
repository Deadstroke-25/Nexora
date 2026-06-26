export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://light-grub-93.clerk.accounts.dev",
      applicationID: "convex",
    },
  ]
};
