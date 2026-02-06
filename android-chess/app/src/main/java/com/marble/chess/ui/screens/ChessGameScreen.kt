package com.marble.chess.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Undo
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.github.bhlangonijr.chesslib.Piece
import com.github.bhlangonijr.chesslib.Side
import com.github.bhlangonijr.chesslib.Square
import com.marble.chess.R
import com.marble.chess.engine.*
import com.marble.chess.ui.components.ChessBoard
import com.marble.chess.ui.theme.*
import com.marble.chess.viewmodel.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChessGameScreen(viewModel: ChessViewModel) {
    val uiState by viewModel.uiState

    when (val state = uiState.uiState) {
        is UiState.Menu -> {
            MainMenuScreen(
                onStartGame = { mode -> viewModel.startGame(mode) }
            )
        }
        is UiState.Playing, is UiState.GameOver -> {
            GameContent(
                uiState = uiState,
                onSquareClick = { square -> viewModel.onSquareClick(square) },
                onUndo = { viewModel.undoMove() },
                onNewGame = { viewModel.newGame() },
                onPromotionSelected = { piece -> viewModel.onPromotionSelected(piece) },
                onDismissPromotion = { viewModel.dismissPromotionDialog() },
                getPieceAt = { square -> viewModel.getPieceAt(square) }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun GameContent(
    uiState: ChessUiState,
    onSquareClick: (Square) -> Unit,
    onUndo: () -> Unit,
    onNewGame: () -> Unit,
    onPromotionSelected: (Piece) -> Unit,
    onDismissPromotion: () -> Unit,
    getPieceAt: (Square) -> Piece
) {
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Marble Chess",
                        color = GoldAccent,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = DarkBackground
                ),
                actions = {
                    IconButton(onClick = onNewGame) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = stringResource(R.string.new_game),
                            tint = MarbleWhite
                        )
                    }
                }
            )
        },
        containerColor = DarkBackground
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(
                    Brush.radialGradient(
                        colors = listOf(DarkSurface, DarkBackground),
                        center = Offset.Unspecified
                    )
                ),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Status bar
            StatusBar(
                statusMessage = uiState.statusMessage,
                isThinking = uiState.isThinking,
                gameMode = uiState.gameMode
            )

            // Chess board
            val squares = (0..7).map { rank ->
                (0..7).map { file ->
                    getPieceAt(Square.squareAt(file + (7 - rank) * 8))
                }
            }

            val isCheck = uiState.gameState is GameState.Check
            val kingSquare = if (isCheck) {
                findKingSquare(squares, uiState.gameState.let {
                    if (it is GameState.Check) it.side else Side.WHITE
                })
            } else null

            ChessBoard(
                squares = squares,
                selectedSquare = uiState.selectedSquare,
                legalMoves = uiState.legalMoves,
                lastMove = uiState.lastMove,
                isCheck = isCheck,
                kingSquare = kingSquare,
                onSquareClick = onSquareClick,
                modifier = Modifier.padding(16.dp)
            )

            // Control buttons
            ControlButtons(
                onUndo = onUndo,
                canUndo = !uiState.isThinking && uiState.uiState == UiState.Playing
            )

            // Game over dialog
            if (uiState.uiState == UiState.GameOver) {
                GameOverDialog(
                    gameState = uiState.gameState,
                    onNewGame = onNewGame,
                    onMenu = onNewGame
                )
            }

            // Promotion dialog
            uiState.promotionSquare?.let {
                PromotionDialog(
                    isWhite = uiState.gameState.let { state ->
                        if (state is GameState.Check) state.side == Side.WHITE else true
                    },
                    onSelect = onPromotionSelected,
                    onDismiss = onDismissPromotion
                )
            }
        }
    }
}

private fun findKingSquare(squares: List<List<Piece>>, side: Side): Square? {
    val kingPiece = if (side == Side.WHITE) Piece.WHITE_KING else Piece.BLACK_KING
    squares.forEachIndexed { rank, row ->
        row.forEachIndexed { file, piece ->
            if (piece == kingPiece) {
                return Square.squareAt(file + (7 - rank) * 8)
            }
        }
    }
    return null
}

