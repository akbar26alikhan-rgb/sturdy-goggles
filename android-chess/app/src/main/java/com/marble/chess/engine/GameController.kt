package com.marble.chess.engine

import com.github.bhlangonijr.chesslib.*
import com.github.bhlangonijr.chesslib.move.*

sealed class GameMode {
    object PVP : GameMode()
    data class AI(val difficulty: Difficulty, val playerColor: Side) : GameMode()
}

enum class Difficulty(val depth: Int, val skillLevel: Int) {
    EASY(5, 5),
    MEDIUM(10, 10),
    HARD(15, 15),
    EXPERT(20, 20)
}

sealed class GameState {
    object Ongoing : GameState()
    data class Check(val side: Side) : GameState()
    data class Checkmate(val winner: Side) : GameState()
    object Stalemate : GameState()
    object Draw : GameState()
}

data class Position(val file: Int, val rank: Int) {
    fun toSquare(): Square = Square.squareAt(file + rank * 8)
}

fun Square.toPosition(): Position = Position(file.ordinal, rank.ordinal)

class GameController {
    private val board = Board()
    private val moveHistory = mutableListOf<MoveBackup>()
    private var selectedSquare: Square? = null
    private var legalMoves: List<Move> = emptyList()
    private var lastMove: Move? = null
    var gameMode: GameMode = GameMode.PVP
        private set

    fun getBoard(): Board = board

    fun getSideToMove(): Side = board.sideToMove

    fun getSelectedSquare(): Square? = selectedSquare

    fun getLegalMoves(): List<Move> = legalMoves

    fun getLastMove(): Move? = lastMove

    fun setGameMode(mode: GameMode) {
        gameMode = mode
    }

    fun selectSquare(square: Square): Boolean {
        val piece = board.getPiece(square)

        // If clicking on a piece of the current side, select it
        if (piece != Piece.NONE && piece.pieceSide == board.sideToMove) {
            // Check if this side can move in current mode
            if (!canCurrentSideMove()) return false

            selectedSquare = square
            legalMoves = board.legalMoves().filter { it.source == square }
            return true
        }

        // If we have a selected square, try to move
        selectedSquare?.let { from ->
            val move = findMove(from, square)
            if (move != null) {
                return false // Move should be executed separately
            }
        }

        selectedSquare = null
        legalMoves = emptyList()
        return false
    }

    fun makeMove(from: Square, to: Square, promotion: Piece = Piece.NONE): Boolean {
        val move = findMove(from, to) ?: return false

        val actualMove = if (move.promotion != Piece.NONE && promotion != Piece.NONE) {
            Move(move.source, move.destination, promotion)
        } else {
            move
        }

        return executeMove(actualMove)
    }

    fun makeMove(move: Move): Boolean = executeMove(move)

    private fun executeMove(move: Move): Boolean {
        if (!board.legalMoves().contains(move)) return false

        val backup = board.backup
        moveHistory.add(backup)
        board.doMove(move)
        lastMove = move
        selectedSquare = null
        legalMoves = emptyList()
        return true
    }

    fun makePromotionMove(from: Square, to: Square, promotionPiece: Piece): Boolean {
        val move = Move(from, to, promotionPiece)
        return executeMove(move)
    }

    fun isPromotionMove(from: Square, to: Square): Boolean {
        val move = findMove(from, to) ?: return false
        return move.promotion != Piece.NONE
    }

    private fun findMove(from: Square, to: Square): Move? {
        return board.legalMoves().find { it.source == from && it.destination == to }
    }

    fun canCurrentSideMove(): Boolean {
        return when (val mode = gameMode) {
            is GameMode.PVP -> true
            is GameMode.AI -> board.sideToMove == mode.playerColor
        }
    }

    fun isAITurn(): Boolean {
        return when (val mode = gameMode) {
            is GameMode.PVP -> false
            is GameMode.AI -> board.sideToMove != mode.playerColor
        }
    }

    fun getGameState(): GameState {
        if (board.isMated) {
            val winner = if (board.sideToMove == Side.WHITE) Side.BLACK else Side.WHITE
            return GameState.Checkmate(winner)
        }
        if (board.isStaleMate) return GameState.Stalemate
        if (board.isDraw) return GameState.Draw
        if (board.isKingAttacked) return GameState.Check(board.sideToMove)
        return GameState.Ongoing
    }

    fun undo(): Boolean {
        if (moveHistory.isEmpty()) return false

        // In AI mode, undo twice to get back to player's turn
        val undos = if (gameMode is GameMode.AI && moveHistory.size >= 2) 2 else 1

        repeat(undos) {
            if (moveHistory.isNotEmpty()) {
                val backup = moveHistory.removeAt(moveHistory.size - 1)
                board.undoMove(backup)
            }
        }

        selectedSquare = null
        legalMoves = emptyList()
        lastMove = moveHistory.lastOrNull()?.move
        return true
    }

    fun getAllLegalMoves(): List<Move> = board.legalMoves()

    fun getFen(): String = board.fen

    fun loadFen(fen: String): Boolean {
        return try {
            board.loadFromFen(fen)
            moveHistory.clear()
            selectedSquare = null
            legalMoves = emptyList()
            lastMove = null
            true
        } catch (e: Exception) {
            false
        }
    }

    fun newGame() {
        board.loadFromFen(Constants.STARTING_POSITION)
        moveHistory.clear()
        selectedSquare = null
        legalMoves = emptyList()
        lastMove = null
    }
}
