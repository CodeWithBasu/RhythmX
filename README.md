# 🎵 RhythmX — Premium Audio Visualizer App

![App Icon](/public/icon-192x192.png)

RhythmX is a high-performance, real-time music visualizer and Progressive Web App (PWA) built with **Next.js 16 (Canary)**, **MongoDB Atlas**, and the **Web Audio API**. It delivers a premium, immersive listening experience with fluid, responsive wave animations, server-cached audio streaming, and cloud-synced playlists.

## 🚀 Key Features

- **Progressive Web App (PWA)**: Install RhythmX directly to your iOS or Android home screen, or as a desktop app, complete with a custom app icon and offline-ready standalone UI.
- **Real-time Wave Visualizer**: Dynamic audio analysis with smooth, organic wave animations that adapt mathematically to your device's screen size (Desktop, Tablet, or Mobile).
- **High-Speed Audio Streaming**: Utilizes a custom `/api/songs/[id]/stream` endpoint with an advanced LRU Memory Cache to stream binary audio instantly, minimizing base64 decoding delays and eliminating UI freezes.
- **Cloud-Managed Playlist**: Automatically synced music library powered by MongoDB Atlas. Add songs directly via URL or local file upload.
- **Secure Admin Dashboard**: A protected `/admin` route requiring a master password to manage, delete, and monitor your cloud MongoDB music database securely.
- **Professional UI**: Minimalist, dark-mode design with smooth `framer-motion` transitions, `lucide-react` icons, and elastic sliders for track seeking.

---

## 📱 Responsive & Adaptive Design

RhythmX monitors the viewport in real-time, instantly adjusting the complexity of the Web Audio API visualizer:

- **Mobile Phone**: 32 rendered visualization bars (4px width).
- **Tablet**: 56 rendered visualization bars (6px width).
- **Desktop**: 80 rendered visualization bars (8px width).

---

## 🏗️ System Architecture

RhythmX follows a modern, serverless-first architecture optimized for performance and reliability.

```mermaid
graph TD
    User((User))

    subgraph "Frontend (PWA & Next.js)"
        UI["Responsive React UI"]
        Visualizer["Web Audio API Engine"]
        State["Hooks & Framer Motion"]
    end

    subgraph "Backend (Next.js Edge API)"
        MetaAPI["GET/POST /api/songs"]
        StreamAPI["GET /api/songs/[id]/stream"]
        AuthAPI["POST /api/admin/auth"]
        LRUCache["In-Memory LRU Cache"]
        MongoClient["MongoDB Native Driver"]
    end

    subgraph "Database (Cloud)"
        Atlas[("MongoDB Atlas Cluster")]
    end

    User --> UI
    UI --> Visualizer
    UI --> MetaAPI
    Visualizer --> StreamAPI
    UI --> AuthAPI
    MetaAPI --> MongoClient
    StreamAPI --> LRUCache
    LRUCache --> MongoClient
    MongoClient --> Atlas
```

### ⚙️ Workflow Details

1.  **Request Flow**: Upon opening the app, the frontend sends a `GET /api/songs` request for track metadata instantly (stripped of heavy audio payload).
2.  **Streaming & Caching**: When a user clicks play, the visualizer requests the audio stream. The server checks its RAM (LRU Cache). If it's a cache miss, it streams from MongoDB, caches it locally, and sends binary chunks to the active browser context.
3.  **Visualization**: This frequency data is mapped to framer-motion properties to create the signature wave effect.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Styling**: Vanilla CSS, Tailwind CSS & Framer Motion
- **Database**: MongoDB Atlas (Native Node Driver)
- **State & Logic**: Custom React Hooks & Web Audio API
- **Cache**: `lru-cache`
- **Deployment**: Vercel

---

## 📦 Getting Started

### 1. Prerequisites

- Node.js 18+
- A MongoDB Atlas Connection String

### 2. Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/CodeWithBasu/RhythmX.git
cd RhythmX
npm install
```

### 3. Environment Variables

Create a `.env` file in the root. You must configure your secure admin password.

```env
DATABASE_URL="your_mongodb_atlas_connection_string"
ADMIN_PASSWORD="your_secure_password"
```

### 4. Seed the Database (Optional)

Push the initial song list to your MongoDB cluster:

```bash
npx tsx scripts/seed.ts
```

### 5. Run the Project

```bash
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by [CodeWithBasu](https://github.com/CodeWithBasu)
