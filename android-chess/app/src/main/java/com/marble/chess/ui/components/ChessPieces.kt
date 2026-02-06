package com.marble.chess.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.github.bhlangonijr.chesslib.Piece
import com.github.bhlangonijr.chesslib.PieceType
import com.github.bhlangonijr.chesslib.Side
import com.marble.chess.ui.theme.MarbleBlack
import com.marble.chess.ui.theme.MarbleWhite

@Composable
fun ChessPiece(
    piece: Piece,
    modifier: Modifier = Modifier,
    size: Float = 100f
) {
    if (piece == Piece.NONE) return

    val isWhite = piece.pieceSide == Side.WHITE
    val pieceType = piece.pieceType

    Canvas(modifier = modifier.size(size.dp)) {
        val marbleLight = if (isWhite) Color(0xFFF8F8F0) else Color(0xFF505050)
        val marbleDark = if (isWhite) Color(0xFFD0D0C8) else Color(0xFF303030)
        val marbleShadow = if (isWhite) Color(0xFFB0B0A8) else Color(0xFF202020)
        val marbleHighlight = if (isWhite) Color(0xFFFFFFFF) else Color(0xFF606060)

        when (pieceType) {
            PieceType.KING -> drawKing(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            PieceType.QUEEN -> drawQueen(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            PieceType.ROOK -> drawRook(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            PieceType.BISHOP -> drawBishop(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            PieceType.KNIGHT -> drawKnight(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            PieceType.PAWN -> drawPawn(size, marbleLight, marbleDark, marbleShadow, marbleHighlight)
            else -> {}
        }
    }
}

private fun DrawScope.drawMarbleBase(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color,
    drawShape: DrawScope.() -> Unit
) {
    // Shadow
    drawCircle(
        color = shadowColor,
        radius = size * 0.48f,
        center = Offset(size * 0.52f, size * 0.52f)
    )

    // Base shape with marble gradient
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.6f
    )

    drawWithLayer {
        drawShape()
        drawCircle(
            brush = gradient,
            radius = size * 0.45f,
            center = Offset(size * 0.48f, size * 0.48f)
        )
    }

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.6f),
        radius = size * 0.15f,
        center = Offset(size * 0.32f, size * 0.32f)
    )
}

private inline fun DrawScope.drawWithLayer(block: DrawScope.() -> Unit) {
    drawContext.canvas.nativeCanvas.apply {
        val checkPoint = saveLayer(null, null)
        block()
        restoreToCount(checkPoint)
    }
}

private fun DrawScope.drawKing(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val baseWidth = size * 0.7f
    val baseHeight = size * 0.15f

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset((size - baseWidth) / 2 + 2, size * 0.82f),
        size = Size(baseWidth, baseHeight)
    )

    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Body
    drawCircle(
        brush = gradient,
        radius = size * 0.28f,
        center = Offset(size * 0.5f, size * 0.55f)
    )

    // Upper body
    drawCircle(
        brush = gradient,
        radius = size * 0.2f,
        center = Offset(size * 0.5f, size * 0.35f)
    )

    // Crown base
    drawRect(
        brush = gradient,
        topLeft = Offset(size * 0.3f, size * 0.18f),
        size = Size(size * 0.4f, size * 0.08f)
    )

    // Cross
    drawRect(
        brush = gradient,
        topLeft = Offset(size * 0.46f, size * 0.05f),
        size = Size(size * 0.08f, size * 0.18f)
    )
    drawRect(
        brush = gradient,
        topLeft = Offset(size * 0.35f, size * 0.1f),
        size = Size(size * 0.3f, size * 0.06f)
    )

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.1f,
        center = Offset(size * 0.4f, size * 0.45f)
    )
}

