package com.marble.chess.viewmodel

import android.app.Application
import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.github.bhlangonijr.chesslib.Piece
import com.github.bhlangonijr.chesslib.Side
import com.github.bhlangonijr.chesslib.Square
import com.marble.chess.R
import com.marble.chess.engine.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

sealed class UiState {
    object Menu : UiState()
    object Playing : UiState()
    object GameOver : UiState()
}

data class ChessUiState(
    val uiState: UiState = UiState.Menu,
    val gameMode: GameMode = GameMode.PVP,
    val gameState: GameState = GameState.Ongoing,
    val selectedSquare: Square? = null,
    val legalMoves: List<Square> = emptyList(),
    val lastMove: Pair<Square, Square>? = null,
    val isThinking: Boolean = false,
    val promotionSquare: Square? = null,
    val statusMessage: String = "",
    val whiteTime: Long = 0,
    val blackTime: Long = 0,
    val moveHistory: List<String> = emptyList()
)

class ChessViewModel(application: Application) : AndroidViewModel(application) {
    private val gameController = GameController()
    private val engineManager = EngineManager(application)

    private val _uiState = mutableStateOf(ChessUiState())
    val uiState: State<ChessUiState> = _uiState

    private var whitePlayerTime: Long = 0
    private var blackPlayerTime: Long = 0

    init {
        updateStatusMessage()
    }

    fun startGame(mode: GameMode) {
        gameController.newGame()
        gameController.setGameMode(mode)

        if (mode is GameMode.AI) {
            viewModelScope.launch {
                engineManager.initialize(mode.difficulty, if (mode.playerColor == Side.WHITE) Side.BLACK else Side.WHITE)
                if (mode.playerColor == Side.BLACK) {
                    makeAIMove()
                }
            }
        }

        _uiState.value = ChessUiState(
            uiState = UiState.Playing,
            gameMode = mode,
            gameState = GameState.Ongoing
        )
        updateGameState()
    }

    fun onSquareClick(square: Square) {
        if (_uiState.value.isThinking) return
        if (_uiState.value.uiState != UiState.Playing) return

        val selected = _uiState.value.selectedSquare

        if (selected != null) {
            // Try to make a move
            val isLegalMove = _uiState.value.legalMoves.contains(square)

            if (isLegalMove) {
                // Check for promotion
                if (gameController.isPromotionMove(selected, square)) {
                    _uiState.value = _uiState.value.copy(promotionSquare = square)
                    return
                }

                if (gameController.makeMove(selected, square)) {
                    onMoveMade()
                }
            } else {
                // Try to select another piece
                trySelectSquare(square)
            }
        } else {
            trySelectSquare(square)
        }
    }

    private fun trySelectSquare(square: Square) {
        if (gameController.selectSquare(square)) {
            val legalDestinations = gameController.getLegalMoves().map { it.destination }
            _uiState.value = _uiState.value.copy(
                selectedSquare = square,
                legalMoves = legalDestinations
            )
        } else {
            _uiState.value = _uiState.value.copy(
                selectedSquare = null,
                legalMoves = emptyList()
            )
        }
    }

    fun onPromotionSelected(piece: Piece) {
        val selected = _uiState.value.selectedSquare ?: return
        val destination = _uiState.value.promotionSquare ?: return

        if (gameController.makePromotionMove(selected, destination, piece)) {
            _uiState.value = _uiState.value.copy(promotionSquare = null)
            onMoveMade()
        }
    }

    fun dismissPromotionDialog() {
        _uiState.value = _uiState.value.copy(promotionSquare = null)
    }

    private fun onMoveMade() {
        updateGameState()
        updateStatusMessage()

        // Check if game is over
        when (val state = gameController.getGameState()) {
            is GameState.Checkmate, is GameState.Stalemate, is GameState.Draw -> {
                _uiState.value = _uiState.value.copy(
                    uiState = UiState.GameOver,
                    gameState = state
                )
                return
            }
            else -> {}
        }

        // Make AI move if needed
        if (gameController.isAITurn()) {
            makeAIMove()
        }
    }

    private fun makeAIMove() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isThinking = true)

            val mode = gameController.gameMode as? GameMode.AI ?: return@launch
            val timeMs = when (mode.difficulty) {
                Difficulty.EASY -> 500L
                Difficulty.MEDIUM -> 1000L
                Difficulty.HARD -> 2000L
                Difficulty.EXPERT -> 3000L
            }

            delay(300) // Small delay for better UX

            val bestMove = engineManager.findBestMove(gameController.getBoard(), timeMs)

            bestMove?.let { move ->
                gameController.makeMove(move)
                updateGameState()
                updateStatusMessage()

                // Check game state after AI move
                when (val state = gameController.getGameState()) {
                    is GameState.Checkmate, is GameState.Stalemate, is GameState.Draw -> {
                        _uiState.value = _uiState.value.copy(
                            uiState = UiState.GameOver,
                            gameState = state,
                            isThinking = false
                        )
                    }
                    else -> {
                        _uiState.value = _uiState.value.copy(isThinking = false)
                    }
                }
            } ?: run {
                _uiState.value = _uiState.value.copy(isThinking = false)
            }
        }
    }

    private fun updateGameState() {
        val lastMove = gameController.getLastMove()
        _uiState.value = _uiState.value.copy(
            selectedSquare = gameController.getSelectedSquare(),
            legalMoves = gameController.getLegalMoves().map { it.destination },
            lastMove = lastMove?.let { Pair(it.source, it.destination) },
            gameState = gameController.getGameState()
        )
    }

    private fun updateStatusMessage() {
        val message = when (val state = gameController.getGameState()) {
            is GameState.Ongoing -> {
                if (gameController.getSideToMove() == Side.WHITE)
                    getApplication<Application>().getString(R.string.white_to_move)
                else
                    getApplication<Application>().getString(R.string.black_to_move)
            }
            is GameState.Check -> {
                if (state.side == Side.WHITE)
                    getApplication<Application>().getString(R.string.white_in_check)
                else
                    getApplication<Application>().getString(R.string.black_in_check)
            }
            is GameState.Checkmate -> {
                if (state.winner == Side.WHITE)
                    getApplication<Application>().getString(R.string.white_wins)
                else
                    getApplication<Application>().getString(R.string.black_wins)
            }
            is GameState.Stalemate -> getApplication<Application>().getString(R.string.stalemate)
            is GameState.Draw -> getApplication<Application>().getString(R.string.draw)
        }
        _uiState.value = _uiState.value.copy(statusMessage = message)
    }

    fun undoMove() {
        if (_uiState.value.isThinking) return

        if (gameController.undo()) {
            updateGameState()
            updateStatusMessage()
        }
    }

    fun newGame() {
        _uiState.value = ChessUiState(uiState = UiState.Menu)
        gameController.newGame()
    }

    fun getPieceAt(square: Square): Piece {
        return gameController.getBoard().getPiece(square)
    }

    fun cleanup() {
        engineManager.shutdown()
    }
}
