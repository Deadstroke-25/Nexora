# Nexora

A real-time collaborative whiteboard application built with **Next.js 14**, **Convex**, **Clerk**, and **Liveblocks**.

## About

Nexora is a collaborative infinite canvas where teams can create organizations, draw shapes, write sticky notes, and brainstorm together in real time. It features live cursor tracking, multi-user presence, and secure organization-based workspaces.

## Tech Stack

- **Next.js 14** — App Router, server/client components
- **Convex** — Real-time database & backend
- **Clerk** — Authentication & organization management
- **Liveblocks** — Real-time collaboration & presence
- **Tailwind CSS** — Styling
- **Zustand** — Client state management

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API keys
4. Run `npx convex dev` to start the Convex backend
5. Run `npm run dev` to start the Next.js dev server
6. Open [http://localhost:3000](http://localhost:3000)
