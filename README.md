
# Link Saver + Auto-Summary


## Tech Stack
Frontend: Next.js, React, Tailwind CSS, shadcn/ui

Backend: Next.js API Routes

Authentication & Database: Supabase

Summary API: Jina AI

Hosting: Vercel
## Setup Instructions

Clone the project

```bash
  git clone git@github.com:iamamritpalrandhawa/link-saver.git
```

Go to the project directory

```bash
  cd link-saver
```

Install dependencies
```bash
  pnpm install
```
Create a Supabase project and configure environment variables:

```.env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
Start the server

```bash
  pnpm dev
```
Open http://localhost:3000 to view in browser.

## What I'd Do Next

- Add tag filtering and management  
- Implement drag-and-drop bookmark reordering  
- Improve error handling and loading states  
- Add dark mode support  
- Write more unit and integration tests  
- Optimize summary fetching and caching
