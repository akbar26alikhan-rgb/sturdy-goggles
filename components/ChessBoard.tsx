import React from 'react';
import { Piece, PlayerColor, Position } from '../lib/chess-types';

interface ChessBoardProps {
  board: (Piece | null)[][];
  selectedSquare: Position | null;
  validMoves: Position[];
  onSquareClick: (row: number, col: number) => void;
  playerColor: PlayerColor;
  lastMove: { from: Position; to: Position } | null;
}

const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedSquare,
  validMoves,
  onSquareClick,
  playerColor,
  lastMove,
}) => {
  const isDarkSquare = (r: number, c: number) => (r + c) % 2 === 1;

  const getPieceEmoji = (piece: Piece) => {
    const pieces: Record<string, Record<PlayerColor, string>> = {
      pawn: { white: '♙', black: '♟' },
      knight: { white: '♘', black: '♞' },
      bishop: { white: '♗', black: '♝' },
      rook: { white: '♖', black: '♜' },
      queen: { white: '♕', black: '♛' },
      king: { white: '♔', black: '♚' },
    };
    return pieces[piece.type][piece.color];
  };

  const isValidMove = (r: number, c: number) => {
    return validMoves.some(m => m.row === r && m.col === c);
  };

  const isSelected = (r: number, c: number) => {
    return selectedSquare?.row === r && selectedSquare?.col === c;
  };

  const isLastMove = (r: number, c: number) => {
    return (lastMove?.from.row === r && lastMove?.from.col === c) ||
           (lastMove?.to.row === r && lastMove?.to.col === c);
  };

  const renderSquare = (r: number, c: number) => {
    const piece = board[r][c];
    const dark = isDarkSquare(r, c);
    const selected = isSelected(r, c);
    const valid = isValidMove(r, c);
    const highlight = isLastMove(r, c);

    return (
      <div
        key={`${r}-${c}`}
        onClick={() => onSquareClick(r, c)}
        className={`
          relative w-full h-full flex items-center justify-center cursor-pointer
          ${dark ? 'bg-slate-700/80' : 'bg-slate-200/80'}
          ${selected ? 'ring-4 ring-yellow-400 z-10' : ''}
          ${highlight ? 'bg-yellow-200/30' : ''}
          transition-all duration-200 hover:opacity-90
          group
        `}
        style={{
          backgroundColor: dark ? '#2d3748' : '#e2e8f0',
          backgroundImage: dark 
            ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)'
            : 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '8px 8px',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)',
        }}
      >
        {/* Stone Texture Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3F%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
               mixBlendMode: 'overlay'
             }} 
        />
        {/* Piece */}
        {piece && (
          <span className={`
            text-4xl md:text-5xl lg:text-6xl select-none transition-transform group-hover:scale-110
            ${piece.color === 'white' ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-slate-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]'}
          `}>
            {getPieceEmoji(piece)}
          </span>
        )}

        {/* Move indicator */}
        {valid && (
          <div className="absolute w-4 h-4 bg-green-500/50 rounded-full border-2 border-green-600 animate-pulse" />
        )}
        
        {/* Capture indicator */}
        {valid && piece && (
          <div className="absolute inset-0 border-4 border-red-500/50 rounded-none" />
        )}
      </div>
    );
  };

  const rows = playerColor === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const cols = playerColor === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];

  return (
    <div className="aspect-square w-full max-w-[600px] border-8 border-slate-800 rounded-lg shadow-2xl overflow-hidden grid grid-cols-8 grid-rows-8 bg-slate-900">
      {rows.map(r => cols.map(c => renderSquare(r, c)))}
    </div>
  );
};

export default ChessBoard;
