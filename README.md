# Weather App

A Next.js application that fetches and displays real-time weather data for specific locations using the OpenWeatherMap API.

## Features

- 🌤️ Real-time weather data for any city worldwide
- 🌡️ Temperature, humidity, wind speed, and atmospheric pressure
- 🎨 Clean, responsive UI with dark mode support
- ⚡ Fast server-side API integration
- 🔒 Secure API key management with environment variables

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenWeatherMap API key (get one free at [https://openweathermap.org/api](https://openweathermap.org/api))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your OpenWeatherMap API key:

```
OPENWEATHER_API_KEY=your_actual_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter a city name in the search box (e.g., "London", "Tokyo", "New York")
2. Click "Get Weather" to fetch current weather data
3. View detailed weather information including:
   - Current temperature and "feels like" temperature
   - Weather description and icon
   - Humidity percentage
   - Wind speed
   - Atmospheric pressure
   - Cloudiness

## API

The application includes a Next.js API route at `/api/weather` that accepts a `city` query parameter:

```
GET /api/weather?city=London
```

Response format:

```json
{
  "city": "London",
  "country": "GB",
  "temperature": 15,
  "feelsLike": 14,
  "humidity": 72,
  "pressure": 1013,
  "description": "scattered clouds",
  "icon": "03d",
  "windSpeed": 4.5,
  "clouds": 40,
  "timestamp": "2024-01-20T12:00:00.000Z"
}
```

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe code
- **Tailwind CSS 4** - Utility-first CSS framework
- **OpenWeatherMap API** - Real-world weather data source

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Don't forget to add your `OPENWEATHER_API_KEY` environment variable in your Vercel project settings!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
