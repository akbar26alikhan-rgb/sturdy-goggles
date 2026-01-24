'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BrushSize, Tool } from '@/types/paint';

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

function getToolLineWidth(tool: Tool, brushSize: number) {
  switch (tool) {
    case 'marker':
      return brushSize * 1.8;
    case 'pencil':
      return Math.max(1, brushSize * 0.6);
    case 'eraser':
      return brushSize * 1.4;
    default:
      return brushSize;
  }
}

function applyToolSettings(ctx: CanvasRenderingContext2D, tool: Tool, color: string, brushSize: number) {
  ctx.globalAlpha = tool === 'marker' ? 0.8 : 1;
  ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';
  ctx.strokeStyle = color;
  ctx.lineWidth = getToolLineWidth(tool, brushSize);

  if (tool === 'pencil') {
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
  } else {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
}

function clearToWhite(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.restore();
}

function drawAction(ctx: CanvasRenderingContext2D, action: DrawingAction) {
  if (action.points.length === 0) return;

  applyToolSettings(ctx, action.tool, action.color, action.brushSize);

  if (action.points.length === 1) {
    const p = action.points[0];
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(action.points[0].x, action.points[0].y);
  for (let i = 1; i < action.points.length; i++) {
    ctx.lineTo(action.points[i].x, action.points[i].y);
  }
  ctx.stroke();
}

export default function DrawingCanvas({ currentTool, currentColor, brushSize }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDrawingRef = useRef(false);
  const currentPathRef = useRef<Point[]>([]);

  const historyRef = useRef<DrawingAction[]>([]);
  const historyIndexRef = useRef(-1);

  const [isDrawing, setIsDrawing] = useState(false);
  const [displaySize, setDisplaySize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  const getCanvasContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  const redrawFromHistory = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx) return;

    clearToWhite(ctx);

    const index = historyIndexRef.current;
    for (let i = 0; i <= index; i++) {
      const action = historyRef.current[i];
      if (action) drawAction(ctx, action);
    }
  }, [getCanvasContext]);

  const clearCanvas = useCallback(() => {
    const ctx = getCanvasContext();
    if (!ctx) return;

    isDrawingRef.current = false;
    currentPathRef.current = [];
    setIsDrawing(false);

    historyRef.current = [];
    historyIndexRef.current = -1;
    clearToWhite(ctx);
  }, [getCanvasContext]);

  const saveAsJPG = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = CANVAS_WIDTH;
    exportCanvas.height = CANVAS_HEIGHT;

    const exportCtx = exportCanvas.getContext('2d');
    if (!exportCtx) return;

    exportCtx.fillStyle = '#FFFFFF';
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0, exportCanvas.width, exportCanvas.height);

    exportCanvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kids-paint-art-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      0.9
    );
  }, []);

  const undo = useCallback(() => {
    if (historyIndexRef.current < 0) return;

    isDrawingRef.current = false;
    currentPathRef.current = [];
    setIsDrawing(false);

    historyIndexRef.current -= 1;
    redrawFromHistory();
  }, [redrawFromHistory]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;

    isDrawingRef.current = false;
    currentPathRef.current = [];
    setIsDrawing(false);

    historyIndexRef.current += 1;
    redrawFromHistory();
  }, [redrawFromHistory]);

  const getPosition = useCallback((e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const startDrawing = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      if ('button' in e && e.button !== 0) return;

      const ctx = getCanvasContext();
      if (!ctx) return;

      const point = getPosition(e);

      isDrawingRef.current = true;
      currentPathRef.current = [point];
      setIsDrawing(true);

      applyToolSettings(ctx, currentTool, currentColor, brushSize);
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    },
    [brushSize, currentColor, currentTool, getCanvasContext, getPosition]
  );

  const draw = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawingRef.current) return;

      const ctx = getCanvasContext();
      if (!ctx) return;

      const point = getPosition(e);
      const lastPoint = currentPathRef.current[currentPathRef.current.length - 1];
      currentPathRef.current.push(point);

      applyToolSettings(ctx, currentTool, currentColor, brushSize);

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
      }
    },
    [brushSize, currentColor, currentTool, getCanvasContext, getPosition]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;

    isDrawingRef.current = false;
    setIsDrawing(false);

    const points = currentPathRef.current;
    currentPathRef.current = [];

    if (points.length === 0) return;

    const action: DrawingAction = {
      tool: currentTool,
      color: currentColor,
      brushSize,
      points
    };

    const upToIndex = historyRef.current.slice(0, historyIndexRef.current + 1);
    upToIndex.push(action);
    historyRef.current = upToIndex;
    historyIndexRef.current = upToIndex.length - 1;
  }, [brushSize, currentColor, currentTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;

    clearToWhite(ctx);
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      const maxWidth = Math.min(container.clientWidth - 32, CANVAS_WIDTH);
      const width = Math.max(280, maxWidth);
      const height = width * (CANVAS_HEIGHT / CANVAS_WIDTH);

      setDisplaySize({ width, height });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const passiveFalse: AddEventListenerOptions = { passive: false };

    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => stopDrawing();
    const handleMouseLeave = () => stopDrawing();

    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => stopDrawing();

    const handleClear = () => clearCanvas();
    const handleSave = () => saveAsJPG();
    const handleUndo = () => undo();
    const handleRedo = () => redo();

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    window.addEventListener('mouseup', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart, passiveFalse);
    canvas.addEventListener('touchmove', handleTouchMove, passiveFalse);

    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    window.addEventListener('saveCanvas', handleSave);
    window.addEventListener('clearCanvas', handleClear);
    window.addEventListener('undoCanvas', handleUndo);
    window.addEventListener('redoCanvas', handleRedo);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);

      window.removeEventListener('mouseup', handleMouseUp);

      canvas.removeEventListener('touchstart', handleTouchStart, passiveFalse);
      canvas.removeEventListener('touchmove', handleTouchMove, passiveFalse);

      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);

      window.removeEventListener('saveCanvas', handleSave);
      window.removeEventListener('clearCanvas', handleClear);
      window.removeEventListener('undoCanvas', handleUndo);
      window.removeEventListener('redoCanvas', handleRedo);
    };
  }, [clearCanvas, draw, redo, saveAsJPG, startDrawing, stopDrawing, undo]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative border-4 border-purple-300 rounded-2xl overflow-hidden shadow-lg">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair touch-none"
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            maxWidth: '100%',
            touchAction: 'none'
          }}
        />

        {isDrawing && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
            ✏️ Drawing...
          </div>
        )}
      </div>

      <div className="text-center text-purple-600">
        <p className="text-sm">
          Current: <span className="font-bold">{currentTool}</span> | Size:{' '}
          <span className="font-bold">{brushSize}px</span> | Color:{' '}
          <span className="font-bold">{currentColor}</span>
        </p>
        <p className="text-xs mt-1">{isDrawing ? 'Drawing in progress...' : 'Click and drag to draw!'}</p>
      </div>
    </div>
  );
}
