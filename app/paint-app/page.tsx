'use client';

import { useState } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import ToolPanel from '@/components/ToolPanel';
import { Tool, BrushSize } from '@/types/paint';

const PAINT_COLORS = [
  // Reds
  '#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC',
  // Blues
  '#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF',
  // Greens
  '#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC',
  // Yellows
  '#FFFF00', '#FFFF33', '#FFFF66', '#FFFF99', '#FFFFCC',
  // Purples
  '#800080', '#9933CC', '#B366CC', '#CC99FF', '#E6CCFF',
  // Oranges
  '#FF8000', '#FF9933', '#FFB366', '#FFCC99', '#FFE6CC',
  // Pinks
  '#FF1493', '#FF69B4', '#FFB6C1', '#FFC0CB', '#FFE4E1',
  // Browns
  '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#F5DEB3',
  // Grays and Black
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'
];

export default function PaintApp() {
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<BrushSize>(10);
  const [canvasKey, setCanvasKey] = useState<number>(0);

  const handleToolChange = (tool: Tool) => {
    setCurrentTool(tool);
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
  };

  const handleBrushSizeChange = (size: BrushSize) => {
    setBrushSize(size);
  };

  const handleClearCanvas = () => {
    setCanvasKey(prev => prev + 1);
  };

  const handleSaveImage = () => {
    // This will be handled by the DrawingCanvas component
    window.dispatchEvent(new CustomEvent('saveCanvas'));
  };

  const handleUndo = () => {
    window.dispatchEvent(new CustomEvent('undoCanvas'));
  };

  const handleRedo = () => {
    window.dispatchEvent(new CustomEvent('redoCanvas'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-purple-400">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-800 mb-2">
            🎨 Kids Paint App 🎨
          </h1>
          <p className="text-center text-purple-600 text-lg">
            Unleash your creativity with colors and brushes!
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tool Panel */}
          <div className="lg:w-80 order-2 lg:order-1">
            <ToolPanel
              currentTool={currentTool}
              currentColor={currentColor}
              brushSize={brushSize}
              colors={PAINT_COLORS}
              onToolChange={handleToolChange}
              onColorChange={handleColorChange}
              onBrushSizeChange={handleBrushSizeChange}
              onClearCanvas={handleClearCanvas}
              onSaveImage={handleSaveImage}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>

          {/* Canvas */}
          <div className="flex-1 order-1 lg:order-2">
            <div className="bg-white rounded-3xl shadow-2xl border-4 border-purple-300 p-4">
              <DrawingCanvas
                key={canvasKey}
                currentTool={currentTool}
                currentColor={currentColor}
                brushSize={brushSize}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t-4 border-purple-400 mt-8">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-purple-600 text-sm">
            Have fun creating amazing art! Remember to save your masterpieces! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}