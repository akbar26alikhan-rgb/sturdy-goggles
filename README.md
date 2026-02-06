# Multi-App Repository

This repository contains multiple applications:

1. [**Real-Time Currency Converter**](#real-time-currency-converter) - A Next.js web application for currency conversion
2. [**Marble Chess**](#marble-chess) - A native Android chess app with classic marble aesthetics

---

# Real-Time Currency Converter

A comprehensive Next.js application that provides real-time currency conversion with live exchange rates from reliable APIs.

## Features

- 🔄 **Real-Time Exchange Rates**: Live currency conversion with up-to-date exchange rates
- 🌍 **150+ Supported Currencies**: Comprehensive currency support from major world currencies
- ⚡ **Instant Conversion**: Real-time calculation as you type
- 🔁 **Currency Swap**: Easy one-click currency swapping
- 📱 **Responsive Design**: Optimized for mobile, tablet, and desktop
- 🌓 **Dark Mode Support**: Beautiful interface for both light and dark environments
- 💾 **Rate Caching**: Intelligent caching to optimize API usage and improve performance
- 🔒 **Error Handling**: Robust error handling with retry mechanisms
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS 4

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Use

1. **Select Source Currency**: Choose the currency you want to convert from
2. **Enter Amount**: Type the amount in the input field
3. **Select Target Currency**: Choose the currency you want to convert to
4. **View Result**: See the converted amount and current exchange rate instantly
5. **Swap Currencies**: Click the swap button to reverse the currencies
6. **Real-Time Updates**: Exchange rates are fetched automatically and cached for optimal performance

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development for better code quality
- **Tailwind CSS 4** - Modern utility-first styling
- **ExchangeRate-API** - Reliable real-time exchange rate data
- **React Hooks** - Efficient state management and lifecycle handling

## API Integration

The application integrates with ExchangeRate-API for real-time currency data:

- **Real-time rates**: Exchange rates are fetched from a reliable external API
- **Caching strategy**: Intelligent caching prevents excessive API calls
- **Error handling**: Graceful fallbacks and error recovery
- **Rate limiting**: Optimized requests to stay within API limits

### API Endpoint Structure

The application provides its own API endpoint at `/api/exchange-rates` for:
- Rate limiting and caching
- Server-side rate fetching
- Future enhancements and analytics

## Component Architecture

- **CurrencyConverter** - Main converter component with state management
- **CurrencyInput** - Input field with currency selector
- **CurrencySelector** - Dropdown for currency selection
- **ExchangeRateDisplay** - Rate display with last updated information

## Project Structure

```
├── lib/
│   ├── exchangeRateApi.ts    # API integration and utilities
│   └── types.ts              # TypeScript type definitions
├── components/
│   ├── CurrencyConverter.tsx # Main converter component
│   ├── CurrencyInput.tsx     # Input with currency selector
│   ├── CurrencySelector.tsx  # Currency dropdown
│   └── ExchangeRateDisplay.tsx # Rate display component
├── app/
│   ├── api/
│   │   └── exchange-rates/
│   │       └── route.ts      # API route for exchange rates
│   └── page.tsx              # Main application page
```

## Performance Features

- **Smart Caching**: Exchange rates are cached for 5 minutes to optimize performance
- **Optimized Requests**: Automatic request deduplication and caching
- **Loading States**: Smooth loading indicators during API calls
- **Error Recovery**: Automatic retry mechanisms for failed requests

## Development

The application includes comprehensive error handling and logging for development:
- Mock exchange rates in development mode for testing
- Detailed error messages and debugging information
- Fallback currencies if API is unavailable

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

---

# Marble Chess

A native Android chess application with a classic marble aesthetic, featuring both player-vs-player and player-vs-AI modes with strong Stockfish integration.

## Features

- ♟️ **Complete Chess Rules**: Full implementation including castling, en passant, promotion, check, checkmate, and stalemate detection
- 👥 **Two Game Modes**:
  - **Player vs Player**: Play against a friend on the same device
  - **Player vs Computer**: Challenge the AI with 4 difficulty levels (Easy, Medium, Hard, Expert)
- 🤖 **Strong AI**: Integrated Stockfish chess engine support with fallback tactical engine
- 🎨 **Marble Aesthetic**: Beautiful marble-themed UI with custom-drawn chess pieces
- 📱 **Responsive Design**: Optimized for phones and tablets
- ↩️ **Undo Support**: Take back moves during gameplay
- 🎯 **Visual Hints**: Legal move indicators, last move highlighting, and check warnings

## Project Structure

```
android-chess/
├── app/src/main/java/com/marble/chess/
│   ├── ChessApplication.kt         # Application class
│   ├── MainActivity.kt             # Main entry point
│   ├── engine/
│   │   ├── GameController.kt       # Game state management
│   │   └── EngineManager.kt        # Stockfish integration
│   ├── viewmodel/
│   │   └── ChessViewModel.kt       # UI state management
│   └── ui/
│       ├── theme/                  # Material 3 theming
│       ├── components/
│       │   ├── ChessBoard.kt       # Board rendering
│       │   └── ChessPieces.kt      # Custom piece graphics
│       └── screens/
│           ├── MainMenuScreen.kt   # Game mode selection
│           └── ChessGameScreen.kt  # Main game UI
└── README.md                       # Detailed Android app documentation
```

## Building the Android App

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 or later
- Android SDK with API level 34

### Build Instructions

1. **Navigate to the Android project**:
   ```bash
   cd android-chess
   ```

2. **Open in Android Studio** and build, or use command line:
   ```bash
   ./gradlew assembleDebug
   ```

3. **Install on device**:
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

### Stockfish Integration (Optional)

For the strongest AI play, download Stockfish binaries and place them in:
`android-chess/app/src/main/assets/`

- `stockfish-android-arm64` for 64-bit ARM devices
- `stockfish-android-armv7` for 32-bit ARM devices

**Note**: Stockfish is GPL v3 licensed. See the [android-chess README](android-chess/README.md) for licensing details.

## Tech Stack

- **Kotlin** - Modern Android development language
- **Jetpack Compose** - Declarative UI toolkit
- **Chesslib** - Java chess library for move generation and validation
- **Stockfish** (optional) - World-class chess engine via UCI protocol
- **Material Design 3** - Modern Android design system