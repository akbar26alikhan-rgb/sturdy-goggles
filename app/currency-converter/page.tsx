import CurrencyConverter from '@/components/CurrencyConverter';

export default function CurrencyConverterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-green-200 to-teal-200">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-400">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-2">
            💱 Currency Converter 💱
          </h1>
          <p className="text-center text-blue-600 text-lg">
            Learn about money from around the world!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-300 p-8">
            <CurrencyConverter />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t-4 border-blue-400 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-blue-600 text-sm">
            Explore currencies from around the world! 🌍💰
          </p>
        </div>
      </div>
    </div>
  );
}