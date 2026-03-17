# Multi-App Web Platform

A collection of powerful web applications including:
- **Indian Stock Profit Scanner**: Stock analysis and scoring system
- **Text to Speech**: Multi-language TTS converter for Indian languages
- **Currency Converter**: Real-time currency conversion with charts
- **Paint App**: Creative drawing application for kids
- And more!

---

## Text to Speech Application

A modern, responsive web application that converts text into natural-sounding speech with support for all major Indian languages.

### Features

- **11 Indian Languages Supported**:
  - Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi, Urdu, English (India)
- **No Character Limit**: Process unlimited text by chunking
- **Multiple Voices**: Male and female voice options (Standard & Wavenet)
- **Speech Controls**: Adjustable speed (0.5x - 2.0x) and pitch
- **File Upload**: Support for TXT, DOCX, and PDF files
- **Audio Player**: Built-in playback with play, pause, stop controls
- **MP3 Download**: Download generated audio as MP3 files
- **History**: Save and revisit previous conversions
- **Dark Mode**: Toggle between light and dark themes
- **Web Speech API Fallback**: Works without API key using browser TTS

### TTS Setup

1. **Get a Google Cloud API Key** (optional but recommended for high quality):
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Text-to-Speech API
   - Create an API key

2. **Configure environment variables**:
   ```env
   GOOGLE_TTS_API_KEY="your-api-key-here"
   ```

3. **Without API Key**: Enable "Use browser TTS" option in the app for free text-to-speech using Web Speech API (limited quality).

---

## Indian Stock Profit Scanner

A full-stack web application that scans NSE stocks using live market data and ranks them for swing/short-term trading using a scoring system out of 100.

### Features

- **Live Market Data**: Fetches data from NSE via Yahoo Finance.
- **Profit Potential Scoring**: A weighted scoring system (0-100) based on:
  - Trend Strength (DMA 50/200)
  - Volume & Liquidity
  - Breakout Price Action
  - Fundamental Growth (EPS/Revenue)
  - Financial Strength (Debt-to-Equity)
  - Valuation (PE Ratio)
- **Interactive Dashboard**: Sortable and filterable table of top-performing stocks.
- **Detailed Stock Pages**: In-depth analysis, score breakdown, and interactive price charts.
- **Automated Refresh**: Data updates every 5 minutes to stay current with the market.
- **Mobile Responsive**: Clean, modern UI that works on all devices.

## Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS, Lucide React, Recharts
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Production ready)
- **Data Source**: Yahoo Finance (via `yahoo-finance2`)
- **Deployment**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (optional, for containerized setup)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd indian-stock-scanner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/stockdb?schema=public"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma generate
   # If you have a local postgres running:
   # npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000/stock-scanner](http://localhost:3000/stock-scanner) to see the app.

### Using Docker

1. **Build and run**:
   ```bash
   docker-compose up --build
   ```

2. The app will be available at [http://localhost:3000/stock-scanner](http://localhost:3000/stock-scanner).

## Scoring System Details

- **Trend (20 pts)**: Price > 200DMA & 50DMA > 200DMA gives max points.
- **Volume (15 pts)**: Rewards stocks with volume > 2x their 20-day average.
- **Breakout (15 pts)**: Points for stocks trading near their 52-week highs.
- **Fundamentals (20 pts)**: Based on quarterly EPS and Revenue growth.
- **Financials (10 pts)**: Rewards low Debt-to-Equity ratios.
- **Valuation (10 pts)**: Points for fair or undervalued PE ratios.
- **Others (10 pts)**: Institutional interest and Sector strength.

## Trade Grades

- **90-100**: A+ (Strong Buy)
- **80-89**: A (Good Trade)
- **70-79**: B (Decent)
- **60-69**: C (Risky)
- **40-59**: D (Avoid)
- **<40**: F (No Trade)
