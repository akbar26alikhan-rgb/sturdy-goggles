# Interactive Quiz App

A Next.js application that provides an interactive quiz experience with timers, scoring logic, and knowledge testing.

## Features

- ⏱️ **Timed Questions**: Each question has a 15-second timer to add excitement and challenge.
- 📊 **Scoring Logic**: Real-time scoring based on correct answers.
- 🎨 **Responsive UI**: Modern, clean, and mobile-friendly design using Tailwind CSS 4.
- 🌓 **Dark Mode Support**: Optimized for both light and dark environments.
- 🔄 **Interactive Experience**: Immediate feedback on answers and a final result screen.

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

## How to Play

1. Read the question displayed on the screen.
2. Select one of the four options before the timer runs out.
3. The app will immediately show if your answer was correct or incorrect.
4. After answering all questions, you'll see your final score and a performance summary.
5. Click "Try Again" to restart the quiz.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling with modern features
- **React Hooks** - State management for quiz logic and timers

## Quiz Data

The quiz currently features a set of general knowledge questions:
- Geography (Capitals, Planets, Oceans)
- Literature
- Science (Chemistry)

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
