'use client';

import { BrushSize } from '@/types/paint';

interface BrushSettingsProps {
  brushSize: BrushSize;
  onBrushSizeChange: (size: BrushSize) => void;
}

const BRUSH_SIZES: BrushSize[] = [2, 5, 10, 15, 20, 30, 50];

export default function BrushSettings({ brushSize, onBrushSizeChange }: BrushSettingsProps) {
  const currentIndex = Math.max(0, BRUSH_SIZES.indexOf(brushSize));
  const percent = (currentIndex / (BRUSH_SIZES.length - 1)) * 100;

  return (
    <div className="space-y-4">
      {/* Current Brush Preview */}
      <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl border-2 border-purple-200">
        <div className="text-sm font-semibold text-purple-700">Preview:</div>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-xl border-2 border-purple-300 flex items-center justify-center">
            <div
              className="bg-purple-600 rounded-full"
              style={{
                width: `${Math.max(brushSize * 0.8, 4)}px`,
                height: `${Math.max(brushSize * 0.8, 4)}px`
              }}
            />
          </div>
          <div className="text-sm text-purple-600">
            <div className="font-bold">{brushSize}px</div>
            <div className="text-xs">
              {brushSize <= 5 ? 'Thin' : brushSize <= 15 ? 'Medium' : 'Thick'}
            </div>
          </div>
        </div>
      </div>

      {/* Size Slider */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-700">
          Brush Size: {brushSize}px
        </label>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={BRUSH_SIZES.length - 1}
            step={1}
            value={currentIndex}
            onChange={(e) => onBrushSizeChange(BRUSH_SIZES[Number(e.target.value)])}
            className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${percent}%, #E9D5FF ${percent}%, #E9D5FF 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-purple-600 mt-1">
            <span>{BRUSH_SIZES[0]}px</span>
            <span>{BRUSH_SIZES[Math.floor(BRUSH_SIZES.length / 2)]}px</span>
            <span>{BRUSH_SIZES[BRUSH_SIZES.length - 1]}px</span>
          </div>
        </div>
      </div>

      {/* Size Preset Buttons */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-purple-700">Quick Select:</label>
        <div className="grid grid-cols-4 gap-2">
          {BRUSH_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onBrushSizeChange(size)}
              className={`
                p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                ${brushSize === size
                  ? 'bg-purple-500 border-purple-600 text-white shadow-lg'
                  : 'bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200 hover:border-purple-300'
                }
              `}
              title={`Set brush size to ${size}px`}
            >
              <div className="text-center">
                <div
                  className={`mx-auto mb-1 rounded-full ${
                    brushSize === size ? 'bg-white' : 'bg-purple-600'
                  }`}
                  style={{
                    width: `${Math.max(size * 0.3, 6)}px`,
                    height: `${Math.max(size * 0.3, 6)}px`
                  }}
                />
                <div className="text-xs font-bold">{size}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Size Description */}
      <div className="bg-blue-50 rounded-xl p-3 border-2 border-blue-200">
        <div className="text-xs text-blue-700">
          <div className="font-semibold mb-1">💡 Size Guide:</div>
          <div>• 2-5px: Perfect for detailed work</div>
          <div>• 10-15px: Great for writing and outlines</div>
          <div>• 20-30px: Ideal for coloring large areas</div>
          <div>• 50px: Perfect for backgrounds</div>
        </div>
      </div>
    </div>
  );
}