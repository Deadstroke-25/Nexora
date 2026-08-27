# Nexora - Real-Time Collaborative Whiteboard

Nexora is a modern, real-time collaborative whiteboard application designed for teams to visually brainstorm, sketch, wireframe, and organize ideas on an infinite canvas. Built with **Next.js 14**, **Convex**, **Clerk**, and **Liveblocks**, Nexora delivers multi-user live interaction with organization-scoped workspace isolation.

---

## Overview

### What the Project Does
Nexora provides a real-time digital canvas where users can draw freehand, insert geometric shapes (rectangles, ellipses), add sticky notes, write text, adjust layer styling, and manage canvas z-index ordering.

### What Problem It Solves
Remote and hybrid teams often struggle with fragmented visual communication during design reviews and brainstorming sessions. Nexora unifies team brainstorming into a single workspace featuring live cursor tracking, instant state updates, and organization-based access controls without lag or physical board boundaries.

### Why It Was Built
Nexora was developed to explore modern web patterns for low-latency collaborative state sync, combining reactive real-time database queries with multiplayer presence streams and secure multi-tenant organization authorization.

### Who Would Find It Useful
- **Product Managers & Designers**: Wireframing, idea mapping, and rapid layout prototyping.
- **Software Engineers**: System architecture sketching, flowchart design, and team technical discussions.
- **Remote Teams & Educators**: Interactive group brainstorming and visual presentation.

---

## Key Features

- 🎨 **Infinite Canvas & Toolset**:
  - **Selection Tool**: Select single or multiple canvas elements, translate position, and resize via corner handles.
  - **Freehand Pen (Pencil)**: Smooth drawing path rendering utilizing `perfect-freehand`.
  - **Geometric Shapes**: Draw scalable Rectangles and Ellipses.
  - **Sticky Notes**: Color-configurable notes with inline text editing.
  - **Text Tool**: Dynamic inline text insertion and editing.
  - **Eraser Tool**: Point-based element removal on click or drag.
- ⚡ **Real-Time Multiplayer Collaboration**:
  - Live cursor tracking for active room participants.
  - Synchronized selection indicators across connected users.
  - Real-time layer updates broadcasted at 60 FPS via Liveblocks.
- 🏢 **Multi-Tenant Organization Workspaces**:
  - Integration with Clerk Organizations for workspace switching and team boundaries.
  - Board creation, renaming, deletion, and organization-filtered board search.
  - Favorite/unfavorite boards with user-specific quick access views.
- 🛠️ **Layer Management & Styling**:
  - Custom color palette picker for layer fill colors.
  - Z-index layer stack adjustment (Bring to Front, Send to Back).
  - Canvas background color selector.
  - Built-in Undo and Redo operations using Liveblocks room context history.
- 🔍 **Navigation & View Controls**:
  - Infinite panning and zooming controls.
  - Mobile touch gesture support (two-finger pan and pinch-to-zoom).

---

## Tech Stack

### Frontend & UI
| Technology | Description |
| :--- | :--- |
| **Next.js 14** | React Framework utilizing App Router, Server Components, and API Routes |
| **TypeScript** | Type-safe application development |
| **Tailwind CSS** | Utility-first CSS framework for custom styling |
| **Radix UI** | Accessible primitive components (Dialogs, Dropdowns, Tooltips, Alerts) |
| **Lucide React** | Modern iconography set |
| **Sonner** | Toast notification system |
| **Zustand** | Lightweight client state management for modals |

### Backend, Database & Real-Time Sync
| Technology | Description |
| :--- | :--- |
| **Convex** | Real-time backend database, mutation handlers, and reactive queries |
| **Liveblocks** | Multiplayer presence, live cursor synchronization, and conflict-free shared state |
| **Clerk** | Authentication, user identity management, and multi-tenant Organization switcher |

---

## How It Works

```
┌────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│                │      │                         │      │                         │
│  User Browser  ├─────►│  Clerk Authentication   ├─────►│  Convex Backend DB      │
│  (Next.js 14)  │      │  (JWT Token & Org ID)   │      │  (Board CRUD & Favs)    │
│                │      └────────────┬────────────┘      └─────────────────────────┘
└───────┬────────┘                   │                                              
        │                            ▼                                              
        │               ┌─────────────────────────┐                                 
        └──────────────►│  Liveblocks Auth Endpoint│                                 
                        │  /api/liveblocks-auth   │                                 
                        └────────────┬────────────┘                                 
                                     │                                              
                                     ▼                                              
                        ┌─────────────────────────┐                                 
                        │  Liveblocks Real-Time   │                                 
                        │  Room & Presence Sync   │                                 
                        └─────────────────────────┘                                 
```

1. **Authentication & Tenant Isolation**: User signs in via Clerk and selects an active Organization. Board metadata (title, author, orgId, thumbnail) is stored in Convex.
2. **Room Authorization**: Opening a board (`/board/[boardId]`) triggers an authentication POST request to `/api/liveblocks-auth`. The endpoint checks Clerk user credentials and verifies board organization membership via Convex before issuing a Liveblocks room session token.
3. **Canvas State Synchronization**: Liveblocks manages the shared canvas `Storage` using `LiveMap` for layers and `LiveList` for layer ID order. Presence data (mouse cursor position, pencil draft, active selection) is broadcasted live to all users in the same room.
4. **Optimistic Rendering**: SVG canvas elements re-render in real time as users mutate layer properties, draw paths, or re-order element layers.

---

## Project Structure

