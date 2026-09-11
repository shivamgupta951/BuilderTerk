# 🤵 BuilderTerk


[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-BuilderTerk-black?style=for-the-badge)](https://builder-terk.vercel.app/)

## ✨ Live Preview

<p align="center">
  <a href="https://builder-terk.vercel.app/">
    <img 
      src="YOUR_SCREENSHOT_URL"
      alt="BuilderTerk Live Preview"
      width="900"
    />
  </a>
</p>

<p align="center">
  <b>👉 Try BuilderTerk live</b>
</p>



### AI-Powered Full-Stack App Builder with Live Preview, Code Generation & AI-Powered Improvements

BuilderTerk is a full-stack AI application builder that allows users to describe an application in natural language and generate a working React application with AI.

The platform combines **AI code generation, live browser previews, source-code inspection, image-aware prompts, AI error fixing, project persistence, subscription-based credits, and AI-powered application improvements** into a single development workspace.

Users can describe what they want to build, watch the generated application render instantly, inspect the generated source code, upload screenshots as design references, fix preview errors with AI, improve existing applications, and export their generated project as a ZIP file.

---

## 🚀 What is BuilderTerk?

Traditional application development requires manually setting up:

- Project structure
- Components
- Styling
- Dependencies
- Routing
- UI implementation
- Error handling
- Development environment

BuilderTerk simplifies the initial development process.

A user can enter a prompt such as:

> "Build a modern expense tracker with monthly charts, category filters, and a dark theme."

BuilderTerk sends the request to Gemini and generates:

- React components
- Application files
- Tailwind-based styling
- Required dependencies
- A project title
- An explanation of the generated application

The generated application is then loaded into **Sandpack**, where users can immediately preview and inspect the result.

---

# ✨ Key Features

- 🤖 AI-powered React application generation
- 💬 Natural-language application builder
- ⚡ Streaming AI generation status
- 🖥️ Live browser preview with Sandpack
- 💻 Generated source-code viewer
- 📂 Generated file explorer
- 📸 Image-aware prompts
- 🧠 AI-powered application improvement
- 🐛 AI-powered preview error fixing
- 📦 Smart npm dependency validation
- 📥 Export generated applications as ZIP
- 👤 Clerk authentication
- 💳 Free / Starter / Pro plans
- 🎟️ Credit-based AI generation system
- 🛡️ Arcjet rate limiting
- 🚨 Prompt-injection protection
- 🔐 Server-side ownership validation
- 🗄️ PostgreSQL persistence
- 🧬 Prisma ORM
- ☁️ Supabase Storage for uploaded images
- 📱 Responsive dark UI
- 🗂️ Persistent project history

---

# 🎬 How BuilderTerk Works

```text
                    USER
                      │
                      ▼
             ┌─────────────────┐
             │  Enter Prompt   │
             │  + Optional     │
             │  Image Upload   │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Clerk Auth     │
             │  User + Plan    │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │     Arcjet      │
             │ Rate Limit +    │
             │ Prompt Security │
             └────────┬────────┘
                      │
                      ▼
             ┌─────────────────┐
             │  Gemini AI      │
             │ Code Generation │
             └────────┬────────┘
                      │
                      ▼
          ┌────────────────────────┐
          │ Validate AI Response   │
          │                        │
          │ • JSON                 │
          │ • Files                │
          │ • Dependencies         │
          └───────────┬────────────┘
                      │
                      ▼
             ┌─────────────────┐
             │    Sandpack     │
             │ Live Preview    │
             │ + Code Editor   │
             └────────┬────────┘
                      │
             ┌────────┴─────────┐
             ▼                  ▼
       Preview App         Source Code
             │                  │
             └────────┬─────────┘
                      ▼
                Save Project
                      │
                      ▼
              PostgreSQL/Prisma
````

---

# 🎨 Application Workflow

## 1. Describe Your Application

Users enter a natural-language prompt into the BuilderTerk chat interface.

Example:

```text
Build a task management application with:

- task categories
- priority labels
- drag and drop
- dark mode
- analytics
- responsive design
```

Users can also attach an image or screenshot as a design reference.

---

## 2. AI Generates the Application

BuilderTerk sends the conversation and optional image information to the Gemini API.

The AI is instructed to return structured JSON containing:

```json
{
  "assistantMessage": "Application generated successfully.",
  "title": "Task Manager",
  "files": {
    "/App.js": {
      "code": "..."
    }
  },
  "dependencies": {
    "lucide-react": "latest",
    "date-fns": "latest"
  }
}
```

The application validates the response before displaying it.

---

## 3. Live Preview

Generated files are loaded into **CodeSandbox Sandpack**.

The workspace provides two primary views:

```text
┌─────────────────────────────────────────────┐
│              BuilderTerk Workspace          │
├──────────────┬──────────────────────────────┤
│              │                              │
│    Chat      │       Live Preview           │
│              │                              │
│    Prompt    │       Generated App         │
│      +       │                              │
│   Messages   │                              │
│              │                              │
├──────────────┴──────────────────────────────┤
│ Code │ Preview │ Download │ Improve with AI │
└─────────────────────────────────────────────┘
```

Users can switch between:

* **Preview**
* **Code**

The code panel also provides:

* File explorer
* Code editor
* Line numbers
* Inline errors
* Generated files
* Download functionality

---

# 🤖 AI Code Generation

BuilderTerk uses the Google Gemini API through:

```text
@google/genai
```

The primary generation endpoint is:

```http
POST /api/gen-ai-code
```

The endpoint performs several operations.

### Request Validation

The API validates:

* Authentication
* Request JSON
* Message structure
* Message count
* Message length
* File data
* File data size

The current implementation limits the conversation to a maximum of 50 messages and individual message size to 12,000 characters.

---

## Structured AI Response

Gemini is instructed to return:

```text
assistantMessage
title
files
dependencies
```

Each generated file follows a structure similar to:

```json
{
  "/App.js": {
    "code": "..."
  }
}
```

Dependencies are returned as:

```json
{
  "lucide-react": "latest",
  "date-fns": "latest"
}
```

---

# 📦 Smart Dependency Validation

AI-generated applications may sometimes contain packages that do not exist.

BuilderTerk validates generated npm dependencies against the npm registry before saving them.

```text
Gemini
  │
  ▼
Generated Dependencies
  │
  ▼
npm Registry Validation
  │
  ├── Valid Package ────────► Keep
  │
  └── Invalid Package ──────► Remove
```

This helps reduce problems caused by hallucinated package names.

---

# 🖼️ Image-Aware AI Prompts

BuilderTerk allows users to attach screenshots or images to their prompts.

The uploaded image is stored using **Supabase Storage**.

Files are organized using a path similar to:

```text
userId/workspaceId/timestamp.extension
```

The storage bucket used by the application is:

```text
workspace-images
```

The resulting public URL is included with the generation request so Gemini can use the image as a design reference.

This allows prompts such as:

```text
"Build a dashboard that looks like this screenshot."
```

---

# 🐛 AI Error Recovery

BuilderTerk monitors the Sandpack preview for runtime and compilation errors.

When an error occurs, the interface displays a **Fix with AI** action.

```text
Generated Application
        │
        ▼
   Sandpack Preview
        │
        ▼
   Runtime Error
        │
        ▼
  "Fix with AI"
        │
        ▼
    Gemini AI
        │
        ▼
Updated React Files
        │
        ▼
   Live Preview
```

The preview error is sent back through the normal generation flow and Gemini generates an updated version of the application.

---

# 🧠 Improve with AI

BuilderTerk also provides an AI-powered application improvement workflow.

Users can request changes such as:

```text
Add a sidebar navigation.

Make the dashboard responsive.

Add animations to the cards.

Improve the color scheme.

Add a search feature.
```

The improvement endpoint is:

```http
POST /api/improve
```

The endpoint receives:

* User request
* Workspace ID
* Current generated files
* Dependencies
* Authenticated user

Gemini returns the complete updated file contents.

The UI receives updates through **Server-Sent Events (SSE)** and applies the returned file changes to the Sandpack environment.

---

## ⚠️ Important Implementation Note

The current repository's `/api/improve` implementation uses **Google Gemini directly** for the improvement workflow.

The UI uses labels such as:

```text
Improve with Agent
Cline is thinking...
```

but the current repository does **not** include `@cline/sdk` as a package dependency and the current improvement route imports `GoogleGenAI`.

Therefore, this README intentionally describes the feature as an **AI-powered improvement/agent-style workflow**, rather than claiming that the current implementation is powered by the Cline SDK.

---

# ⚡ Streaming AI Responses

BuilderTerk uses **Server-Sent Events (SSE)** for AI generation and improvement flows.

Generation events can communicate statuses such as:

```text
Starting generation...
Thinking...
Generating files...
Validating packages...
Saving...
Done
```

The client reads the streaming response and updates the interface in real time.

```text
Gemini
  │
  │ SSE
  ▼
Next.js API
  │
  │ SSE
  ▼
Workspace Client
  │
  ├── Status Updates
  ├── Generated Files
  ├── Credits
  └── Completion
```

This provides a more interactive experience than waiting for one large response.

---

# 💳 Credit & Subscription System

BuilderTerk uses a credit-based generation model.

## Plans

| Plan       | Credits | Price |
| ---------- | ------: | ----: |
| 🆓 Free    |      10 |    $0 |
| 🚀 Starter |      50 |    $9 |
| 💎 Pro     |     150 |   $29 |

Each AI generation consumes:

```text
1 Credit
```

AI improvement operations also consume one credit.

---

## Credit Flow

```text
User
 │
 ▼
Check Authentication
 │
 ▼
Check Current Plan
 │
 ▼
Check Available Credits
 │
 ├── No Credits ──────► 402
 │
 ▼
Generate Application
 │
 ▼
Save Workspace
 │
 ▼
Deduct Credit
 │
 ▼
Return Remaining Credits
```

The credit deduction is performed transactionally with workspace persistence to reduce the risk of concurrent requests overspending credits.

---

# 👤 Authentication

BuilderTerk uses **Clerk** for authentication.

Authentication provides:

* Sign in
* Sign up
* Google authentication support through Clerk configuration
* User sessions
* User profile information
* Plan detection
* Protected routes

The project uses Clerk middleware through:

```text
src/proxy.ts
```

API routes are also protected independently.

---

# 🔐 Authorization

Authentication alone is not considered sufficient.

BuilderTerk performs server-side ownership checks before accessing workspaces.

For example:

```text
Browser
   │
   │ workspaceId
   ▼
Server
   │
   ├── Authenticate user
   │
   ├── Identify local user
   │
   ├── Verify workspace owner
   │
   └── Allow / Reject
```

The server never blindly trusts a workspace ID received from the browser.

---

# 🛡️ Security with Arcjet

BuilderTerk integrates **Arcjet** for application security.

The AI generation route uses Arcjet for:

* Rate limiting
* Prompt injection detection
* Per-user request characteristics

The current route-level token bucket is configured around the authenticated Clerk user.

```text
User
 │
 ▼
Arcjet
 │
 ├── Rate Limit
 │
 ├── Prompt Injection Detection
 │
 └── Security Decision
       │
       ├── Allowed ─────► Gemini
       │
       └── Denied ──────► 429
```

This helps protect the AI endpoints from abusive or malicious requests.

---

# 🗄️ Database

BuilderTerk uses:

```text
PostgreSQL
      +
Prisma ORM
```

The project uses Prisma's PostgreSQL adapter:

```text
@prisma/adapter-pg
```

The database connection is configured using:

```env
DATABASE_URL=
```

---

# 🧬 Database Schema

## User

The `User` model stores application-level user information.

```text
User
├── id
├── clerkId
├── name
├── email
├── imageUrl
├── credits
├── plan
├── createdAt
└── updatedAt
```

Important fields:

### `clerkId`

Connects the local database user to the Clerk identity.

### `credits`

Stores the remaining AI generation/improvement credits.

### `plan`

Stores the current subscription tier:

```text
free
starter
pro
```

---

# 📁 Workspace

The `WorkSpace` model stores generated projects.

```text
WorkSpace
├── id
├── title
├── userId
├── messages
├── fileData
├── createdAt
└── updatedAt
```

### `messages`

Stores the persistent AI conversation as JSON.

### `fileData`

Stores generated application information including:

```text
files
dependencies
title
```

Using JSON allows the application to persist flexible generated project structures.

---

# ☁️ Supabase Storage

Supabase is used for image storage.

The application uploads user-provided images to:

```text
workspace-images
```

The database itself is accessed through Prisma/PostgreSQL.

Therefore the architecture is:

```text
                    BuilderTerk
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
     PostgreSQL                  Supabase Storage
          │                           │
          ▼                           ▼
       Prisma                    Uploaded Images
          │
          ▼
 User + Workspace Data
```

---

# 🖥️ Live Code Environment

BuilderTerk uses:

```text
@codesandbox/sandpack-react
```

for the generated application environment.

The workspace uses:

* `SandpackProvider`
* `SandpackLayout`
* `SandpackPreview`
* `SandpackCodeEditor`
* `SandpackFileExplorer`

The application also uses the Dracula Sandpack theme.

---

# 📂 Generated Project Structure

A generated application contains files such as:

```text
Generated App
│
├── App.js
├── components/
│   ├── ...
│   └── ...
│
├── package dependencies
└── other generated files
```

BuilderTerk combines generated dependencies with a set of base dependencies that commonly support generated React applications.

---

# 📦 Export to ZIP

Users can download their generated application as a ZIP file.

The export system uses:

```text
JSZip
```

The downloaded project includes:

```text
project/
│
├── package.json
├── public/
│   └── index.html
│
├── src/
│   ├── index.js
│   └── generated files
│
└── README.md
```

The generated project includes a runnable React setup.

Example:

```bash
npm install
npm start
```

---

# 📊 Projects Dashboard

BuilderTerk provides a projects page where authenticated users can view previously generated applications.

The projects page displays information such as:

* Project title
* First user prompt
* Message count
* Last updated time

Users can also:

* Open existing projects
* Create a new project
* Delete projects

The project history is persisted in PostgreSQL.

---

# 🏗️ Application Architecture

```text
BuilderTerk
│
├── Next.js App Router
│
├── Authentication
│   └── Clerk
│
├── Frontend
│   ├── React
│   ├── TypeScript
│   ├── Tailwind CSS
│   ├── shadcn/ui
│   └── Lucide React
│
├── AI
│   ├── Google Gemini
│   ├── Code Generation
│   ├── AI Improvement
│   └── AI Error Fixing
│
├── Code Environment
│   └── Sandpack
│
├── Backend
│   ├── Route Handlers
│   ├── Server Actions
│   └── SSE Streaming
│
├── Security
│   ├── Clerk
│   ├── Arcjet
│   ├── Rate Limiting
│   └── Prompt Injection Detection
│
├── Database
│   ├── PostgreSQL
│   └── Prisma
│
└── Storage
    └── Supabase Storage
```

---

# 📂 Project Structure

The current repository follows a `src`-based Next.js architecture.

```text
BuilderTerk/
│
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── public/
│
├── src/
│   │
│   ├── actions/
│   │   ├── projects.ts
│   │   └── workspace.ts
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (main)/
│   │   │   ├── project/
│   │   │   ├── workspace/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── gen-ai-code/
│   │   │   │   └── route.ts
│   │   │   │
│   │   │   └── improve/
│   │   │       └── route.ts
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── animate-ui/
│   │   ├── ui/
│   │   ├── ChatPanal.tsx
│   │   ├── CodePanal.tsx
│   │   ├── DeleteProjectModal.tsx
│   │   ├── Header.tsx
│   │   ├── MobileBlocker.tsx
│   │   ├── PricingModal.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── WorkspaceClient.tsx
│   │   ├── WsC.tsx
│   │   └── theme-provider.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── arcjet.ts
│   │   ├── checkUser.ts
│   │   ├── constants.ts
│   │   ├── data.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   │
│   ├── types/
│   │
│   └── proxy.ts
│
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

# 🔌 API Endpoints

## AI Code Generation

```http
POST /api/gen-ai-code
```

### Responsibilities

* Authenticate the user
* Validate request payload
* Check available credits
* Run Arcjet protection
* Detect prompt injection
* Send prompt to Gemini
* Stream generation status
* Parse structured AI output
* Validate npm dependencies
* Create/update workspace
* Deduct credits
* Return generated files

---

# 🔧 AI Improvement

```http
POST /api/improve
```

### Responsibilities

* Authenticate the user
* Validate request size
* Verify workspace ownership
* Verify Pro plan
* Check credits
* Run Arcjet protection
* Send existing files to Gemini
* Generate updated file contents
* Update workspace
* Deduct credits
* Stream updated file information

---

# 🗂️ Server Actions

BuilderTerk also uses Next.js Server Actions.

## Project Actions

```text
src/actions/projects.ts
```

Responsibilities include:

* Fetch user projects
* Generate project summaries
* Count messages
* Extract first user prompt
* Delete projects
* Verify authenticated user

---

## Workspace Actions

```text
src/actions/workspace.ts
```

Responsibilities include:

* Retrieve authenticated workspace user
* Load workspace by ID
* Verify workspace ownership
* Prevent unauthorized workspace access

---

# 🔄 AI Generation Data Flow

```text
User Prompt
    │
    ▼
ChatPanel
    │
    ▼
WorkspaceClient
    │
    ▼
POST /api/gen-ai-code
    │
    ▼
Clerk Authentication
    │
    ▼
Arcjet Security
    │
    ├── Rate Limit
    └── Prompt Injection Detection
    │
    ▼
Credit Check
    │
    ▼
Gemini
    │
    ▼
Structured JSON
    │
    ▼
Parse Response
    │
    ▼
Validate npm Dependencies
    │
    ▼
Create / Update Workspace
    │
    ▼
Deduct Credit
    │
    ▼
SSE Response
    │
    ▼
WorkspaceClient
    │
    ├── Update Chat
    ├── Update Credits
    ├── Update Files
    └── Update Sandpack
```

---

# 🔄 AI Improvement Data Flow

```text
User Request
     │
     ▼
"Improve with Agent"
     │
     ▼
POST /api/improve
     │
     ▼
Authenticate
     │
     ▼
Verify Pro Plan
     │
     ▼
Check Credits
     │
     ▼
Arcjet Protection
     │
     ▼
Gemini
     │
     ▼
Updated Files
     │
     ▼
SSE file_patch Events
     │
     ▼
Sandpack updateFile()
     │
     ▼
Live Preview Updates
```

---

# 🛡️ Security Architecture

BuilderTerk uses defense-in-depth security.

### Authentication

```text
Clerk
```

### Middleware

```text
src/proxy.ts
```

### API Authentication

API routes independently verify the authenticated Clerk user.

### Ownership Validation

Workspace queries use the authenticated user's database identity.

### Rate Limiting

Arcjet provides per-user token-bucket protection.

### Prompt Injection Protection

Arcjet checks AI prompts before they are sent to Gemini.

### Request Size Limits

AI endpoints enforce limits on:

* Message length
* Number of messages
* Uploaded/generated file data
* Improvement request size

---

# 🎨 UI & Design

BuilderTerk uses a modern dark developer-tool interface.

The interface is built using:

* Tailwind CSS
* shadcn/ui
* Lucide React
* Motion
* Sonner
* Custom reusable components

The workspace uses a split layout:

```text
┌──────────────────────────────────────────────────┐
│                    Header                        │
├──────────────────┬───────────────────────────────┤
│                  │                               │
│                  │                               │
│   Chat Panel     │       Code / Preview          │
│                  │                               │
│   AI Messages    │       Generated App           │
│                  │                               │
│   Prompt Input   │       Sandpack                │
│                  │                               │
└──────────────────┴───────────────────────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| **Next.js 16**     | Full-stack React framework |
| **React 19**       | UI development             |
| **TypeScript**     | Type safety                |
| **Tailwind CSS 4** | Styling                    |
| **shadcn/ui**      | Reusable UI components     |
| **Lucide React**   | Icons                      |
| **Motion**         | UI animations              |
| **Sonner**         | Toast notifications        |

---

## AI & Developer Tools

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **Google Gemini**  | AI code generation              |
| **@google/genai**  | Gemini API integration          |
| **Sandpack**       | Live code execution and preview |
| **JSZip**          | ZIP project export              |
| **React Markdown** | Render AI responses             |

---

## Backend

| Technology                 | Purpose                            |
| -------------------------- | ---------------------------------- |
| **Next.js Route Handlers** | API endpoints                      |
| **Server Actions**         | Server-side application operations |
| **SSE**                    | Streaming AI events                |
| **Prisma**                 | ORM                                |
| **PostgreSQL**             | Database                           |

---

## Authentication & Security

| Technology | Purpose                          |
| ---------- | -------------------------------- |
| **Clerk**  | Authentication and subscriptions |
| **Arcjet** | Rate limiting and AI security    |

---

## Storage

| Technology           | Purpose                   |
| -------------------- | ------------------------- |
| **Supabase Storage** | Uploaded workspace images |

---

# ⚙️ Environment Variables

Create a `.env.local` file in the project root.

```env
# =========================================
# Database
# =========================================

DATABASE_URL=your_postgresql_connection_string


# =========================================
# Clerk
# =========================================

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up


# =========================================
# Google Gemini
# =========================================

GEMINI_API_KEY=your_gemini_api_key

GEMINI_MODEL=your_gemini_model


# =========================================
# Supabase Storage
# =========================================

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


# =========================================
# Arcjet
# =========================================

ARCJET_KEY=your_arcjet_key
```

> Never commit `.env.local` or real API keys to GitHub.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL database
* Clerk application
* Google Gemini API key
* Supabase project
* Arcjet account/key

---

## 1. Clone the Repository

```bash
git clone https://github.com/shivamgupta951/BuilderTerk.git
```

```bash
cd BuilderTerk
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create:

```text
.env.local
```

Add all required credentials.

---

## 4. Generate Prisma Client

```bash
npx prisma generate
```

---

## 5. Apply Database Schema

```bash
npx prisma db push
```

Or use Prisma migrations when appropriate:

```bash
npx prisma migrate dev
```

---

## 6. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🧪 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Build production application |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint                   |

---

# 🏭 Production Build

Before deploying:

```bash
npm run build
```

Then:

```bash
npm run start
```

---

# 🚀 Deployment Checklist

Before deploying BuilderTerk:

### Environment

* [ ] Configure production `DATABASE_URL`
* [ ] Configure Clerk production keys
* [ ] Configure Gemini API key
* [ ] Configure Supabase URL
* [ ] Configure Supabase anonymous key
* [ ] Configure Arcjet key

### Authentication

* [ ] Configure Clerk sign-in URL
* [ ] Configure Clerk sign-up URL
* [ ] Configure production authentication settings
* [ ] Test authenticated routes

### Database

* [ ] Generate Prisma client
* [ ] Apply production database schema
* [ ] Verify database connection

### Supabase

* [ ] Create `workspace-images` storage bucket
* [ ] Configure appropriate storage access
* [ ] Test image upload

### AI

* [ ] Test AI generation
* [ ] Test streaming response
* [ ] Test dependency validation
* [ ] Test AI error fixing
* [ ] Test AI improvement

### Security

* [ ] Configure Arcjet
* [ ] Test rate limiting
* [ ] Test prompt-injection protection
* [ ] Verify workspace ownership checks

### Production

* [ ] Run production build
* [ ] Test project creation
* [ ] Test project deletion
* [ ] Test ZIP export
* [ ] Test credit deduction
* [ ] Test subscription plan detection

---

# 📈 Engineering Highlights

BuilderTerk demonstrates several production-oriented engineering concepts.

### Full-Stack Next.js

The application uses Next.js for both frontend and backend functionality.

### AI Integration

Gemini is integrated into multiple workflows:

```text
Prompt → Generate App
Error  → Fix App
Request → Improve App
```

### Streaming

AI responses are streamed using Server-Sent Events instead of waiting for a single completed response.

### Database Persistence

Generated projects and conversations are persisted using PostgreSQL and Prisma.

### Authentication

Clerk handles user identity and plan information.

### Authorization

Workspace ownership is verified on the server.

### Security

Arcjet provides request protection and prompt-injection detection.

### Live Code Execution

Sandpack renders generated React applications directly inside the browser.

### Project Export

JSZip creates downloadable project archives.

---

# 🧠 Example User Journey

```text
1. User signs in
        │
        ▼
2. User receives free credits
        │
        ▼
3. User enters:
   "Build a weather dashboard"
        │
        ▼
4. Gemini generates React files
        │
        ▼
5. Dependencies are validated
        │
        ▼
6. Project is saved
        │
        ▼
7. Sandpack renders the application
        │
        ▼
8. User sees live preview
        │
        ▼
9. User finds a UI issue
        │
        ▼
10. User asks AI to improve it
        │
        ▼
11. Gemini updates the files
        │
        ▼
12. Sandpack updates the preview
        │
        ▼
13. User downloads the project
```

---

# 🔮 Future Improvements

Potential future improvements include:

* 🔄 Real-time collaborative editing
* 🧠 More advanced autonomous coding agents
* 🧪 Automated generated-app testing
* 🌐 One-click deployment
* 🔗 Custom project sharing links
* 👥 Team workspaces
* 🗃️ Project version history
* 🔐 More granular permissions
* 📊 AI generation analytics
* 🧩 More generated project templates
* 🖥️ Better mobile workspace support
* 💾 Persistent code editing
* 🧪 Automated preview validation
* ⚡ More advanced AI streaming
* 📦 Improved exported project templates

---

# 📚 Learning Resources

This project was developed while following and adapting concepts from a full-stack AI app-builder tutorial covering:

* Next.js
* shadcn/ui
* Clerk
* PostgreSQL
* Arcjet
* AI code generation
* Workspace architecture
* Sandpack
* Subscription systems
* AI error handling
* Image prompts
* ZIP export
* AI-powered improvements

Tutorial:

```text
https://youtu.be/UUK93oW0SaA
```

The project was adapted and extended to fit the current BuilderTerk implementation.

---

# 📌 Project Status

BuilderTerk is an actively developed AI application-builder project.

Current core functionality includes:

```text
✅ Authentication
✅ AI code generation
✅ Streaming generation
✅ Live preview
✅ Code viewer
✅ Image prompts
✅ Project persistence
✅ Credit system
✅ Subscription-aware UI
✅ AI error fixing
✅ AI application improvement
✅ ZIP export
✅ Supabase image storage
✅ Arcjet protection
✅ PostgreSQL + Prisma
```

---

# 👨‍💻 Author

**Shivam Gupta**

GitHub:

```text
https://github.com/shivamgupta951
```

Project:

```text
https://github.com/shivamgupta951/BuilderTerk
```

---

<div align="center">

# ⚡ BuilderTerk

### Describe it. Generate it. Preview it. Improve it.

**AI • React • Next.js • Gemini • Sandpack • Prisma • PostgreSQL**

⭐ If you found this project useful, consider starring the repository.

</div>
```
