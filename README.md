# story-brew

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Hono, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Node.js** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
pnpm db:push
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Deployment (Cloudflare Wrangler)

- Web deploy: cd apps/web && pnpm deploy

## Project Structure

```
story-brew/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Start)
│   └── server/      # Backend API (Hono, TRPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI

Create a clean, modern mobile app UI for an AI storytelling platform.

The app allows users to:

- Input short story blocks (like “drink a coffee”, “coding”, “Thursday”)
- Generate a short story (under 400 characters)
- Publish and share it
- Explore other users’ stories
- Like stories
- View their own published stories

Include the following screens:

1. **Home / Explore Screen**
   - Header with app logo and “Explore”
   - Grid or card list of stories
   - Each story card shows short text, author, likes, and a “Read More” button
   - Floating “+” button to create a new story

2. **Story Generator Screen**
   - Input fields for 3–5 “story blocks”
   - “Generate Story” button
   - Display AI-generated story in a styled text box
   - Buttons: “Edit”, “Regenerate”, “Publish”

3. **Story Detail Screen**
   - Full story text
   - Author info
   - Like button (heart icon)
   - Share button
   - Back button

4. **My Stories Screen**
   - List of published and draft stories
   - Each card has title, date, and likes
   - Options to edit or delete

5. **Profile Screen**
   - User avatar
   - Username, bio
   - Total stories and total likes count
   - “Edit Profile” button

Design style:

- Modern, minimal, friendly
- Soft rounded corners
- Light background with pastel accent colors
- Typography: readable and clean (e.g., Inter or Poppins or any appropriate aesthetic fonts)
- Include icons and subtle shadows for depth

Include navigation tabs for: Home, Create, My Stories, Profile
fad37293-05a1-422c-9e88-99cad86a27a1