private fun DrawScope.drawQueen(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset(size * 0.18f, size * 0.82f),
        size = Size(size * 0.64f, size * 0.12f)
    )

    // Body
    drawCircle(
        brush = gradient,
        radius = size * 0.26f,
        center = Offset(size * 0.5f, size * 0.58f)
    )

    // Upper body
    drawCircle(
        brush = gradient,
        radius = size * 0.18f,
        center = Offset(size * 0.5f, size * 0.38f)
    )

    // Crown with points
    val crownPoints = listOf(
        Offset(size * 0.25f, size * 0.28f),
        Offset(size * 0.35f, size * 0.15f),
        Offset(size * 0.5f, size * 0.08f),
        Offset(size * 0.65f, size * 0.15f),
        Offset(size * 0.75f, size * 0.28f)
    )

    drawPath(
        path = androidx.compose.ui.graphics.Path().apply {
            moveTo(crownPoints[0].x, crownPoints[0].y)
            lineTo(crownPoints[1].x, crownPoints[1].y)
            lineTo(crownPoints[2].x, crownPoints[2].y)
            lineTo(crownPoints[3].x, crownPoints[3].y)
            lineTo(crownPoints[4].x, crownPoints[4].y)
            close()
        },
        brush = gradient
    )

    // Jewels on crown
    crownPoints.forEach { point ->
        drawCircle(
            color = highlightColor,
            radius = size * 0.04f,
            center = point
        )
    }

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.08f,
        center = Offset(size * 0.42f, size * 0.48f)
    )
}

private fun DrawScope.drawRook(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset(size * 0.2f, size * 0.82f),
        size = Size(size * 0.6f, size * 0.12f)
    )

    // Body - cylindrical
    drawRect(
        brush = gradient,
        topLeft = Offset(size * 0.3f, size * 0.4f),
        size = Size(size * 0.4f, size * 0.4f)
    )

    // Base cylinder
    drawOval(
        brush = gradient,
        topLeft = Offset(size * 0.28f, size * 0.75f),
        size = Size(size * 0.44f, size * 0.1f)
    )

    // Top rim
    drawRect(
        brush = gradient,
        topLeft = Offset(size * 0.26f, size * 0.32f),
        size = Size(size * 0.48f, size * 0.1f)
    )

    // Battlements (castle top)
    val battlementWidth = size * 0.1f
    for (i in 0..3) {
        drawRect(
            brush = gradient,
            topLeft = Offset(size * 0.26f + i * battlementWidth * 1.3f, size * 0.18f),
            size = Size(battlementWidth, size * 0.16f)
        )
    }

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.06f,
        center = Offset(size * 0.38f, size * 0.5f)
    )
}

private fun DrawScope.drawBishop(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset(size * 0.18f, size * 0.82f),
        size = Size(size * 0.64f, size * 0.12f)
    )

    // Body - rounded base
    drawCircle(
        brush = gradient,
        radius = size * 0.22f,
        center = Offset(size * 0.5f, size * 0.62f)
    )

    // Sloped body
    drawOval(
        brush = gradient,
        topLeft = Offset(size * 0.32f, size * 0.42f),
        size = Size(size * 0.36f, size * 0.25f)
    )

    // Head
    drawOval(
        brush = gradient,
        topLeft = Offset(size * 0.38f, size * 0.28f),
        size = Size(size * 0.24f, size * 0.18f)
    )

    // Mitre top
    drawPath(
        path = androidx.compose.ui.graphics.Path().apply {
            moveTo(size * 0.42f, size * 0.32f)
            lineTo(size * 0.58f, size * 0.32f)
            lineTo(size * 0.5f, size * 0.08f)
            close()
        },
        brush = gradient
    )

    // Slot in mitre
    drawLine(
        color = darkColor,
        start = Offset(size * 0.5f, size * 0.15f),
        end = Offset(size * 0.5f, size * 0.28f),
        strokeWidth = 2f
    )

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.07f,
        center = Offset(size * 0.45f, size * 0.55f)
    )
}

