# 🌸 Weather & Career Strategy Dashboard (Spring Edition)

A high-performance, professional portfolio and utility hub built with **Next.js**, **TypeScript**, and **Chart.js**. This project serves as a centralized dashboard for career roadmapping, financial growth tracking, and real-time data visualization.

## 🚀 Core Features

### 1. 📈 Technical Career Roadmap
- **Interactive Role Analysis**: A dynamic **Radar Chart** comparing core competencies across high-impact roles (AI Solutions Engineer, TAM, CSE, Data Analyst).
- **Professional Pivot Narrative**: A structured technical journey focusing on the "Last Mile of AI" and recent engineering evolutions (e.g., [Finsurf.net](https://finsurf.net)).
- **Action Checklist**: A private, locally-persisted task tracker for professional development, hidden behind a "Soft Privacy" layer.

### 2. ✍️ Professional Blog & Insights
- **Markdown-Driven Articles**: A technical blog system leveraging `gray-matter` and `remark` for high-performance Static Site Generation (SSG).
- **In-Depth Case Studies**: Detailed narratives on AI agent development, including the evolution of **WikiSurf**, **FinSurf**, and the challenges of token management and telemetry.

### 3. 💼 Financial Growth Dashboard
- **Real-Time Market Data**: Batched stock price fetching via the `yahoo-finance2` API for high-density performance tracking.
- **Smart History Algorithm**: A custom data-filtering system for the performance chart that prevents new stock additions from retroactively altering historical capital growth.
- **Speculative Filtering**: An "Exclude Research" toggle to separate high-risk research stocks from core portfolio metrics and visualizations.
- **Investment Architecture**: A minimalistic, "glassmorphism" UI categorizing holdings into Anchor, Growth, Income, and Research layers.

### 4. 🌤️ Weather Intelligence
- **Global Search & Geolocation**: Instant weather lookup for any location worldwide with silent geolocation fallback.
- **Theme-Aware UI**: Responsive weather cards that adapt their contrast and styling to the current theme mode.

## 🎨 Professional Design System

The project features a **Three-Mode Theme System** that is easily togglable via the global navigation:
- **Spring (Default)**: A fresh, emerald-accented aesthetic for a modern first impression.
- **Midnight Slate**: A sophisticated, deep-tech dark mode optimized for low-light legibility.
- **Modern Minimalist**: A clean, off-white theme focused on maximum text contrast and readability.
- **Theme-Reactive Charts**: All visualizations (Radar and Line charts) dynamically adjust their axis, grid, and label colors using a custom `MutationObserver` hook.

## 🛠️ Tech Stack & Methodology

- **Frontend**: Next.js (Pages Router), TypeScript, CSS Modules.
- **Data Visualization**: Chart.js 4.x with high-contrast, multi-line label support.
- **Content Management**: Markdown-based articles with `gray-matter` and `remark-html`.
- **API Integration**: `yahoo-finance2` for financial data, OpenWeatherMap for real-time weather.
- **Accessibility**: Full WCAG compliance, including ARIA tab patterns, keyboard-accessible navigation, and "Skip to Content" links.
- **Privacy**: "Soft Privacy" architecture that reveals administrative tools (checklists, portfolio management) only when accessed via `localhost`.

## 📁 Project Structure

- `/pages` - Next.js routes, dynamic blog paths, and batched API endpoints.
- `/components` - Modular, feature-based UI components (CareerRoadmap, Portfolio, Weather).
- `/posts` - Markdown source files for technical articles and insights.
- `/hooks` - Custom business logic hooks (useTheme, usePortfolio, useWeather, useChecklist).
- `/lib` - Centralized roles, constants, and investment logic models.
- `/private` - Secure storage for resumes and career notes (excluded from version control).
- `/styles` - Global design system variables and component-level CSS modules.

## ⚙️ Setup & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Environment Configuration**:
   ```bash
   cp .env.example .env.local
   ```
   *Add your OpenWeatherMap API key to `.env.local`.*
3. **Launch Development Server**:
   ```bash
   npm run dev
   ```
4. **Build for Production**:
   ```bash
   npm run build
   ```

---
*Created and maintained by [Sachin Nediyanchath](https://www.linkedin.com/in/nediyanchath/)*