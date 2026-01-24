'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Tool, BrushSize } from '@/types/paint';

interface DrawingCanvasProps {
  currentTool: Tool;
  currentColor: string;
  brushSize: BrushSize;
}

interface Point {
  x: number;
  y: number;
}

interface DrawingAction {
  tool: Tool;
  color: string;
  brushSize: BrushSize;
  points: Point[];
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

export default function DrawingCanvas({ currentTool, currentColor, brushSize }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [history, setHistory] = useState<DrawingAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const maxWidth = Math.min(container.clientWidth - 32, CANVAS_WIDTH);
        const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
        const width = Math.max(maxWidth, 300);
        const height = width / aspectRatio;
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Set initial canvas properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;

    // Fill with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasSize]);

  // Get mouse/touch position relative to canvas
  const getPosition = useCallback((e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  }, []);

  // Start drawing
  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const point = getPosition(e);
    setIsDrawing(true);
    setCurrentPath([point]);
  }, [getPosition]);

  // Draw on canvas
  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const point = getPosition(e);
    const newPath = [...currentPath, point];
    setCurrentPath(newPath);

    // Set drawing properties based on tool
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;

    switch (currentTool) {
      case 'brush':
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'marker':
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.8;
        break;
      case 'pencil':
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        break;
      case 'eraser':
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        break;
    }

    if (newPath.length > 1) {
      ctx.beginPath();
      ctx.moveTo(newPath[newPath.length - 2].x, newPath[newPath.length - 2].y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  }, [isDrawing, currentPath, currentTool, currentColor, brushSize, getPosition]);

  // Stop drawing and save action
  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    if (currentPath.length > 0) {
      const action: DrawingAction = {
        tool: currentTool,
        color: currentColor,
        brushSize,
        points: currentPath
      };

      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(action);
        return newHistory;
      });
      
      setHistoryIndex(prev => prev + 1);
      setCurrentPath([]);
    }
  }, [isDrawing, currentPath, currentTool, currentColor, brushSize, historyIndex]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  // Save as JPG
  const saveAsJPG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kids-paint-art-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 'image/jpeg', 0.9);
  }, []);

  // Undo last action
  const undo = useCallback(() => {
    if (historyIndex < 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw all actions up to historyIndex - 1
    const actionsToRedraw = history.slice(0, historyIndex);
    actionsToRedraw.forEach(action => {
      if (action.points.length < 2) return;

      ctx.globalCompositeOperation = action.tool === 'eraser' ? 'destination-out' : 'source-over';
      ctx.strokeStyle = action.color;
      ctx.lineWidth = action.brushSize;
      ctx.globalAlpha = action.tool === 'marker' ? 0.8 : 1;

      switch (action.tool) {
        case 'brush':
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          break;
        case 'marker':
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          break;
        case 'pencil':
          ctx.lineCap = 'square';
          ctx.lineJoin = 'miter';
          break;
        case 'eraser':
          ctx.globalAlpha = 1;
          break;
      }

      ctx.beginPath();
      ctx.moveTo(action.points[0].x, action.points[0].y);
      for (let i = 1; i < action.points.length; i++) {
        ctx.lineTo(action.points[i].x, action.points[i].y);
      }
      ctx.stroke();
    });

    setHistoryIndex(prev => prev - 1);
  }, [history, historyIndex]);

  // Redo action
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const nextAction = history[historyIndex + 1];
    if (!nextAction || nextAction.points.length < 2) return;

    ctx.globalCompositeOperation = nextAction.tool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = nextAction.color;
    ctx.lineWidth = nextAction.brushSize;
    ctx.globalAlpha = nextAction.tool === 'marker' ? 0.8 : 1;

    switch (nextAction.tool) {
      case 'brush':
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'marker':
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        break;
      case 'pencil':
        ctx.lineCap = 'square';
        ctx.lineJoin = 'miter';
        break;
      case 'eraser':
        ctx.globalAlpha = 1;
        break;
    }

    ctx.beginPath();
    ctx.moveTo(nextAction.points[0].x, nextAction.points[0].y);
    for (let i = 1; i < nextAction.points.length; i++) {
      ctx.lineTo(nextAction.points[i].x, nextAction.points[i].y);
    }
    ctx.stroke();

    setHistoryIndex(prev => prev + 1);
  }, [history, historyIndex]);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleMouseLeave = () => stopDrawing();

    // Touch events
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    // Custom events
    const handleClear = () => clearCanvas();
    const handleSave = () => saveAsJPG();
    const handleUndo = () => undo();
    const handleRedo = () => redo();

    // Add event listeners
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    window.addEventListener('saveCanvas', handleSave);
    window.addEventListener('clearCanvas', handleClear);
    window.addEventListener('undoCanvas', handleUndo);
    window.addEventListener('redoCanvas', handleRedo);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);

      window.removeEventListener('saveCanvas', handleSave);
      window.removeEventListener('clearCanvas', handleClear);
      window.removeEventListener('undoCanvas', handleUndo);
      window.removeEventListener('redoCanvas', handleRedo);
    };
  }, [startDrawing, draw, stopDrawing, clearCanvas, saveAsJPG, undo, redo]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Canvas Container */}
      <div className="relative border-4 border-purple-300 rounded-2xl overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair touch-none"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            maxWidth: '100%'
          }}
        />
        
        {/* Drawing indicator */}
        {isDrawing && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            ✏️ Drawing...
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="text-center text-purple-600">
        <p className="text-sm">
          Current: <span className="font-bold">{currentTool}</span> | 
          Size: <span className="font-bold">{brushSize}px</span> | 
          Color: <span className="font-bold">{currentColor}</span>
        </p>
        <p className="text-xs mt-1">
          {isDrawing ? 'Drawing in progress...' : 'Click and drag to draw!'}
        </p>
      </div>
    </div>
  );
}