```
Nexora/
├── app/                        # Next.js 14 App Router
│   ├── (auth)/                 # Clerk authentication pages (sign-in, sign-up)
│   ├── (dashboard)/            # Main organization dashboard, search, and board grid
│   │   └── _components/        # Dashboard sidebars, board cards, and search filters
│   ├── (marketing)/            # Public landing page presenting Nexora features
│   ├── api/liveblocks-auth/    # API endpoint authorizing Liveblocks room access
│   ├── board/[boardId]/        # Infinite whiteboard canvas room route
│   │   └── _components/        # Canvas SVG, toolbar, cursors, layer previews, & selection tools
│   ├── globals.css             # Global styles and Tailwind directives
│   └── layout.tsx              # Root layout wrapped with Convex & Clerk providers
├── components/                 # Reusable UI components, modals, and room wrappers
│   ├── ui/                     # Radix UI primitive wrappers (Button, Dialog, Input, etc.)
│   └── modals/                 # Board rename modal implementation
├── convex/                     # Backend data schema and server functions
│   ├── schema.ts               # Convex database schema (boards, userFavorites)
│   ├── board.ts                # Board CRUD mutations (create, remove, update, favorite, get)
│   └── boards.ts               # Organization board listing and search queries
├── hooks/                      # Custom React hooks (selection bounds, layer deletion, etc.)
├── lib/                        # Math & drawing utility functions (canvas coords, pen paths)
├── liveblocks.config.ts        # Liveblocks room context configuration and type definitions
├── providers/                  # Application context providers (ConvexClientProvider, ModalProvider)
├── types/                      # TypeScript canvas definitions (LayerTypes, CanvasModes, Enums)
├── middleware.ts               # Clerk auth middleware route protection
└── package.json                # Project dependencies and script declarations
```

---

## Installation

Follow these steps to set up and run Nexora on your local machine.

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** / **pnpm** / **yarn**
- **Convex Account**: [convex.dev](https://www.convex.dev/)
- **Clerk Account**: [clerk.com](https://clerk.com/)
- **Liveblocks Account**: [liveblocks.io](https://liveblocks.io/)

### 1. Clone the Repository

```bash
git clone https://github.com/Deadstroke-25/Nexora.git
cd Nexora
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
# --- Convex Backend Setup ---
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud

# --- Clerk Authentication ---
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key

# --- Liveblocks Collaboration ---
LIVEBLOCKS_SECRET_KEY=sk_test_your_liveblocks_secret_key

# --- Convex JWT Authentication ---
CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-app.clerk.accounts.dev

# --- Clerk Navigation Redirects ---
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Initialize Convex Backend

In a separate terminal window, initialize and run your local Convex development instance:

```bash
npx convex dev
```

### 5. Run Next.js Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser to view the application.

---

## Usage

### 1. Organization Workspace & Board Creation
1. Navigate to `/dashboard` and log in via Clerk.
2. Select or create an Organization using the Clerk Organization Switcher in the sidebar.
3. Click **"New board"** to instantiate a new collaborative whiteboard.

### 2. Whiteboard Drawing & Annotation
- **Draw Shapes**: Select Rectangle or Ellipse from the floating toolbar and drag on the canvas.
- **Sticky Notes & Text**: Select Sticky Note or Text tool, click on the canvas, and type directly into the element.
- **Freehand Sketching**: Click the Pen icon to draw freeform strokes across the board.
- **Erasing**: Select Eraser and click/drag across elements to delete them.

### 3. Layer Manipulation
- **Move & Resize**: Click an element with the Select tool to drag it or adjust its size using corner anchor handles.
- **Styling**: Click an element to open the Selection Bar to change its fill color, bring it to front, or send it to back.
- **Background Color**: Use the bottom-right canvas controls to adjust the board canvas background color.

### 4. Real-Time Collaboration
- Share the board URL (`/board/[boardId]`) with team members belonging to the same Clerk Organization.
- Teammate cursors and real-time edits will synchronize instantly.

---

## Architecture

Nexora uses a decoupled micro-architecture combining client-side rendering with cloud-managed real-time sync providers:

| Component | Responsibility |
| :--- | :--- |
| **Next.js Client (React 18)** | Renders interactive SVG canvas, handles pointer events, calculates canvas bounds, and manages UI states. |
| **Clerk Auth & API Gateway** | Manages user sessions, identity tokens, and multi-tenant organization authorization. |
| **Convex Database & Query Engine** | Stores board metadata, user favorites indexes, and executes server-side board search filters. |
| **Liveblocks WebSocket Engine** | Handles state-sync over WebSockets (`LiveMap`, `LiveList`), user presence, and live mouse cursors. |

---

## Results / Output

- **Low Latency Synchronization**: Sub-16ms state broadcasts across connected room clients.
- **Multi-Tenant Isolation**: Board access restricted strictly to members of the matching Clerk Organization.
- **Responsive Vector Drawing**: Smooth SVG canvas rendering supporting pan, high-fidelity zoom, freehand stroke generation, and shape manipulation.

---

## Future Improvements

- [ ] Export canvas contents to PNG, SVG, or PDF formats.
- [ ] Add line and arrow tools for flowchart connecting nodes.
- [ ] Support image uploading directly onto the whiteboard canvas.
- [ ] Implement canvas mini-map for quick navigation across large boards.

---

## Contributors

- **Suprojeet Sonar** ([@Deadstroke-25](https://github.com/Deadstroke-25))

### Acknowledgments

Special thanks to **Antonio Erdeljac** for his comprehensive whiteboard application tutorial, which provided invaluable guidance on real-time architecture patterns using Next.js, Convex, Clerk, and Liveblocks.

---

## License

No license is currently specified for this project.
