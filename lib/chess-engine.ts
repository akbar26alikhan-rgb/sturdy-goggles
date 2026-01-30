import { Piece, PieceType, PlayerColor, Position, Move, GameState } from './chess-types';

export const INITIAL_BOARD: (Piece | null)[][] = createInitialBoard();

function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

  // Set up black pieces
  for (let i = 0; i < 8; i++) {
    board[0][i] = { type: pieceOrder[i], color: 'black' };
    board[1][i] = { type: 'pawn', color: 'black' };
  }

  // Set up white pieces
  for (let i = 0; i < 8; i++) {
    board[6][i] = { type: 'pawn', color: 'white' };
    board[7][i] = { type: pieceOrder[i], color: 'white' };
  }

  return board;
}

export function createInitialState(): GameState {
  return {
    board: createInitialBoard(),
    turn: 'white',
    history: [],
    castlingRights: {
      white: { kingside: true, queenside: true },
      black: { kingside: true, queenside: true },
    },
    enPassantTarget: null,
    status: 'playing',
    winner: null,
  };
}

export function getValidMoves(state: GameState, pos: Position): Position[] {
  const piece = state.board[pos.row][pos.col];
  if (!piece || piece.color !== state.turn) return [];

  const moves: Position[] = [];
  const candidates = getCandidateMoves(state, pos);

  for (const to of candidates) {
    if (!wouldBeInCheck(state, pos, to)) {
      moves.push(to);
    }
  }

  return moves;
}

function getCandidateMoves(state: GameState, pos: Position): Position[] {
  const piece = state.board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col } = pos;
  const color = piece.color;
  const opponentColor = color === 'white' ? 'black' : 'white';

  switch (piece.type) {
    case 'pawn': {
      const direction = color === 'white' ? -1 : 1;
      const startRow = color === 'white' ? 6 : 1;

      // Move one step forward
      if (isValidCoord(row + direction, col) && !state.board[row + direction][col]) {
        moves.push({ row: row + direction, col });
        // Move two steps forward
        if (row === startRow && !state.board[row + 2 * direction][col]) {
          moves.push({ row: row + 2 * direction, col });
        }
      }

      // Captures
      for (const offset of [-1, 1]) {
        const nextRow = row + direction;
        const nextCol = col + offset;
        if (isValidCoord(nextRow, nextCol)) {
          const target = state.board[nextRow][nextCol];
          if (target && target.color === opponentColor) {
            moves.push({ row: nextRow, col: nextCol });
          } else if (state.enPassantTarget && state.enPassantTarget.row === nextRow && state.enPassantTarget.col === nextCol) {
            moves.push({ row: nextRow, col: nextCol });
          }
        }
      }
      break;
    }
    case 'knight': {
      const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc;
        if (isValidCoord(nr, nc)) {
          const target = state.board[nr][nc];
          if (!target || target.color === opponentColor) {
            moves.push({ row: nr, col: nc });
          }
        }
      }
      break;
    }
    case 'bishop':
      moves.push(...getSlidingMoves(state, pos, [[-1, -1], [-1, 1], [1, -1], [1, 1]]));
      break;
    case 'rook':
      moves.push(...getSlidingMoves(state, pos, [[-1, 0], [1, 0], [0, -1], [0, 1]]));
      break;
    case 'queen':
      moves.push(...getSlidingMoves(state, pos, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]));
      break;
    case 'king': {
      const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc;
        if (isValidCoord(nr, nc)) {
          const target = state.board[nr][nc];
          if (!target || target.color === opponentColor) {
            moves.push({ row: nr, col: nc });
          }
        }
      }

      // Castling
      if (!isSquareAttacked(state, pos, opponentColor)) {
        const rights = state.castlingRights[color];
        if (rights.kingside) {
          if (!state.board[row][col + 1] && !state.board[row][col + 2] &&
              !isSquareAttacked(state, { row, col: col + 1 }, opponentColor)) {
            moves.push({ row, col: col + 2 });
          }
        }
        if (rights.queenside) {
          if (!state.board[row][col - 1] && !state.board[row][col - 2] && !state.board[row][col - 3] &&
              !isSquareAttacked(state, { row, col: col - 1 }, opponentColor)) {
            moves.push({ row, col: col - 2 });
          }
        }
      }
      break;
    }
  }

  return moves;
}

