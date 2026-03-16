import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
      <div className="text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          🚀 Welcome to Web Apps! 🚀
        </h1>
        <p className="text-xl mb-8 drop-shadow-md">
          Fun, educational, and professional applications for everyone
        </p>
      </div>

        {/* App Cards */}
        <div className="max-w-7xl mx-auto mt-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Paint App Card */}
            <Link href="/paint-app">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-purple-300">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h2 className="text-3xl font-bold mb-2">Kids Paint App</h2>
                  <p className="text-purple-100">
                    Unleash your creativity with colors and brushes!
                  </p>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🖌️</span>
                      <span className="text-gray-700">Multiple brush tools and sizes</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌈</span>
                      <span className="text-gray-700">20+ vibrant colors to choose from</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <span className="text-gray-700">Works on desktop, tablet, and mobile</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💾</span>
                      <span className="text-gray-700">Save your masterpieces as images</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">↶</span>
                      <span className="text-gray-700">Undo and redo your actions</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Painting! 🎨
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Currency Converter Card */}
            <Link href="/currency-converter">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-blue-300">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-8 text-white text-center">
                  <div className="text-6xl mb-4">💱</div>
                  <h2 className="text-3xl font-bold mb-2">Currency Converter</h2>
                  <p className="text-blue-100">
                    Learn about money and exchange rates!
                  </p>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🌍</span>
                      <span className="text-gray-700">150+ currencies worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span className="text-gray-700">Real-time exchange rates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span className="text-gray-700">Interactive charts and graphs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎓</span>
                      <span className="text-gray-700">Educational and fun to learn</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <span className="text-gray-700">Works on all devices</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Converting! 💱
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Water Intake Card */}
            <Link href="/water-intake">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-cyan-300">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 text-white text-center">
                  <div className="text-6xl mb-4">💧</div>
                  <h2 className="text-3xl font-bold mb-2">Water Intake</h2>
                  <p className="text-cyan-100">
                    Calculate your daily water needs based on your body!
                  </p>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📏</span>
                      <span className="text-gray-700">Based on height & weight</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💪</span>
                      <span className="text-gray-700">Considers your body build</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span className="text-gray-700">Activity level adjustment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span className="text-gray-700">Daily progress tracker</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🥤</span>
                      <span className="text-gray-700">Glasses, bottles & cups</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Track Water! 💧
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Product Search Card */}
            <Link href="/product-search">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-orange-300">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white text-center">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-3xl font-bold mb-2">Price Aggregator</h2>
                  <p className="text-orange-100">
                    Find the best deals across multiple stores!
                  </p>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛒</span>
                      <span className="text-gray-700">Search multiple e-commerce sites</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💰</span>
                      <span className="text-gray-700">Compare real-time prices</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔗</span>
                      <span className="text-gray-700">Direct links to buy products</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span className="text-gray-700">Fast and reliable results</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <span className="text-gray-700">Works on all devices</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Searching! 🔍
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Stock Indicators Card */}
            <Link href="/stock-indicators">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 cursor-pointer border-4 border-green-300">
                <div className="bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 p-8 text-white text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <h2 className="text-3xl font-bold mb-2">Stock Indicators</h2>
                  <p className="text-green-100">
                    Indian Market Technical Analysis Tools!
                  </p>
                </div>
                <div className="p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇮🇳</span>
                      <span className="text-gray-700">10 powerful trading indicators</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚙️</span>
                      <span className="text-gray-700">Optimized for NSE/BSE markets</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🛡️</span>
                      <span className="text-gray-700">Complete stop-loss framework</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📊</span>
                      <span className="text-gray-700">MA, RSI, MACD, VWAP & more</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💡</span>
                      <span className="text-gray-700">Research-backed settings</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-orange-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200">
                      Start Trading! 📈
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center text-white mt-16">
          <h3 className="text-3xl font-bold mb-8">Why Choose Our Apps? ✨</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">👶</div>
              <h4 className="text-xl font-bold mb-2">Kid-Friendly</h4>
              <p className="text-sm">
                Designed specifically for children with large buttons, bright colors, and intuitive interfaces.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="text-xl font-bold mb-2">Educational</h4>
              <p className="text-sm">
                Learn while you play! Our apps teach important concepts like creativity, math, and world geography.
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-bold mb-2">Safe & Simple</h4>
              <p className="text-sm">
                No ads, no purchases, no complicated setups. Just pure, safe fun for kids of all ages.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white mt-16 pt-8 border-t border-white border-opacity-20">
          <p className="text-sm opacity-80">
            Made with ❤️ for children everywhere. Happy learning and creating! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}