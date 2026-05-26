# 🚀 DevSync IDE — Real-Time Collaborative Workspace

DevSync is a high-performance, multi-server collaborative development environment engineered for modern developer workflows. Moving away from shallow, text-sharing clones, DevSync pairs real-time multi-user editing with an AST-guided inline AI engine and isolated code compilation environments. The system utilizes a decoupled micro-architecture to isolate volatile code runtimes and websocket connection matrices from your primary frontend layouts.

---

## ✨ Core Engineering Features

* **⚡ Zero-Collision Workspace Synchronization:** Powered by a Node.js and Socket.io event loop, broadcasting live code diff arrays, editor focus states, and instant room presence updates.
* **🤖 Context-Aware Inline AI Streaming:** A custom Gemini-powered assistant integrated natively into the core text array. Triggered right at the cursor position via specialized editor shortcuts to stream code generations directly into context wrappers.
* **🔒 Seamless Passwordless Authentication:** Integrated NextAuth (Auth.js) v5 ecosystem utilizing the `@auth/mongodb-adapter` pool. Handles user registration and daily logins seamlessly via Google OAuth or secure Magic Links without manual schema management.
* **💾 Memory-Cached Persistence Layer:** Active project state configurations are cached in-memory on the communication server for zero-lag emission loops and automatically flushed to MongoDB Atlas when workspaces become empty.
* **🎨 High-Fidelity Multi-Pane Layout:** A premium, dark-themed interface built on Tailwind CSS featuring micro-interactions and atomic dashboard panels.

---

## 📂 Repository File Blueprint

```text
src/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  └─ [...nextauth]/
│  │  │     └─ route.js        <-- Unified NextAuth v5 Gateway Configurations
│  │  └─ gemini-inline/
│  │     └─ route.js        <-- Gemini Streaming API Processing Pipeline
│  ├─ daashboard/
│  │  └─ page.js            <-- Workspace Management Console
│  ├─ room/
│  │  └─ [roomID]/
│  │     └─ page.js         <-- Core Multi-Pane IDE Application Root
│  ├─ globals.css           <-- Tailwind Directives & Custom Scrollbars
│  ├─ layout.js             <-- AuthProvider Application Root Wrapper
│  └─ page.js               <-- High-Converting Developer Landing Page
├─ components/
│  ├─ AuthProvider.js       <-- NextAuth Client Context Session Wrapper
│  ├─ ChatPanel.js          <-- Workspace Presence Chat Communication Panel
│  ├─ EditorContainer.js    <-- Context-Linked Code Workspace Wrapper
│  └─ TerminalPanel.js      <-- Execution Stream Logging Shell View
├─ lib/
│  └─ mongodb.js            <-- Cached MongoDB Connection Pool Driver
└─ .env.local               <-- Secure Client Environment Configurations

 Technology StackLayerTechnologies UtilizedFrontend FrameworkNext.js 15 (App Router Architecture), ReactInterface & StylingTailwind CSS, Lucide Icons, Custom Minimal ViewportsReal-Time LayerSocket.io (Client / Server Event Matrices)Authentication EngineNextAuth.js v5 (Auth.js Provider Arrays)Database PoolMongoDB Atlas Cloud Clusters, Node Native Memory Cache🚀 Installation & System Setup1. Repository InitializationsClone your frontend components and standalone socket backend clusters into separate operation folders.2. Environment ConfigurationsConfigure the connection tokens inside your specific operational runtimes:Frontend Environment (/devsync-frontend/.env.local):Code snippetNEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_32_byte_openssl_secret_string
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/devsync_db
GOOGLE_CLIENT_ID=your_google_cloud_developer_client_id
GOOGLE_CLIENT_SECRET=your_google_cloud_developer_client_secret
EMAIL_SERVER_PASSWORD=your_resend_smtp_api_key_string
EMAIL_FROM=onboarding@resend.dev
Backend Communication Server Environment (/devsync-backend/.env):Code snippetPORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/devsync_db
FRONTEND_URL=http://localhost:3000
3. Running the Operational ServersStart the Next.js Frontend Framework Platform:Bashcd devsync-frontend
npm install
npm run dev
Start the Independent WebSocket Engine Layer:Bashcd devsync-backend
npm install
node server.js
Open http://localhost:3000 inside your browser windows to test structural execution syncing across active tabs.