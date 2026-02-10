'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ChessBoard from '../../components/ChessBoard';
import GameControls from '../../components/GameControls';
import DiceRoller from '../../components/DiceRoller';
import { GameState, Position, PlayerColor } from '../../lib/chess-types';
import { createInitialState, getValidMoves, makeMove, undoMove } from '../../lib/chess-engine';
import { findBestMove } from '../../lib/ai-engine';

export default function ChessPage() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [playerColor, setPlayerColor] = useState<PlayerColor>('white');
  const [aiThinking, setAiThinking] = useState(false);

  // AI Move effect
  useEffect(() => {
    if (gameState.status === 'playing' && gameState.turn !== playerColor) {
      // Small delay to make it feel more natural
      const timer = setTimeout(() => {
        setAiThinking(true);
        // Use another timeout to allow the thinking state to render
        const moveTimer = setTimeout(() => {
          const move = findBestMove(gameState, 3);
          if (move) {
            setGameState(prev => makeMove(prev, move.from, move.to));
          }
          setAiThinking(false);
        }, 50);
        return () => clearTimeout(moveTimer);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameState, playerColor]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameState.status !== 'playing' || aiThinking || gameState.turn !== playerColor) return;

    const clickedPos = { row, col };
    const piece = gameState.board[row][col];

    // If a square is already selected
    if (selectedSquare) {
      const isValid = validMoves.some(m => m.row === row && m.col === col);
      
      if (isValid) {
        // Make the move
        const nextState = makeMove(gameState, selectedSquare, clickedPos);
        setGameState(nextState);
        setSelectedSquare(null);
        setValidMoves([]);
        return;
      }
    }

    // Select a piece
    if (piece && piece.color === playerColor) {
      setSelectedSquare(clickedPos);
      setValidMoves(getValidMoves(gameState, clickedPos));
    } else {
      setSelectedSquare(null);
      setValidMoves([]);
    }
  }, [gameState, selectedSquare, validMoves, playerColor, aiThinking]);

  const handleNewGame = () => {
    setGameState(createInitialState());
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const handleUndo = () => {
    if (aiThinking) return;
    // Undo twice if it's the player's turn (undo AI move and player's move)
    let nextState = undoMove(gameState);
    if (nextState.turn !== playerColor) {
      nextState = undoMove(nextState);
    }
    setGameState(nextState);
    setSelectedSquare(null);
    setValidMoves([]);
  };

  const handleColorChange = (color: PlayerColor) => {
    setPlayerColor(color);
    handleNewGame();
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-2 tracking-tighter bg-gradient-to-b from-slate-100 to-slate-500 bg-clip-text text-transparent">
            MARBLE CHESS
          </h1>
          <p className="text-slate-400 font-medium">Single Player Strategy Game</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-12 items-start justify-center w-full">
          <div className="flex-1 flex flex-col items-center gap-4 w-full">
            <div className="relative w-full max-w-[600px]">
              {aiThinking && (
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-lg pointer-events-none">
                  <div className="bg-slate-800 px-6 py-3 rounded-full border border-slate-600 shadow-2xl flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="font-bold text-blue-400 animate-pulse">AI is thinking...</span>
                  </div>
                </div>
              )}
              <ChessBoard
                board={gameState.board}
                selectedSquare={selectedSquare}
                validMoves={validMoves}
                onSquareClick={handleSquareClick}
                playerColor={playerColor}
                lastMove={gameState.history.length > 0 ? gameState.history[gameState.history.length - 1] : null}
              />
            </div>
            
            <div className="flex justify-between w-full max-w-[600px] px-2 text-sm text-slate-500 font-mono">
              <div className="flex gap-4">
                <span>WHITE: {playerColor === 'white' ? 'YOU' : 'AI'}</span>
                <span>BLACK: {playerColor === 'black' ? 'YOU' : 'AI'}</span>
              </div>
              <div>TURN: {gameState.history.length + 1}</div>
            </div>
          </div>

          <aside className="flex flex-col gap-6 w-full lg:w-auto">
            <GameControls
              state={gameState}
              onNewGame={handleNewGame}
              onUndo={handleUndo}
              onColorChange={handleColorChange}
              playerColor={playerColor}
            />
            <DiceRoller />
          </aside>
        </main>
      </div>
      
      <footer className="mt-12 text-center text-slate-600 text-sm">
        <p>Built with Next.js, TypeScript, and Tailwind CSS. No external chess libraries.</p>
      </footer>
    </div>
  );
}