private fun DrawScope.drawKnight(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset(size * 0.2f, size * 0.82f),
        size = Size(size * 0.6f, size * 0.12f)
    )

    // Body base
    drawCircle(
        brush = gradient,
        radius = size * 0.2f,
        center = Offset(size * 0.5f, size * 0.68f)
    )

    // Horse head shape
    drawPath(
        path = androidx.compose.ui.graphics.Path().apply {
            // Neck
            moveTo(size * 0.4f, size * 0.65f)
            lineTo(size * 0.35f, size * 0.4f)
            // Head top
            lineTo(size * 0.55f, size * 0.25f)
            // Snout
            lineTo(size * 0.72f, size * 0.32f)
            lineTo(size * 0.7f, size * 0.45f)
            // Jaw
            lineTo(size * 0.58f, size * 0.48f)
            // Back to neck
            lineTo(size * 0.62f, size * 0.6f)
            close()
        },
        brush = gradient
    )

    // Ear
    drawPath(
        path = androidx.compose.ui.graphics.Path().apply {
            moveTo(size * 0.48f, size * 0.3f)
            lineTo(size * 0.52f, size * 0.15f)
            lineTo(size * 0.58f, size * 0.26f)
            close()
        },
        brush = gradient
    )

    // Eye
    drawCircle(
        color = darkColor,
        radius = size * 0.03f,
        center = Offset(size * 0.58f, size * 0.36f)
    )

    // Mane detail
    drawLine(
        color = darkColor.copy(alpha = 0.5f),
        start = Offset(size * 0.42f, size * 0.45f),
        end = Offset(size * 0.45f, size * 0.62f),
        strokeWidth = 2f
    )

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.05f,
        center = Offset(size * 0.45f, size * 0.38f)
    )
}

private fun DrawScope.drawPawn(
    size: Float,
    lightColor: Color,
    darkColor: Color,
    shadowColor: Color,
    highlightColor: Color
) {
    val gradient = Brush.radialGradient(
        colors = listOf(lightColor, darkColor),
        center = Offset(size * 0.35f, size * 0.35f),
        radius = size * 0.5f
    )

    // Base
    drawOval(
        color = shadowColor,
        topLeft = Offset(size * 0.22f, size * 0.82f),
        size = Size(size * 0.56f, size * 0.12f)
    )

    // Body - conical
    drawOval(
        brush = gradient,
        topLeft = Offset(size * 0.32f, size * 0.52f),
        size = Size(size * 0.36f, size * 0.3f)
    )

    // Head
    drawCircle(
        brush = gradient,
        radius = size * 0.18f,
        center = Offset(size * 0.5f, size * 0.38f)
    )

    // Collar
    drawOval(
        color = darkColor.copy(alpha = 0.3f),
        topLeft = Offset(size * 0.35f, size * 0.48f),
        size = Size(size * 0.3f, size * 0.06f)
    )

    // Highlight
    drawCircle(
        color = highlightColor.copy(alpha = 0.5f),
        radius = size * 0.06f,
        center = Offset(size * 0.44f, size * 0.34f)
    )
}

@Preview(showBackground = true, backgroundColor = 0xFF8B5A2B)
@Composable
fun PreviewWhiteKing() {
    ChessPiece(piece = Piece.WHITE_KING, size = 80f)
}

@Preview(showBackground = true, backgroundColor = 0xFFD4A574)
@Composable
fun PreviewBlackQueen() {
    ChessPiece(piece = Piece.BLACK_QUEEN, size = 80f)
}

@Preview(showBackground = true)
@Composable
fun PreviewAllPieces() {
    val pieces = listOf(
        Piece.WHITE_KING, Piece.WHITE_QUEEN, Piece.WHITE_ROOK,
        Piece.WHITE_BISHOP, Piece.WHITE_KNIGHT, Piece.WHITE_PAWN,
        Piece.BLACK_KING, Piece.BLACK_QUEEN, Piece.BLACK_ROOK,
        Piece.BLACK_BISHOP, Piece.BLACK_KNIGHT, Piece.BLACK_PAWN
    )
    pieces.forEach { piece ->
        ChessPiece(piece = piece, size = 60f)
    }
}
