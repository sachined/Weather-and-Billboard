# 🌸 Weather & Career Strategy Dashboard (Spring Edition)

A modern, high-performance web application built with **Next.js**, **TypeScript**, and **Chart.js**. Featuring a fresh **Spring Theme** as the main interface with easy toggling between display modes.

## 🚀 Key Features

### 🎨 Thematic Design System
- **Spring Theme (Default):** A fresh, green-accented aesthetic for a modern and approachable user experience.
- **Easy Toggling:** Smooth transitions between Spring, Midnight Slate, and Modern Minimalist modes via the global navigation.
- **Midnight Slate:** A deep, tech-oriented dark mode for low-light environments.
- **Modern Minimalist:** A clean, high-contrast light mode for maximum readability.

### 1. 📈 Technical Career Roadmap
- **Interactive Role Analysis:** Dynamic Radar Chart comparing core competencies across different technical roles (TAM, CSE, SE, Data Analyst).
- **Professional Pivot Narrative:** A detailed technical journey highlighting skills evolution and project impact (e.g., [Finsurf.net](https://finsurf.net)).
- **Private Action Checklist:** A secure, locally-persisted task tracker for professional development and networking.

### 2. 💼 Financial Growth Dashboard
- **Production-Grade Analytics:** Real-time market data fetching via `yahoo-finance2` with batched requests for performance.
- **Investment Philosophy:** A structured "Three-Layer" strategy (Anchor, Growth, Income) visualized through a minimalistic, glassmorphism UI.
- **Historical Appreciation:** 1-year performance tracking with capital appreciation metrics and "Smart History" data points.
- **Strategy Triggers:** Coded "Dip-Buy" logic based on specific retracement thresholds.

### 3. 🌤️ Weather Lookup
- **Global Search:** Fetch real-time weather conditions for any location worldwide via the OpenWeatherMap API.
- **Smart Geolocation:** Automatically attempts to load local weather on mount using the browser's Geolocation API.
- **Responsive UI:** Clean, theme-aware weather cards with temperature unit toggling.

## 🛠️ Tech Stack
- **Framework:** Next.js (Pages Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Global CSS Variables
- **Charts:** Chart.js
- **Icons:** FontAwesome
- **Deployment:** Optimized for Vercel

## 📁 Project Structure
- `/pages` - Next.js routes and API endpoints
- `/components` - Feature-based modular components
- `/hooks` - Custom hooks for business logic (Weather, Portfolio, Checklist)
- `/lib` - Centralized constants and professional data models
- `/private` - Secure storage for resumes and career notes (ignored by Git)
- `/styles` - Multi-theme design system with Spring, Midnight Slate, and Minimalist modes

## ⚙️ Setup
```bash
npm install
cp .env.example .env.local
npm run dev
```

## 🔐 Privacy & Security
- **Local Persistence:** Sensitive data like portfolio positions and career checklists are stored in `localStorage` rather than a remote database.
- **Serverless API:** Next.js API routes are used to secure external API keys and handle data aggregation.
- **Soft Privacy:** Administrative tools and checklists are only visible when running the site on `localhost`.

---
*Created by Sachin Nediyanchath*