function getSlidingMoves(state: GameState, pos: Position, directions: number[][]): Position[] {
  const moves: Position[] = [];
  const { row, col } = pos;
  const piece = state.board[row][col]!;
  const opponentColor = piece.color === 'white' ? 'black' : 'white';

  for (const [dr, dc] of directions) {
    let nr = row + dr, nc = col + dc;
    while (isValidCoord(nr, nc)) {
      const target = state.board[nr][nc];
      if (!target) {
        moves.push({ row: nr, col: nc });
      } else {
        if (target.color === opponentColor) {
          moves.push({ row: nr, col: nc });
        }
        break;
      }
      nr += dr;
      nc += dc;
    }
  }
  return moves;
}

function isValidCoord(row: number, col: number): boolean {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function isSquareAttacked(state: GameState, pos: Position, attackerColor: PlayerColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && piece.color === attackerColor) {
        // Special case for pawns
        if (piece.type === 'pawn') {
          const direction = attackerColor === 'white' ? -1 : 1;
          if (pos.row === r + direction && Math.abs(pos.col - c) === 1) return true;
        } else {
          // For other pieces, we check if they could capture the square
          // (without considering recursive check or castling)
          const moves = getRawCandidateMoves(state, { row: r, col: c });
          if (moves.some(m => m.row === pos.row && m.col === pos.col)) return true;
        }
      }
    }
  }
  return false;
}

// Similar to getCandidateMoves but without castling and recursive checks
function getRawCandidateMoves(state: GameState, pos: Position): Position[] {
  const piece = state.board[pos.row][pos.col];
  if (!piece) return [];

  const moves: Position[] = [];
  const { row, col } = pos;
  const color = piece.color;

  switch (piece.type) {
    case 'pawn': {
        // This should not be called for pawns in isSquareAttacked usually, but for completeness:
        const direction = color === 'white' ? -1 : 1;
        for (const offset of [-1, 1]) {
            if (isValidCoord(row + direction, col + offset)) moves.push({ row: row + direction, col: col + offset });
        }
        break;
    }
    case 'knight': {
      const offsets = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
      for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc;
        if (isValidCoord(nr, nc)) moves.push({ row: nr, col: nc });
      }
      break;
    }
    case 'bishop':
      moves.push(...getSlidingMoves(state, pos, [[-1, -1], [-1, 1], [1, -1], [1, 1]]));
      break;
    case 'rook':
      moves.push(...getSlidingMoves(state, pos, [[-1, 0], [1, 0], [0, -1], [0, 1]]));
      break;
    case 'queen':
      moves.push(...getSlidingMoves(state, pos, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]]));
      break;
    case 'king': {
      const offsets = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
      for (const [dr, dc] of offsets) {
        const nr = row + dr, nc = col + dc;
        if (isValidCoord(nr, nc)) moves.push({ row: nr, col: nc });
      }
      break;
    }
  }

  return moves;
}

function wouldBeInCheck(state: GameState, from: Position, to: Position): boolean {
  const nextState = makeMove(state, from, to, 'queen'); // promotionType doesn't matter for check check
  return isInCheck(nextState, state.turn);
}

export function isInCheck(state: GameState, color: PlayerColor): boolean {
  const kingPos = findKing(state, color);
  if (!kingPos) return false;
  const opponentColor = color === 'white' ? 'black' : 'white';
  return isSquareAttacked(state, kingPos, opponentColor);
}

function findKing(state: GameState, color: PlayerColor): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && piece.type === 'king' && piece.color === color) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

