'use client';

import { Tool, BrushSize } from '@/types/paint';
import ColorPalette from './ColorPalette';
import BrushSettings from './BrushSettings';

interface ToolPanelProps {
  currentTool: Tool;
  currentColor: string;
  brushSize: BrushSize;
  colors: string[];
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onBrushSizeChange: (size: BrushSize) => void;
  onClearCanvas: () => void;
  onSaveImage: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const TOOLS = [
  { id: 'brush' as Tool, name: 'Brush', icon: '🖌️', description: 'Regular brush for painting' },
  { id: 'marker' as Tool, name: 'Marker', icon: '🖍️', description: 'Thick marker for bold colors' },
  { id: 'pencil' as Tool, name: 'Pencil', icon: '✏️', description: 'Thin pencil for details' },
  { id: 'eraser' as Tool, name: 'Eraser', icon: '🧽', description: 'Erase your mistakes' }
];

export default function ToolPanel({
  currentTool,
  currentColor,
  brushSize,
  colors,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onClearCanvas,
  onSaveImage,
  onUndo,
  onRedo
}: ToolPanelProps) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-300 p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-purple-800 mb-2">🎨 Tools 🎨</h2>
        <p className="text-purple-600 text-sm">Choose your drawing tools!</p>
      </div>

      {/* Drawing Tools */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
          🛠️ Drawing Tools
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`
                p-4 rounded-2xl border-3 transition-all duration-200 transform hover:scale-105
                ${currentTool === tool.id
                  ? 'bg-purple-500 border-purple-600 text-white shadow-lg scale-105'
                  : 'bg-purple-100 border-purple-200 text-purple-700 hover:bg-purple-200 hover:border-purple-300'
                }
              `}
              title={tool.description}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{tool.icon}</div>
                <div className="text-sm font-bold">{tool.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
          🌈 Colors
        </h3>
        <ColorPalette
          colors={colors}
          currentColor={currentColor}
          onColorChange={onColorChange}
        />
      </div>

      {/* Brush Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
          📏 Brush Size
        </h3>
        <BrushSettings
          brushSize={brushSize}
          onBrushSizeChange={onBrushSizeChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
          ⚡ Actions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Undo Button */}
          <button
            onClick={onUndo}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-2xl border-3 border-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="Undo last action"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">↶</div>
              <div className="text-sm">Undo</div>
            </div>
          </button>

          {/* Redo Button */}
          <button
            onClick={onRedo}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-2xl border-3 border-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="Redo last undone action"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">↷</div>
              <div className="text-sm">Redo</div>
            </div>
          </button>

          {/* Clear Canvas Button */}
          <button
            onClick={onClearCanvas}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-2xl border-3 border-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="Clear entire canvas"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">🗑️</div>
              <div className="text-sm">Clear</div>
            </div>
          </button>

          {/* Save Button */}
          <button
            onClick={onSaveImage}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-2xl border-3 border-green-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="Save your artwork as JPG"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">💾</div>
              <div className="text-sm">Save</div>
            </div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-purple-100 rounded-2xl p-4 border-2 border-purple-200">
        <h4 className="text-purple-800 font-bold text-sm mb-2">💡 How to use:</h4>
        <ul className="text-purple-700 text-xs space-y-1">
          <li>• Choose a tool and color</li>
          <li>• Adjust brush size if needed</li>
          <li>• Click and drag on canvas to draw</li>
          <li>• Use Undo/Redo if you make mistakes</li>
          <li>• Save your masterpiece when done!</li>
        </ul>
      </div>
    </div>
  );
}