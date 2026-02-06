package com.marble.chess.ui.components

import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.github.bhlangonijr.chesslib.Piece
import com.github.bhlangonijr.chesslib.Side
import com.github.bhlangonijr.chesslib.Square
import com.marble.chess.ui.theme.*

@Composable
fun ChessBoard(
    squares: List<List<Piece>>,
    selectedSquare: Square?,
    legalMoves: List<Square>,
    lastMove: Pair<Square, Square>?,
    isCheck: Boolean,
    kingSquare: Square?,
    onSquareClick: (Square) -> Unit,
    modifier: Modifier = Modifier
) {
    val configuration = LocalConfiguration.current
    val screenWidth = configuration.screenWidthDp.dp
    val boardSize = minOf(screenWidth - 32.dp, 400.dp)
    val squareSize = boardSize / 8

    Box(
        modifier = modifier
            .size(boardSize + 8.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurface)
            .padding(4.dp),
        contentAlignment = Alignment.Center
    ) {
        // Marble board background with frame
        Box(
            modifier = Modifier
                .size(boardSize)
                .drawBehind { drawMarbleFrame(size.width) }
                .padding(4.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                for (rank in 7 downTo 0) {
                    Row(modifier = Modifier.weight(1f)) {
                        for (file in 0..7) {
                            val square = Square.squareAt(file + rank * 8)
                            val piece = squares[7 - rank][file]
                            val isSelected = selectedSquare == square
                            val isLegalMove = legalMoves.contains(square)
                            val isLastMove = lastMove?.let {
                                it.first == square || it.second == square
                            } ?: false
                            val isCheckSquare = isCheck && kingSquare == square

                            ChessSquare(
                                piece = piece,
                                isLight = (file + rank) % 2 == 0,
                                isSelected = isSelected,
                                isLegalMove = isLegalMove,
                                isLastMove = isLastMove,
                                isCheck = isCheckSquare,
                                size = squareSize,
                                onClick = { onSquareClick(square) }
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun DrawScope.drawMarbleFrame(width: Float) {
    // Outer dark border
    drawRect(
        brush = Brush.linearGradient(
            colors = listOf(Color(0xFF3D3D3D), Color(0xFF2A2A2A), Color(0xFF3D3D3D)),
            start = Offset(0f, 0f),
            end = Offset(width, width)
        ),
        size = Size(width, width)
    )

    // Inner decorative line
    val borderWidth = width * 0.02f
    drawRect(
        color = GoldAccent.copy(alpha = 0.5f),
        topLeft = Offset(borderWidth, borderWidth),
        size = Size(width - borderWidth * 2, width - borderWidth * 2)
    )
}

@Composable
private fun ChessSquare(
    piece: Piece,
    isLight: Boolean,
    isSelected: Boolean,
    isLegalMove: Boolean,
    isLastMove: Boolean,
    isCheck: Boolean,
    size: Dp,
    onClick: () -> Unit
) {
    val baseColor = if (isLight) MarbleBoardLight else MarbleBoardDark

    Box(
        modifier = Modifier
            .size(size)
            .background(baseColor)
            .then(
                if (isSelected) {
                    Modifier.background(HighlightYellow.copy(alpha = 0.5f))
                } else if (isCheck) {
                    Modifier.background(HighlightRed.copy(alpha = 0.6f))
                } else if (isLastMove) {
                    Modifier.background(HighlightYellow.copy(alpha = 0.25f))
                } else {
                    Modifier
                }
            )
            .pointerInput(Unit) {
                detectTapGestures { onClick() }
            },
        contentAlignment = Alignment.Center
    ) {
        // Marble texture overlay
        if (isLight) {
            MarbleTextureLight()
        } else {
            MarbleTextureDark()
        }

        // Legal move indicator
        if (isLegalMove) {
            LegalMoveIndicator(size = size * 0.35f, hasPiece = piece != Piece.NONE)
        }

        // Piece
        if (piece != Piece.NONE) {
            ChessPiece(
                piece = piece,
                size = with(LocalDensity.current) { (size * 0.85f).toPx() }
            )
        }
    }
}

@Composable
private fun MarbleTextureLight() {
    // Subtle marble veining effect
    Box(
        modifier = Modifier
            .fillMaxSize()
            .drawBehind {
                drawCircle(
                    color = Color.White.copy(alpha = 0.15f),
                    radius = size.width * 0.6f,
                    center = Offset(size.width * 0.3f, size.height * 0.3f)
                )
            }
    )
}

@Composable
private fun MarbleTextureDark() {
    // Subtle darker marble texture
    Box(
        modifier = Modifier
            .fillMaxSize()
            .drawBehind {
                drawCircle(
                    color = Color.Black.copy(alpha = 0.1f),
                    radius = size.width * 0.5f,
                    center = Offset(size.width * 0.7f, size.height * 0.6f)
                )
            }
    )
}

@Composable
private fun LegalMoveIndicator(size: Dp, hasPiece: Boolean) {
    if (hasPiece) {
        // Ring indicator for capture moves
        Box(
            modifier = Modifier
                .size(size)
                .border(
                    width = 3.dp,
                    color = HighlightGreen.copy(alpha = 0.8f),
                    shape = CircleShape
                )
        )
    } else {
        // Dot indicator for normal moves
        Box(
            modifier = Modifier
                .size(size * 0.5f)
                .clip(CircleShape)
                .background(HighlightGreen.copy(alpha = 0.6f))
        )
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewChessBoard() {
    MaterialTheme {
        val initialPosition = List(8) { rank ->
            List(8) { file ->
                when (rank) {
                    0 -> when (file) {
                        0, 7 -> Piece.BLACK_ROOK
                        1, 6 -> Piece.BLACK_KNIGHT
                        2, 5 -> Piece.BLACK_BISHOP
                        3 -> Piece.BLACK_QUEEN
                        4 -> Piece.BLACK_KING
                        else -> Piece.NONE
                    }
                    1 -> Piece.BLACK_PAWN
                    6 -> Piece.WHITE_PAWN
                    7 -> when (file) {
                        0, 7 -> Piece.WHITE_ROOK
                        1, 6 -> Piece.WHITE_KNIGHT
                        2, 5 -> Piece.WHITE_BISHOP
                        3 -> Piece.WHITE_QUEEN
                        4 -> Piece.WHITE_KING
                        else -> Piece.NONE
                    }
                    else -> Piece.NONE
                }
            }
        }

        ChessBoard(
            squares = initialPosition,
            selectedSquare = Square.E2,
            legalMoves = listOf(Square.E3, Square.E4),
            lastMove = Pair(Square.E7, Square.E5),
            isCheck = false,
            kingSquare = null,
            onSquareClick = {}
        )
    }
}
