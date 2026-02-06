package com.marble.chess.engine

import android.content.Context
import android.util.Log
import com.github.bhlangonijr.chesslib.Board
import com.github.bhlangonijr.chesslib.Side
import com.github.bhlangonijr.chesslib.move.Move
import kotlinx.coroutines.*
import java.io.*

sealed class EngineState {
    object Idle : EngineState()
    object Initializing : EngineState()
    object Ready : EngineState()
    object Thinking : EngineState()
    data class Error(val message: String) : EngineState()
}

class EngineManager(private val context: Context) {
    private var process: Process? = null
    private var reader: BufferedReader? = null
    private var writer: BufferedWriter? = null
    private val scope = CoroutineScope(Dispatchers.IO + SupervisorJob())

    var state: EngineState = EngineState.Idle
        private set

    private var difficulty: Difficulty = Difficulty.MEDIUM
    private var engineSide: Side = Side.BLACK

    private val _TAG = "EngineManager"

    suspend fun initialize(difficulty: Difficulty = Difficulty.MEDIUM, engineSide: Side = Side.BLACK): Boolean {
        if (state is EngineState.Ready || state is EngineState.Initializing) return true

        this.difficulty = difficulty
        this.engineSide = engineSide
        state = EngineState.Initializing

        return try {
            copyEngineBinary()
            startEngine()
            setupEngine()
            state = EngineState.Ready
            true
        } catch (e: Exception) {
            Log.e(_TAG, "Failed to initialize engine", e)
            state = EngineState.Error(e.message ?: "Unknown error")
            false
        }
    }

    private suspend fun copyEngineBinary(): String = withContext(Dispatchers.IO) {
        val abi = android.os.Build.SUPPORTED_ABIS[0]
        val assetName = when {
            abi.contains("arm64") -> "stockfish-android-arm64"
            abi.contains("armeabi") -> "stockfish-android-armv7"
            abi.contains("x86_64") -> "stockfish-android-x86_64"
            else -> "stockfish-android-arm64"
        }

        val engineFile = File(context.filesDir, "stockfish")

        if (!engineFile.exists()) {
            try {
                context.assets.open(assetName).use { input ->
                    FileOutputStream(engineFile).use { output ->
                        input.copyTo(output)
                    }
                }
                engineFile.setExecutable(true)
            } catch (e: IOException) {
                // Fallback to built-in simple AI if Stockfish not available
                Log.w(_TAG, "Stockfish binary not found, will use fallback AI")
                throw e
            }
        }

        engineFile.absolutePath
    }

    private suspend fun startEngine() = withContext(Dispatchers.IO) {
        val enginePath = File(context.filesDir, "stockfish").absolutePath

        val pb = ProcessBuilder(enginePath)
        pb.redirectErrorStream(true)
        process = pb.start()

        reader = BufferedReader(InputStreamReader(process!!.inputStream))
        writer = BufferedWriter(OutputStreamWriter(process!!.outputStream))
    }

    private suspend fun setupEngine() {
        sendCommand("uci")
        waitForResponse("uciok")

        sendCommand("setoption name Skill Level value ${difficulty.skillLevel}")
        sendCommand("setoption name Threads value 1")
        sendCommand("setoption name Hash value 16")
        sendCommand("isready")
        waitForResponse("readyok")
    }

    suspend fun findBestMove(board: Board, timeMs: Long = 1000): Move? = withContext(Dispatchers.IO) {
        if (state !is EngineState.Ready) {
            // Use fallback simple AI
            return@withContext findSimpleMove(board)
        }

        state = EngineState.Thinking

        try {
            sendCommand("position fen ${board.fen}")
            sendCommand("go movetime $timeMs")

            val bestMoveLine = waitForBestMove()
            state = EngineState.Ready

            bestMoveLine?.let { parseBestMove(it) }
        } catch (e: Exception) {
            Log.e(_TAG, "Error finding best move", e)
            state = EngineState.Error(e.message ?: "Error during search")
            findSimpleMove(board)
        }
    }

