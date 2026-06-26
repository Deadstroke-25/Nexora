# Nexora – Collaborative Infinite Whiteboard for Teams

Nexora is a high-performance, real-time collaborative whiteboard built using Next.js. It features an infinite canvas, live multi-user presence coordination, instant state synchronization, document persistence, and team workspace isolation.

---

## 🚀 Key Features

*   🎨 **Infinite Canvas**: Zoom, pan, drag, and draw across an expandable canvas with zero layout boundaries.
*   👥 **Real-Time Collaboration**: See teammates' cursors moving live and capture selection bounding boxes in real-time.
*   ✍️ **Rich Whiteboard Tools**: Add rectangles, ellipses, text layers, sticky notes, and smooth freehand pen drawings.
*   🔐 **Multi-Tenant Workspaces**: Isolate boards using organizations and manage access permissions dynamically.
*   🔄 **History Traversal**: Full Undo and Redo operations available with a robust command stack.
*   🛡️ **Production Audited Security**: Zero credentials committed, parameterized JWT tokens, and detailed `.gitignore` rules.
*   💎 **Premium Glassmorphic UI**: High-end dark cosmic marketing page, light glass board widgets, and responsive dashboards.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Real-time Collaboration Engine**: [Liveblocks](https://liveblocks.io/) (Websocket state sync, cursors, presence)
*   **Database & Functions**: [Convex](https://www.convex.dev/) (Reactive backend, schema validation, indexes)
*   **Authentication & Tenant Management**: [Clerk](https://clerk.com/) (Secure login, signup, organization switcher)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (Radix Primitives)
*   **Drawing Math**: [Perfect Freehand](https://github.com/steveruizok/perfect-freehand) (Smooth vector pen lines)

---

## 📂 Project Structure

```text
Nexora/
├── app/                      # Next.js App Router root
│   ├── (marketing)/          # Public marketing landing page & layout
│   ├── (dashboard)/          # Dashboard route & organizational boards list
│   │   └── dashboard/        # Main boards page
│   ├── api/                  # API endpoints (Liveblocks connection authority)
│   ├── board/                # Board room routing
│   │   └── [boardId]/        # Interactive canvas workspace & menus
│   ├── globals.css           # Global Tailwind and base styles
│   └── layout.tsx            # Main HTML layout wrapper and context providers
├── components/               # Shareable React components & UI primitives
├── convex/                   # Convex backend schemas, tables, query/mutation files
├── hooks/                    # Reusable custom hooks
├── lib/                      # Common helpers and canvas mathematical utilities
├── providers/                # Client providers (Clerk, Convex, Modals)
├── public/                   # Public assets (logos, icons, illustrations)
└── store/                    # Frontend state stores (Zustand modals management)
```

---

## ⚙️ Environment Configuration

Nexora relies on external APIs for authentication, database storage, and synchronization. Copy the environment template to your local config:

```bash
cp .env.example .env.local
```

Fill in the following variables:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `CONVEX_DEPLOYMENT` | Convex backend project identifier | Convex CLI / Dashboard |
| `NEXT_PUBLIC_CONVEX_URL` | Public HTTP URL of your Convex database | Convex CLI / Dashboard |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Publishable API key | Clerk Dashboard |
| `CLERK_SECRET_KEY` | Clerk private API Secret Key | Clerk Dashboard |
| `LIVEBLOCKS_SECRET_KEY` | Liveblocks Private Secret Key | Liveblocks Dashboard |
| `CLERK_JWT_ISSUER_DOMAIN` | Frontend API Domain (domain of JWT issuer) | Clerk Dashboard |

---

## 🚀 Installation & Local Development

### 1. Clone the Project
```bash
git clone https://github.com/your-username/nexora.git
cd nexora
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Convex Database
Convex generates code assets dynamically on setup. Run the command to initialize your database:
```bash
npx convex dev
```
*(This command will prompt you to log into Convex and link or create a new project. Once running, it will automatically populate your `.env.local` with database connection keys.)*

### 4. Run the Dev Server
In a separate terminal tab, spin up the local Next.js dev server:
```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🌐 Production Deployment

Nexora is optimized for one-click deployment to **Vercel** with **Convex** and **Clerk**.

### Vercel Deployment Requirements
When deployment finishes in Vercel:
1.  **Configure environment variables**: Paste all variables from `.env.local` (Clerk Publishable Key, Secret Key, Liveblocks Secret, Convex URL, and redirects) into the Vercel project Settings.
2.  **Add Convex Integration**: Alternatively, link Vercel to Convex from your Convex dashboard to automatically synchronize deployment endpoints.
3.  **Clerk Allowed Redirects**: Ensure that your Clerk application is configured to redirect users back to your production domain (e.g. `https://your-domain.vercel.app/dashboard`).

---

## 📄 License

This project is licensed under the MIT License. You may use, distribute, and modify it for commercial and private products.
Original template boilerplate inspired by code-with-antonio Miro clone template. Rebranded and audited for public deployment.
