#  CodeSync — Real-Time Collaborative Code Editor

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?logo=socket.io)](https://socket.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

CodeSync is a fast, lightweight, and real-time collaborative code editor. It allows multiple users to join a shared room and write code simultaneously with live visibility of other users' cursors and actions. 

This repository contains both the Frontend (Client) and Backend (Server) in a single monorepo structure.

 Live Demo:
- **Frontend (Netlify):** https://code-editor1234.netlify.app

##  Key Features

- Real-Time Collaboration: Instant code synchronization across all clients in a room using WebSockets.
- Live Cursor Tracking: See exactly where other developers are typing with color-coded cursors and name tags.
- Monaco Editor Integration: VS Code-like editing experience with syntax highlighting, auto-completion, and minimap.
- Multi-Language Support: Write in 10 different languages including JavaScript, TypeScript, Python, Java, C++, Go, Rust, HTML, CSS, and JSON.
- Smart Room Management: Auto-cleanup of stale and empty rooms to optimize server memory.
- Built-in Rate Limiting: Custom HTTP and WebSocket rate limiters to prevent spam and ensure stable performance.
- Modern UI/UX: Dark-mode by default, minimalist design, and smooth animations using Tailwind CSS v4.


##  Tech Stack

### Client (Frontend)
- Framework: Next.js 16 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v4
- Editor: @monaco-editor/react
- Real-time: socket.io-client
- Package Manager: pnpm
- Deployment: Netlify

### Server (Backend)
- Runtime: Node.js
- Framework: Express.js 5
- Real-time: Socket.io
- Language: TypeScript
- Security: Custom Memory-based Rate Limiter, CORS
- Deployment: Render


##  Project Structure

```text
.
├── client/                    # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │   └── types/
│   └── package.json
│
└── server/                    # Express + Socket.io Backend
    ├── src/
    │   ├── middleware/
    │   ├── routes/
    │   ├── socket/
    │   ├── types/
    └── package.json
```
## Repository Layout

```text
client/   → Next.js Frontend
server/   → Express + Socket.io Backend
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before getting started, make sure you have the following installed:

- Node.js (v18 or later recommended)
- npm (for the backend)
- pnpm (for the frontend)

### 1. Clone the Repository

```bash
git clone https://github.com/Reza97312/collaborative-code-editor.git
cd collaborative-code-editor
```

### 2. Setup Backend (Server)

Navigate to the server directory and install the required dependencies:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=4000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend development server:

```bash
npm run dev
```

The API server will be available at:

```text
http://localhost:4000
```

### 3. Setup Frontend (Client)

Open a new terminal and navigate to the client directory:

```bash
cd client
pnpm install
```

Create a `.env` file inside the `client` directory:

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
```

Start the frontend development server:

```bash
pnpm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## WebSocket Events Architecture

The real-time collaboration engine is powered by a strongly typed Socket.io implementation. Below is an overview of the primary events exchanged between the client and server.

| Event | Description |
|-------|-------------|
| `join-room` | Client joins a room using a Room ID and username. |
| `room-state` | Sends the current room state, including code, language, and connected users. |
| `code-change` / `code-updated` | Synchronizes code changes across all connected clients in real time. |
| `cursor-move` / `cursor-updated` | Synchronizes remote cursor positions (line and column) for collaborative editing. |
| `language-change` | Updates the selected programming language for every participant in the room. |
