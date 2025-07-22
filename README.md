
# Link Saver + Auto-Summary

A web app to save bookmarks and auto-generate link summaries for easy reference and organization.
## Tech Stack
Frontend: Next.js, React, Tailwind CSS, shadcn/ui

Backend: Next.js API Routes

Authentication & Database: Supabase

Summary API: Jina AI

Hosting: Vercel

## Home Page

The **Home** page is the main dashboard where users can view and manage their bookmarks.

- **Features:**
  - Displays a list/grid of saved bookmarks with metadata (title, favicon, summary)
  - Allows adding new bookmarks by pasting URLs
  - Enables viewing detailed bookmark info via dialog/modal
  - Supports deleting bookmarks with confirmation
  - Responsive design for desktop and mobile

<img width="1901" height="822" alt="Screenshot 2025-07-23 002138" src="https://github.com/user-attachments/assets/09ec8fa8-0d00-4b7b-a53c-077137afb873" />

## Signup Page


The **Signup** page allows new users to create an account using their email and password.

- **Fields:**
  - Email (required)
  - Password (required)
- **Features:**
  - Validates email format and password strength
  - Shows error messages for invalid inputs or existing accounts
  - On successful signup, automatically logs in the user and redirects to the Home page
<img width="1909" height="955" alt="Screenshot 2025-07-23 002227" src="https://github.com/user-attachments/assets/9340780e-b395-4b79-9c78-c27b467f6179" />


## Login Page

The **Login** page allows existing users to authenticate with their email and password.

- **Fields:**
  - Email (required)
  - Password (required)
- **Features:**
  - Validates user credentials against the backend
  - Displays error messages for incorrect email or password
  - On successful login, redirects the user to the Home page
  - Supports session persistence via JWT or cookies
<img width="1876" height="876" alt="Screenshot 2025-07-23 002212" src="https://github.com/user-attachments/assets/65ca0173-1031-48ea-bdf0-b507a2ac73c2" />

---



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
