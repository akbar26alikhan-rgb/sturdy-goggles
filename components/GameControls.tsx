import React from 'react';
import { PlayerColor, GameState } from '../lib/chess-types';

interface GameControlsProps {
  state: GameState;
  onNewGame: () => void;
  onUndo: () => void;
  onColorChange: (color: PlayerColor) => void;
  playerColor: PlayerColor;
}

const GameControls: React.FC<GameControlsProps> = ({
  state,
  onNewGame,
  onUndo,
  onColorChange,
  playerColor,
}) => {
  const getStatusMessage = () => {
    if (state.status === 'checkmate') {
      return `Checkmate! ${state.winner === 'white' ? 'White' : 'Black'} wins!`;
    }
    if (state.status === 'stalemate') {
      return "Stalemate! It's a draw.";
    }
    if (state.status === 'draw') {
      return "Draw!";
    }
    return `${state.turn === 'white' ? "White's" : "Black's"} turn`;
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-xl text-slate-100 w-full max-w-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2 text-slate-200">Game Status</h2>
        <p className={`text-lg font-medium p-2 rounded ${
          state.status !== 'playing' ? 'bg-red-500/20 text-red-300' : 'bg-slate-700/50'
        }`}>
          {getStatusMessage()}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-slate-700/30 p-3 rounded-lg border border-slate-600">
          <span>Play as:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onColorChange('white')}
              disabled={state.history.length > 0}
              className={`px-3 py-1 rounded transition-colors ${
                playerColor === 'white' 
                  ? 'bg-slate-100 text-slate-900 font-bold' 
                  : 'bg-slate-600 hover:bg-slate-500 disabled:opacity-50'
              }`}
            >
              White
            </button>
            <button
              onClick={() => onColorChange('black')}
              disabled={state.history.length > 0}
              className={`px-3 py-1 rounded transition-colors ${
                playerColor === 'black' 
                  ? 'bg-slate-900 text-slate-100 font-bold' 
                  : 'bg-slate-600 hover:bg-slate-500 disabled:opacity-50'
              }`}
            >
              Black
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onNewGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold shadow-lg transition-all active:scale-95"
          >
            New Game
          </button>
          <button
            onClick={onUndo}
            disabled={state.history.length === 0}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Undo Move
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-slate-300">Move History</h3>
        <div className="h-48 overflow-y-auto bg-slate-900/50 rounded p-2 border border-slate-700 font-mono text-sm">
          {state.history.length === 0 ? (
            <p className="text-slate-500 italic text-center py-4">No moves yet</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4">
              {Array.from({ length: Math.ceil(state.history.length / 2) }).map((_, i) => (
                <React.Fragment key={i}>
                  <div className="text-slate-400 border-b border-slate-800 py-1">
                    {i + 1}. {state.history[i * 2].piece.type === 'pawn' ? '' : state.history[i * 2].piece.type[0].toUpperCase()}
                    {String.fromCharCode(97 + state.history[i * 2].to.col)}{8 - state.history[i * 2].to.row}
                  </div>
                  <div className="text-slate-200 border-b border-slate-800 py-1">
                    {state.history[i * 2 + 1] ? (
                      <>
                        {state.history[i * 2 + 1].piece.type === 'pawn' ? '' : state.history[i * 2 + 1].piece.type[0].toUpperCase()}
                        {String.fromCharCode(97 + state.history[i * 2 + 1].to.col)}{8 - state.history[i * 2 + 1].to.row}
                      </>
                    ) : ''}
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameControls;