@Composable
private fun StatusBar(
    statusMessage: String,
    isThinking: Boolean,
    gameMode: GameMode
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurface.copy(alpha = 0.8f))
            .padding(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (isThinking) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = GoldAccent,
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                }
                Text(
                    text = statusMessage,
                    style = MaterialTheme.typography.bodyLarge,
                    color = if (isThinking) GoldAccent else MarbleWhite,
                    fontWeight = if (statusMessage.contains("check", ignoreCase = true))
                        FontWeight.Bold else FontWeight.Normal
                )
            }

            // Mode indicator
            val modeText = when (gameMode) {
                is GameMode.PVP -> "PvP"
                is GameMode.AI -> "AI: ${when (gameMode.difficulty) {
                    Difficulty.EASY -> "E"
                    Difficulty.MEDIUM -> "M"
                    Difficulty.HARD -> "H"
                    Difficulty.EXPERT -> "X"
                }}"
            }
            Text(
                text = modeText,
                style = MaterialTheme.typography.labelLarge,
                color = MarbleGray
            )
        }
    }
}

@Composable
private fun ControlButtons(
    onUndo: () -> Unit,
    canUndo: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        Button(
            onClick = onUndo,
            enabled = canUndo,
            colors = ButtonDefaults.buttonColors(
                containerColor = MarbleGray.copy(alpha = 0.3f),
                disabledContainerColor = MarbleGray.copy(alpha = 0.1f)
            ),
            modifier = Modifier.weight(1f)
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.Undo,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(stringResource(R.string.undo))
        }
    }
}

@Composable
private fun PromotionDialog(
    isWhite: Boolean,
    onSelect: (Piece) -> Unit,
    onDismiss: () -> Unit
) {
    val pieces = if (isWhite) {
        listOf(Piece.WHITE_QUEEN, Piece.WHITE_ROOK, Piece.WHITE_BISHOP, Piece.WHITE_KNIGHT)
    } else {
        listOf(Piece.BLACK_QUEEN, Piece.BLACK_ROOK, Piece.BLACK_BISHOP, Piece.BLACK_KNIGHT)
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DarkSurface,
        titleContentColor = GoldAccent,
        title = { Text(stringResource(R.string.select_promotion)) },
        text = {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                pieces.forEach { piece ->
                    IconButton(
                        onClick = { onSelect(piece) },
                        modifier = Modifier.size(64.dp)
                    ) {
                        com.marble.chess.ui.components.ChessPiece(
                            piece = piece,
                            size = 56f
                        )
                    }
                }
            }
        },
        confirmButton = {},
        dismissButton = {}
    )
}

@Composable
private fun GameOverDialog(
    gameState: GameState,
    onNewGame: () -> Unit,
    onMenu: () -> Unit
) {
    val title = when (gameState) {
        is GameState.Checkmate -> "Checkmate!"
        is GameState.Stalemate -> "Stalemate!"
        is GameState.Draw -> "Draw!"
        else -> "Game Over"
    }

    val message = when (gameState) {
        is GameState.Checkmate -> {
            val winner = if (gameState.winner == Side.WHITE) "White" else "Black"
            "$winner wins the game!"
        }
        is GameState.Stalemate -> "No legal moves available."
        is GameState.Draw -> "The game is a draw."
        else -> ""
    }

    AlertDialog(
        onDismissRequest = {},
        containerColor = DarkSurface,
        titleContentColor = GoldAccent,
        textContentColor = MarbleWhite,
        title = {
            Text(
                title,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        },
        text = {
            Text(
                message,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            Button(
                onClick = onNewGame,
                colors = ButtonDefaults.buttonColors(
                    containerColor = GoldAccent,
                    contentColor = MarbleDark
                )
            ) {
                Text("New Game")
            }
        },
        dismissButton = {
            TextButton(onClick = onMenu) {
                Text("Main Menu", color = MarbleGray)
            }
        }
    )
}

@Preview(showBackground = true)
@Composable
fun PreviewGameContent() {
    MaterialTheme {
        GameContent(
            uiState = ChessUiState(
                uiState = UiState.Playing,
                statusMessage = "White to move"
            ),
            onSquareClick = {},
            onUndo = {},
            onNewGame = {},
            onPromotionSelected = {},
            onDismissPromotion = {},
            getPieceAt = { Piece.NONE }
        )
    }
}
