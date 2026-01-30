import { GameState, Position, PlayerColor, Piece, PieceType } from './chess-types';
import { getValidMoves, makeMove } from './chess-engine';

const PIECE_VALUES: Record<PieceType, number> = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900,
};

// Simplified piece-square tables for better positioning
const PAWN_PST = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 5, 5, 5, 5, 5, 5, 5],
  [1, 1, 2, 3, 3, 2, 1, 1],
  [0.5, 0.5, 1, 2.5, 2.5, 1, 0.5, 0.5],
  [0, 0, 0, 2, 2, 0, 0, 0],
  [0.5, -0.5, -1, 0, 0, -1, -0.5, 0.5],
  [0.5, 1, 1, -2, -2, 1, 1, 0.5],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const KNIGHT_PST = [
  [-5, -4, -3, -3, -3, -3, -4, -5],
  [-4, -2, 0, 0, 0, 0, -2, -4],
  [-3, 0, 1, 1.5, 1.5, 1, 0, -3],
  [-3, 0.5, 1.5, 2, 2, 1.5, 0.5, -3],
  [-3, 0, 1.5, 2, 2, 1.5, 0, -3],
  [-3, 0.5, 1, 1.5, 1.5, 1, 0.5, -3],
  [-4, -2, 0, 0.5, 0.5, 0, -2, -4],
  [-5, -4, -3, -3, -3, -3, -4, -5]
];

const BISHOP_PST = [
    [-2, -1, -1, -1, -1, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 1, 1, 0.5, 0, -1],
    [-1, 0.5, 0.5, 1, 1, 0.5, 0.5, -1],
    [-1, 0, 1, 1, 1, 1, 0, -1],
    [-1, 1, 1, 1, 1, 1, 1, -1],
    [-1, 0.5, 0, 0, 0, 0, 0.5, -1],
    [-2, -1, -1, -1, -1, -1, -1, -2]
];

const ROOK_PST = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0.5, 1, 1, 1, 1, 1, 1, 0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [-0.5, 0, 0, 0, 0, 0, 0, -0.5],
    [0, 0, 0, 0.5, 0.5, 0, 0, 0]
];

const QUEEN_PST = [
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2],
    [-1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-0.5, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [0, 0, 0.5, 0.5, 0.5, 0.5, 0, -0.5],
    [-1, 0.5, 0.5, 0.5, 0.5, 0.5, 0, -1],
    [-1, 0, 0.5, 0, 0, 0, 0, -1],
    [-2, -1, -1, -0.5, -0.5, -1, -1, -2]
];

const KING_PST = [
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-3, -4, -4, -5, -5, -4, -4, -3],
    [-2, -3, -3, -4, -4, -3, -3, -2],
    [-1, -2, -2, -2, -2, -2, -2, -1],
    [2, 2, 0, 0, 0, 0, 2, 2],
    [2, 3, 1, 0, 0, 1, 3, 2]
];

function evaluateBoard(state: GameState): number {
  let totalEvaluation = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      totalEvaluation += getPieceValue(state.board[r][c], r, c);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece: Piece | null, row: number, col: number): number {
  if (!piece) return 0;

  const getAbsoluteValue = (p: Piece, r: number, c: number) => {
    let value = PIECE_VALUES[p.type];
    
    // Add positional bonus
    const tableRow = p.color === 'white' ? r : 7 - r;
    const tableCol = c;
    
    switch (p.type) {
      case 'pawn': value += PAWN_PST[tableRow][tableCol]; break;
      case 'knight': value += KNIGHT_PST[tableRow][tableCol]; break;
      case 'bishop': value += BISHOP_PST[tableRow][tableCol]; break;
      case 'rook': value += ROOK_PST[tableRow][tableCol]; break;
      case 'queen': value += QUEEN_PST[tableRow][tableCol]; break;
      case 'king': value += KING_PST[tableRow][tableCol]; break;
    }
    return value;
  };

  const absoluteValue = getAbsoluteValue(piece, row, col);
  return piece.color === 'white' ? absoluteValue : -absoluteValue;
}

export function findBestMove(state: GameState, depth: number): { from: Position; to: Position } | null {
  const isMaximizingPlayer = state.turn === 'white';
  const bestMove = minimax(state, depth, -Infinity, Infinity, isMaximizingPlayer);
  return bestMove.move;
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean
): { score: number; move: { from: Position; to: Position } | null } {
  if (depth === 0 || state.status !== 'playing') {
    return { score: evaluateBoard(state), move: null };
  }

  const moves = getAllValidMoves(state, state.turn);
  
  // Sort moves to improve pruning (captures first)
  moves.sort((a, b) => {
    const scoreA = (state.board[a.to.row][a.to.col] ? PIECE_VALUES[state.board[a.to.row][a.to.col]!.type] : 0);
    const scoreB = (state.board[b.to.row][b.to.col] ? PIECE_VALUES[state.board[b.to.row][b.to.col]!.type] : 0);
    return scoreB - scoreA;
  });

  let bestMove = null;

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const nextState = makeMove(state, move.from, move.to);
      const evalResult = minimax(nextState, depth - 1, alpha, beta, false);
      if (evalResult.score > maxEval) {
        maxEval = evalResult.score;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const nextState = makeMove(state, move.from, move.to);
      const evalResult = minimax(nextState, depth - 1, alpha, beta, true);
      if (evalResult.score < minEval) {
        minEval = evalResult.score;
        bestMove = move;
      }
      beta = Math.min(beta, evalResult.score);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

function getAllValidMoves(state: GameState, color: PlayerColor): { from: Position; to: Position }[] {
  const allMoves: { from: Position; to: Position }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(state, { row: r, col: c });
        for (const to of moves) {
          allMoves.push({ from: { row: r, col: c }, to });
        }
      }
    }
  }
  return allMoves;
}
