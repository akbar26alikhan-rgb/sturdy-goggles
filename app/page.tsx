import CurrencyConverter from '@/components/CurrencyConverter';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center text-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Real-Time Currency Converter
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Get accurate exchange rates and convert currencies instantly
          </p>
        </div>
        
        <CurrencyConverter />

        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
          <p>Real-time exchange rates from reliable APIs</p>
          <p className="mt-1">Support for 150+ currencies worldwide</p>
        </div>
      </main>
    </div>
  );
}