export function makeMove(state: GameState, from: Position, to: Position, promotionType: PieceType = 'queen'): GameState {
  const newBoard = state.board.map(row => [...row]);
  const piece = newBoard[from.row][from.col]!;
  const captured = newBoard[to.row][to.col];
  const newHistory = [...state.history];
  const newCastlingRights = JSON.parse(JSON.stringify(state.castlingRights));
  let enPassantTarget: Position | null = null;
  let isEnPassant = false;
  let isCastling: 'kingside' | 'queenside' | undefined = undefined;
  let isPromotion = false;

  // Handle move
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  // Pawn promotion
  if (piece.type === 'pawn') {
    if (to.row === 0 || to.row === 7) {
      newBoard[to.row][to.col] = { type: promotionType, color: piece.color };
      isPromotion = true;
    }

    // Double move -> set en passant target
    if (Math.abs(to.row - from.row) === 2) {
      enPassantTarget = { row: (from.row + to.row) / 2, col: from.col };
    }

    // Handle en passant capture
    if (state.enPassantTarget && to.row === state.enPassantTarget.row && to.col === state.enPassantTarget.col) {
      const capturedPawnRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
      newBoard[capturedPawnRow][to.col] = null;
      isEnPassant = true;
    }
  }

  // Castling
  if (piece.type === 'king') {
    if (Math.abs(to.col - from.col) === 2) {
      const isKingside = to.col > from.col;
      isCastling = isKingside ? 'kingside' : 'queenside';
      const rookFromCol = isKingside ? 7 : 0;
      const rookToCol = isKingside ? 5 : 3;
      const rook = newBoard[from.row][rookFromCol];
      newBoard[from.row][rookToCol] = rook;
      newBoard[from.row][rookFromCol] = null;
    }
    newCastlingRights[piece.color].kingside = false;
    newCastlingRights[piece.color].queenside = false;
  }

  // Update castling rights if rook moved or captured
  if (piece.type === 'rook') {
    if (from.col === 0) newCastlingRights[piece.color].queenside = false;
    if (from.col === 7) newCastlingRights[piece.color].kingside = false;
  }
  if (captured && captured.type === 'rook') {
    const opponentColor = piece.color === 'white' ? 'black' : 'white';
    if (to.row === (opponentColor === 'white' ? 7 : 0)) {
        if (to.col === 0) newCastlingRights[opponentColor].queenside = false;
        if (to.col === 7) newCastlingRights[opponentColor].kingside = false;
    }
  }

  const move: Move = {
    from,
    to,
    piece,
    captured: isEnPassant ? { type: 'pawn', color: piece.color === 'white' ? 'black' : 'white' } : (captured || undefined),
    isCastling,
    isEnPassant,
    isPromotion,
    promotionType: isPromotion ? promotionType : undefined,
    prevCastlingRights: state.castlingRights,
    prevEnPassantTarget: state.enPassantTarget,
  };

  newHistory.push(move);

  const nextTurn = state.turn === 'white' ? 'black' : 'white';
  const nextState: GameState = {
    ...state,
    board: newBoard,
    turn: nextTurn,
    history: newHistory,
    castlingRights: newCastlingRights,
    enPassantTarget,
  };

  // Check for game over
  const hasMoves = hasValidMoves(nextState, nextTurn);
  const inCheck = isInCheck(nextState, nextTurn);

  if (!hasMoves) {
    if (inCheck) {
      nextState.status = 'checkmate';
      nextState.winner = state.turn;
    } else {
      nextState.status = 'stalemate';
      nextState.winner = 'draw';
    }
  }

  return nextState;
}

function hasValidMoves(state: GameState, color: PlayerColor): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = state.board[r][c];
      if (piece && piece.color === color) {
        const moves = getValidMoves(state, { row: r, col: c });
        if (moves.length > 0) return true;
      }
    }
  }
  return false;
}

export function undoMove(state: GameState): GameState {
    if (state.history.length === 0) return state;
    
    // To undo a move, it's easier to just replay the history up to the second to last move
    // Or we can implement a proper undo. Let's try replaying for simplicity and correctness.
    let currentState = createInitialState();
    const historyToReplay = state.history.slice(0, -1);
    
    for (const move of historyToReplay) {
        currentState = makeMove(currentState, move.from, move.to, move.promotionType);
    }
    
    return currentState;
}
