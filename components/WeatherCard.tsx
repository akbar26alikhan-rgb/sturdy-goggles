import Image from 'next/image';

interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  description: string;
  icon: string;
  windSpeed: number;
  clouds: number;
  timestamp: string;
}

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
            {weather.description}
          </p>
        </div>
        <Image src={iconUrl} alt={weather.description} width={64} height={64} className="h-16 w-16" />
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <span className="text-5xl font-bold text-zinc-900 dark:text-white">
            {weather.temperature}°C
          </span>
          <span className="ml-2 text-zinc-600 dark:text-zinc-400">
            Feels like {weather.feelsLike}°C
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded bg-zinc-100 p-3 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Humidity</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {weather.humidity}%
          </p>
        </div>
        <div className="rounded bg-zinc-100 p-3 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Wind Speed</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {weather.windSpeed} m/s
          </p>
        </div>
        <div className="rounded bg-zinc-100 p-3 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Pressure</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {weather.pressure} hPa
          </p>
        </div>
        <div className="rounded bg-zinc-100 p-3 dark:bg-zinc-800">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">Cloudiness</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {weather.clouds}%
          </p>
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
        Last updated: {new Date(weather.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