    private fun findSimpleMove(board: Board): Move? {
        val legalMoves = board.legalMoves()
        if (legalMoves.isEmpty()) return null

        // Simple evaluation: prioritize captures and checks
        val scoredMoves = legalMoves.map { move ->
            val capturedPiece = board.getPiece(move.destination)
            var score = 0

            if (capturedPiece != com.github.bhlangonijr.chesslib.Piece.NONE) {
                score += when (capturedPiece.pieceType) {
                    com.github.bhlangonijr.chesslib.PieceType.QUEEN -> 900
                    com.github.bhlangonijr.chesslib.PieceType.ROOK -> 500
                    com.github.bhlangonijr.chesslib.PieceType.BISHOP -> 330
                    com.github.bhlangonijr.chesslib.PieceType.KNIGHT -> 320
                    com.github.bhlangonijr.chesslib.PieceType.PAWN -> 100
                    else -> 0
                }
            }

            // Bonus for central control
            val destFile = move.destination.file.ordinal
            val destRank = move.destination.rank.ordinal
            if (destFile in 3..4 && destRank in 3..4) {
                score += 10
            }

            move to score
        }

        val maxScore = scoredMoves.maxOf { it.second }
        val bestMoves = scoredMoves.filter { it.second == maxScore }.map { it.first }

        return bestMoves.random()
    }

    private suspend fun sendCommand(command: String) = withContext(Dispatchers.IO) {
        writer?.apply {
            write(command)
            newLine()
            flush()
        }
    }

    private suspend fun waitForResponse(expected: String): String = withContext(Dispatchers.IO) {
        val sb = StringBuilder()
        var line: String?

        while (reader?.readLine()?.also { line = it } != null) {
            sb.appendLine(line)
            if (line?.startsWith(expected) == true) break
        }

        sb.toString()
    }

    private suspend fun waitForBestMove(): String? = withContext(Dispatchers.IO) {
        var line: String?
        var bestMove: String? = null

        while (reader?.readLine()?.also { line = it } != null) {
            if (line?.startsWith("bestmove") == true) {
                bestMove = line
                break
            }
        }

        bestMove
    }

    private fun parseBestMove(line: String): Move? {
        val parts = line.split(" ")
        if (parts.size < 2) return null

        val moveStr = parts[1]
        if (moveStr.length < 4) return null

        return try {
            val from = com.github.bhlangonijr.chesslib.Square.fromValue(
                moveStr.substring(0, 2).uppercase()
            )
            val to = com.github.bhlangonijr.chesslib.Square.fromValue(
                moveStr.substring(2, 4).uppercase()
            )
            val promotion = if (moveStr.length > 4) {
                when (moveStr[4].lowercaseChar()) {
                    'q' -> com.github.bhlangonijr.chesslib.PieceType.QUEEN
                    'r' -> com.github.bhlangonijr.chesslib.PieceType.ROOK
                    'b' -> com.github.bhlangonijr.chesslib.PieceType.BISHOP
                    'n' -> com.github.bhlangonijr.chesslib.PieceType.KNIGHT
                    else -> null
                }?.let { type ->
                    com.github.bhlangonijr.chesslib.Piece.make(
                        com.github.bhlangonijr.chesslib.Side.BLACK, type
                    )
                } ?: com.github.bhlangonijr.chesslib.Piece.NONE
            } else {
                com.github.bhlangonijr.chesslib.Piece.NONE
            }

            Move(from, to, promotion)
        } catch (e: Exception) {
            Log.e(_TAG, "Failed to parse move: $moveStr", e)
            null
        }
    }

    fun shutdown() {
        scope.launch {
            try {
                sendCommand("quit")
                withTimeout(1000) {
                    process?.waitFor()
                }
            } catch (e: Exception) {
                // Ignore
            } finally {
                process?.destroy()
                reader?.close()
                writer?.close()
                process = null
                reader = null
                writer = null
                state = EngineState.Idle
            }
        }
        scope.cancel()
    }

    fun setDifficulty(newDifficulty: Difficulty) {
        difficulty = newDifficulty
        scope.launch {
            if (state is EngineState.Ready) {
                sendCommand("setoption name Skill Level value ${newDifficulty.skillLevel}")
            }
        }
    }
}
