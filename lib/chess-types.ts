export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type PlayerColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PlayerColor;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isCastling?: 'kingside' | 'queenside';
  isEnPassant?: boolean;
  isPromotion?: boolean;
  promotionType?: PieceType;
  prevCastlingRights?: CastlingRights;
  prevEnPassantTarget?: Position | null;
}

export interface CastlingRights {
  white: {
    kingside: boolean;
    queenside: boolean;
  };
  black: {
    kingside: boolean;
    queenside: boolean;
  };
}

export interface GameState {
  board: (Piece | null)[][];
  turn: PlayerColor;
  history: Move[];
  castlingRights: CastlingRights;
  enPassantTarget: Position | null;
  status: 'playing' | 'checkmate' | 'stalemate' | 'draw';
  winner: PlayerColor | 'draw' | null;
}
