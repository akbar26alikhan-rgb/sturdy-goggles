'use client';

import { useState, useEffect } from 'react';

type BuildType = 'slim' | 'average' | 'athletic' | 'muscular' | 'heavy';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

interface UserProfile {
  height: number;
  weight: number;
  build: BuildType;
  activityLevel: ActivityLevel;
  age: number;
  gender: 'male' | 'female';
}

interface WaterResult {
  dailyIntake: number;
  glasses: number;
  bottles: number;
  cups: number;
}

export default function WaterIntake() {
  const [profile, setProfile] = useState<UserProfile>({
    height: 170,
    weight: 70,
    build: 'average',
    activityLevel: 'moderate',
    age: 30,
    gender: 'male',
  });

  const [result, setResult] = useState<WaterResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<'metric' | 'imperial'>('metric');
  const [intakeLog, setIntakeLog] = useState<number[]>([]);
  const [todayIntake, setTodayIntake] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const builds: { value: BuildType; label: string; emoji: string; description: string }[] = [
    { value: 'slim', label: 'Slim', emoji: '� slender', description: 'Lean body type' },
    { value: 'average', label: 'Average', emoji: '👤', description: 'Normal build' },
    { value: 'athletic', label: 'Athletic', emoji: '🏃', description: 'Regular exercise' },
    { value: 'muscular', label: 'Muscular', emoji: '💪', description: 'High muscle mass' },
    { value: 'heavy', label: 'Heavy', emoji: '🦭', description: 'Larger frame' },
  ];

  const activityLevels: { value: ActivityLevel; label: string; emoji: string; description: string }[] = [
    { value: 'sedentary', label: 'Sedentary', emoji: '🛋️', description: 'Little to no exercise' },
    { value: 'light', label: 'Light', emoji: '🚶', description: 'Light activity 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', emoji: '🏃', description: 'Moderate exercise 3-5 days/week' },
    { value: 'active', label: 'Active', emoji: '🏋️', description: 'Hard exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', emoji: '🏅', description: 'Intense daily training' },
  ];

  const calculateWaterIntake = (): WaterResult => {
    const { height, weight, build, activityLevel, age, gender } = profile;
    
    // Convert to metric if needed
    let weightKg = weight;
    let heightCm = height;
    
    if (selectedUnit === 'imperial') {
      weightKg = weight * 0.453592;
      heightCm = height * 2.54;
    }

    // Base calculation using the formula: 30-35ml per kg of body weight
    let baseIntake = weightKg * 33;

    // Adjust for height (taller people generally need more water)
    const heightFactor = heightCm / 170;
    baseIntake *= heightFactor;

    // Adjust for build
    const buildFactors: Record<BuildType, number> = {
      slim: 0.95,
      average: 1.0,
      athletic: 1.1,
      muscular: 1.15,
      heavy: 1.05,
    };
    baseIntake *= buildFactors[build];

    // Adjust for activity level
    const activityFactors: Record<ActivityLevel, number> = {
      sedentary: 0.9,
      light: 1.0,
      moderate: 1.15,
      active: 1.3,
      very_active: 1.5,
    };
    baseIntake *= activityFactors[activityLevel];

    // Adjust for age (older people need slightly less)
    if (age > 50) {
      baseIntake *= 0.95;
    } else if (age > 30) {
      baseIntake *= 0.98;
    }

    // Adjust for gender (males generally need slightly more)
    if (gender === 'male') {
      baseIntake *= 1.05;
    }

    const dailyIntake = Math.round(baseIntake);
    const glassSize = selectedUnit === 'metric' ? 250 : 8; // 250ml or 8oz
    const bottleSize = selectedUnit === 'metric' ? 500 : 16; // 500ml or 16oz
    const cupSize = selectedUnit === 'metric' ? 200 : 7; // 200ml or 7oz

    return {
      dailyIntake,
      glasses: Math.round(dailyIntake / glassSize),
      bottles: Math.round(dailyIntake / bottleSize),
      cups: Math.round(dailyIntake / cupSize),
    };
  };

  const handleCalculate = () => {
    const waterResult = calculateWaterIntake();
    setResult(waterResult);
    setShowResult(true);
    setShowCelebration(false);
  };

  const addWater = (amount: number) => {
    const newIntake = todayIntake + amount;
    setTodayIntake(newIntake);
    setIntakeLog([...intakeLog, amount]);
    
    if (result && newIntake >= result.dailyIntake && !showCelebration) {
      setShowCelebration(true);
    }
  };

  const resetDay = () => {
    setTodayIntake(0);
    setIntakeLog([]);
    setShowCelebration(false);
  };

  const getUnitLabel = () => {
    return selectedUnit === 'metric' ? 'kg/cm' : 'lbs/in';
  };

  const getVolumeUnit = () => {
    return selectedUnit === 'metric' ? 'ml' : 'oz';
  };

  const getProgress = () => {
    if (!result) return 0;
    return Math.min((todayIntake / result.dailyIntake) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            💧 Water Intake Calculator 💧
          </h1>
          <p className="text-xl text-blue-100">
            Stay hydrated! Calculate your perfect daily water intake
          </p>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 backdrop-blur rounded-full p-1 flex">
            <button
              onClick={() => setSelectedUnit('metric')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedUnit === 'metric'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              📊 Metric (kg/cm)
            </button>
            <button
              onClick={() => setSelectedUnit('imperial')}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                selectedUnit === 'imperial'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              📊 Imperial (lbs/in)
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                👫 Gender
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    profile.gender === 'male'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👨 Male
                </button>
                <button
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                    profile.gender === 'female'
                      ? 'bg-pink-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  👩 Female
                </button>
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                🎂 Age: {profile.age} years
              </label>
              <input
                type="range"
                min="10"
                max="80"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) })}
                className="w-full h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>10</span>
                <span>80</span>
              </div>
            </div>

            {/* Height */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                📏 Height ({selectedUnit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({ ...profile, height: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder={selectedUnit === 'metric' ? '170' : '67'}
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                ⚖️ Weight ({selectedUnit === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({ ...profile, weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder={selectedUnit === 'metric' ? '70' : '154'}
              />
            </div>

            {/* Build */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                💪 Body Build
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {builds.map((build) => (
                  <button
                    key={build.value}
                    onClick={() => setProfile({ ...profile, build: build.value })}
                    className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                      profile.build === build.value
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{build.emoji}</div>
                    <div className="text-sm">{build.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                ⚡ Activity Level / Nature
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {activityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setProfile({ ...profile, activityLevel: level.value })}
                    className={`py-3 px-2 rounded-xl font-semibold transition-all ${
                      profile.activityLevel === level.value
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{level.emoji}</div>
                    <div className="text-sm">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xl font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
          >
            🚀 Calculate My Water Intake!
          </button>
        </div>

        {/* Results */}
        {showResult && result && (
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              🎯 Your Daily Water Goal
            </h2>

            {/* Main Result */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-3xl p-8 shadow-lg">
                <span className="text-6xl mr-4">💧</span>
                <div>
                  <div className="text-5xl font-bold">{result.dailyIntake.toLocaleString()}</div>
                  <div className="text-xl">{getVolumeUnit()}</div>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">🥛</div>
                <div className="text-2xl font-bold text-blue-600">{result.glasses}</div>
                <div className="text-sm text-blue-600">Glasses</div>
                <div className="text-xs text-blue-500">
                  ({selectedUnit === 'metric' ? '250ml' : '8oz'} each)
                </div>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">🍶</div>
                <div className="text-2xl font-bold text-indigo-600">{result.bottles}</div>
                <div className="text-sm text-indigo-600">Bottles</div>
                <div className="text-xs text-indigo-500">
                  ({selectedUnit === 'metric' ? '500ml' : '16oz'} each)
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 text-center">
                <div className="text-3xl mb-2">☕</div>
                <div className="text-2xl font-bold text-purple-600">{result.cups}</div>
                <div className="text-sm text-purple-600">Cups</div>
                <div className="text-xs text-purple-500">
                  ({selectedUnit === 'metric' ? '200ml' : '7oz'} each)
                </div>
              </div>
            </div>

            {/* Daily Tracker */}
            <div className="border-t-2 border-gray-100 pt-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                📊 Today&apos;s Progress
              </h3>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {todayIntake.toLocaleString()} / {result.dailyIntake.toLocaleString()} {getVolumeUnit()}
                  </span>
                </div>
                <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      getProgress() >= 100
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
                <div className="text-center mt-2 text-sm font-semibold text-gray-600">
                  {Math.round(getProgress())}% of daily goal
                </div>
              </div>

              {/* Quick Add Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <button
                  onClick={() => addWater(selectedUnit === 'metric' ? 200 : 7)}
                  className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-semibold py-3 px-3 rounded-xl transition-colors"
                >
                  +{selectedUnit === 'metric' ? '200ml' : '7oz'} ☕
                </button>
                <button
                  onClick={() => addWater(selectedUnit === 'metric' ? 250 : 8)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-3 rounded-xl transition-colors"
                >
                  +{selectedUnit === 'metric' ? '250ml' : '8oz'} 🥛
                </button>
                <button
                  onClick={() => addWater(selectedUnit === 'metric' ? 330 : 11)}
                  className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-3 rounded-xl transition-colors"
                >
                  +{selectedUnit === 'metric' ? '330ml' : '11oz'} 🥫
                </button>
                <button
                  onClick={() => addWater(selectedUnit === 'metric' ? 500 : 16)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-3 rounded-xl transition-colors"
                >
                  +{selectedUnit === 'metric' ? '500ml' : '16oz'} 🍶
                </button>
              </div>

              {/* Custom Amount */}
              <div className="flex gap-2">
                <input
                  type="number"
                  id="customAmount"
                  placeholder="Custom amount"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('customAmount') as HTMLInputElement;
                    const amount = parseFloat(input.value);
                    if (amount > 0) {
                      addWater(amount);
                      input.value = '';
                    }
                  }}
                  className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
                >
                  Add +
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetDay}
                className="w-full mt-4 text-gray-500 hover:text-gray-700 font-semibold py-2 transition-colors"
              >
                🔄 Reset Today&apos;s Progress
              </button>
            </div>

            {/* Tips */}
            <div className="border-t-2 border-gray-100 pt-6 mt-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Hydration Tips</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌅</span>
                  <div>
                    <div className="font-semibold text-gray-700">Morning Kickstart</div>
                    <div className="text-sm text-gray-500">Drink a glass of water first thing in the morning</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🍽️</span>
                  <div>
                    <div className="font-semibold text-gray-700">Before Meals</div>
                    <div className="text-sm text-gray-500">Drink water 30 minutes before meals</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏃</span>
                  <div>
                    <div className="font-semibold text-gray-700">During Exercise</div>
                    <div className="text-sm text-gray-500">Drink more water before, during, and after workouts</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚫</span>
                  <div>
                    <div className="font-semibold text-gray-700">Limit Caffeine</div>
                    <div className="text-sm text-gray-500">Too much caffeine can cause dehydration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Celebration */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 text-center animate-bounce">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Congratulations! 🎊
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                You&apos;ve reached your daily water goal!
              </p>
              <div className="text-5xl font-bold text-cyan-500 mb-4">
                💧 {todayIntake.toLocaleString()} {getVolumeUnit()}
              </div>
              <button
                onClick={() => setShowCelebration(false)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Awesome! 🚀
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-white/70 text-sm mt-8">
          <p>💡 Remember: This is an estimate. Your actual needs may vary based on climate, health conditions, and individual factors.</p>
        </div>
      </div>
    </div>
  );
}
