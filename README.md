# 🚀 DevSync IDE

> Real-Time Collaborative Development Workspace with AI-Assisted Coding

DevSync IDE is a modern collaborative coding platform engineered for high-performance developer workflows.  
It combines real-time multi-user synchronization, inline AI-assisted coding, isolated execution environments, and secure authentication into a scalable microservice-based architecture.

Built using Next.js, Socket.io, MongoDB Atlas, and Gemini AI.

---

# ✨ Features

## ⚡ Real-Time Collaboration

- Live multi-user code synchronization
- Instant cursor and workspace updates
- Room-based collaborative sessions
- Socket.io powered websocket communication

---

## 🤖 AI-Powered Inline Assistant

- Gemini AI integrated directly into the editor
- Context-aware code generation
- Cursor-position streaming completions
- Inline prompt execution support

---

## 🔒 Secure Authentication

- Google OAuth authentication
- Passwordless Magic Link login
- Auth.js (NextAuth v5) integration
- MongoDB adapter session persistence

---

## 💾 Intelligent Persistence Layer

- In-memory active workspace caching
- Automatic MongoDB synchronization
- Reduced database write operations
- Optimized workspace restoration

---

## 🎨 Premium Developer Experience

- VS Code inspired multi-pane interface
- Monaco Editor integration
- Interactive terminal panel
- Modern dark-themed UI with Tailwind CSS

---

# 🏗️ Architecture Overview

DevSync follows a decoupled architecture:

```text
Frontend (Next.js)
        │
        ▼
Socket.io Communication Layer
        │
        ▼
Execution Runtime Server
        │
        ▼
MongoDB Atlas Persistence Layer
```

This separation ensures:

- Independent websocket scaling
- Isolated runtime execution
- Better fault tolerance
- Improved performance

---

# 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 15+, React, Tailwind CSS |
| Editor | Monaco Editor |
| Realtime Engine | Socket.io |
| Authentication | Auth.js / NextAuth v5 |
| Database | MongoDB Atlas |
| AI Integration | Gemini API |
| Styling | Tailwind CSS + Lucide Icons |
| Runtime Execution | Docker-based isolated sandboxes |

---

# 📂 Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.js
│   │   │
│   │   └── gemini-inline/
│   │       └── route.js
│   │
│   ├── dashboard/
│   │   └── page.js
│   │
│   ├── room/
│   │   └── [roomId]/
│   │       └── page.js
│   │
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── AuthProvider.js
│   ├── ChatPanel.js
│   ├── EditorContainer.js
│   └── TerminalPanel.js
│
├── lib/
│   └── mongodb.js
│
└── .env.local
```

---

# ⚙️ Environment Setup

## Frontend Environment (`.env.local`)

```env
NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=your_generated_secret

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devsync_db

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

EMAIL_SERVER_PASSWORD=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

GEMINI_API_KEY=your_gemini_api_key
```

---

## Backend Environment (`/backend/.env`)

```env
PORT=5000

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/devsync_db

FRONTEND_URL=http://localhost:3000
```

---

# 🚀 Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/your-username/devsync-ide.git
```

---

## 2. Install Frontend Dependencies

```bash
cd devsync-frontend
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../devsync-backend
npm install
```

---

# ▶️ Running the Application

## Start Frontend

```bash
cd devsync-frontend
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Start Socket Backend

```bash
cd devsync-backend
node server.js
```

Backend websocket server runs on:

```text
http://localhost:5000
```

---

# 🔌 Core Modules

## 🧠 AI Inline Engine

Features:

- Cursor-aware prompt injection
- Streaming token generation
- Contextual code suggestions
- Inline editor integration

---

## 🖥️ Collaborative Workspace

Features:

- Multi-user editing
- Shared runtime synchronization
- Presence indicators
- Live code broadcasting

---

## 🐳 Sandbox Runtime Layer

Features:

- Isolated execution containers
- Secure runtime compilation
- Multi-language support
- Streamed terminal logs

Supported Languages:

- JavaScript (Node.js)
- Python
- C++

---

# 🔐 Authentication Flow

DevSync uses Auth.js v5 with:

- Google OAuth Provider
- Magic Link Authentication
- MongoDB Session Adapter

Authentication state is globally managed through:

```text
AuthProvider.js
```

---

# 🎨 UI Highlights

- VS Code inspired interface
- Multi-pane responsive layout
- Animated micro-interactions
- Premium dark mode aesthetics
- Minimal developer-first workflow

---

# 📈 Future Enhancements

- Voice collaboration channels
- Shared debugging sessions
- GitHub repository synchronization
- Persistent project storage
- AI pair-programming mode
- Live deployment previews
- CRDT-based synchronization engine

---

# 🧪 Development Notes

| Tool | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Next.js | 15+ |
| MongoDB | Atlas Cloud |

---

# 🤝 Contributing

Contributions are welcome.

```bash
fork → create branch → commit → open pull request
```

---



# 👨‍💻 Author

Developed by Madhurima Panigrahi

### Areas of Interest

- Full Stack Development
- Real-Time Systems
- AI-Powered Developer Tools

---