'use client';

interface ColorPaletteProps {
  colors: string[];
  currentColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorPalette({ colors, currentColor, onColorChange }: ColorPaletteProps) {
  return (
    <div className="space-y-3">
      {/* Current Color Display */}
      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-2xl border-2 border-purple-200">
        <div className="text-sm font-semibold text-purple-700">Current:</div>
        <div
          className="w-8 h-8 rounded-full border-3 border-purple-400 shadow-lg"
          style={{ backgroundColor: currentColor }}
        />
        <div className="text-sm text-purple-600 font-mono">{currentColor}</div>
      </div>

      {/* Color Grid */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`
              w-12 h-12 rounded-2xl border-3 transition-all duration-200 transform hover:scale-110
              ${currentColor === color
                ? 'border-purple-500 shadow-lg scale-110 ring-4 ring-purple-300'
                : 'border-purple-200 hover:border-purple-400 shadow-md'
              }
            `}
            style={{ backgroundColor: color }}
            title={`Select ${color}`}
          >
            {/* Color preview with checkerboard pattern for transparency */}
            <div className="w-full h-full rounded-xl overflow-hidden">
              {color === '#FFFFFF' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
              )}
              {color === '#CCCCCC' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
              )}
              {color === '#999999' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
              )}
              {color === '#666666' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
              )}
              {color === '#333333' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-500 to-gray-600" />
              )}
              {color === '#000000' && (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Color Categories */}
      <div className="text-xs text-purple-600 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Reds</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>Blues</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Greens</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Yellows</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span>Purples</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          <span>Oranges</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-500"></div>
          <span>Pinks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
          <span>Browns</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          <span>Grays & Black</span>
        </div>
      </div>
    </div>
  );
}