package com.marble.chess.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Computer
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import com.marble.chess.R
import com.marble.chess.engine.Difficulty
import com.marble.chess.engine.GameMode
import com.marble.chess.engine.Side
import com.marble.chess.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainMenuScreen(
    onStartGame: (GameMode) -> Unit
) {
    var showAIDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.radialGradient(
                    colors = listOf(DarkSurface, DarkBackground),
                    center = Offset.Unspecified
                )
            )
            .padding(24.dp)
            .verticalScroll(rememberScrollState()),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // Title with marble effect
        Text(
            text = "♚ MARBLE CHESS ♔",
            style = MaterialTheme.typography.headlineLarge,
            color = GoldAccent,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Text(
            text = "Classic Strategy Game",
            style = MaterialTheme.typography.bodyLarge,
            color = SilverAccent,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(bottom = 48.dp)
        )

        // Game mode cards
        GameModeCard(
            icon = Icons.Default.Person,
            title = stringResource(R.string.mode_pvp),
            description = "Play against a friend on the same device",
            onClick = { onStartGame(GameMode.PVP) }
        )

        Spacer(modifier = Modifier.height(16.dp))

        GameModeCard(
            icon = Icons.Default.Computer,
            title = stringResource(R.string.mode_ai),
            description = "Challenge the computer AI",
            onClick = { showAIDialog = true }
        )

        Spacer(modifier = Modifier.height(48.dp))

        // Decorative marble pattern
        MarbleDecoration()
    }

    if (showAIDialog) {
        AIDifficultyDialog(
            onDismiss = { showAIDialog = false },
            onConfirm = { difficulty, playerColor ->
                onStartGame(GameMode.AI(difficulty, playerColor))
                showAIDialog = false
            }
        )
    }
}

@Composable
private fun GameModeCard(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    description: String,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = DarkSurface.copy(alpha = 0.8f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(20.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(
                        Brush.radialGradient(
                            colors = listOf(MarbleLight, MarbleGray),
                            radius = 100f
                        )
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = MarbleDark,
                    modifier = Modifier.size(32.dp)
                )
            }

            Spacer(modifier = Modifier.width(20.dp))

            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleLarge,
                    color = MarbleWhite,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MarbleGray
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AIDifficultyDialog(
    onDismiss: () -> Unit,
    onConfirm: (Difficulty, Side) -> Unit
) {
    var selectedDifficulty by remember { mutableStateOf(Difficulty.MEDIUM) }
    var playAsWhite by remember { mutableStateOf(true) }

    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = DarkSurface,
        titleContentColor = GoldAccent,
        textContentColor = MarbleWhite,
        title = { Text("Select Difficulty") },
        text = {
            Column {
                Text(
                    "Choose AI strength:",
                    modifier = Modifier.padding(bottom = 16.dp)
                )

                Difficulty.values().forEach { difficulty ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = selectedDifficulty == difficulty,
                            onClick = { selectedDifficulty = difficulty },
                            colors = RadioButtonDefaults.colors(
                                selectedColor = GoldAccent,
                                unselectedColor = MarbleGray
                            )
                        )
                        Text(
                            text = when (difficulty) {
                                Difficulty.EASY -> stringResource(R.string.difficulty_easy)
                                Difficulty.MEDIUM -> stringResource(R.string.difficulty_medium)
                                Difficulty.HARD -> stringResource(R.string.difficulty_hard)
                                Difficulty.EXPERT -> stringResource(R.string.difficulty_expert)
                            },
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }

                HorizontalDivider(
                    modifier = Modifier.padding(vertical = 16.dp),
                    color = MarbleGray.copy(alpha = 0.3f)
                )

                Text(
                    "Play as:",
                    modifier = Modifier.padding(bottom = 8.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    FilterChip(
                        selected = playAsWhite,
                        onClick = { playAsWhite = true },
                        label = { Text(stringResource(R.string.play_as_white)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MarbleWhite.copy(alpha = 0.2f),
                            selectedLabelColor = MarbleWhite
                        )
                    )
                    FilterChip(
                        selected = !playAsWhite,
                        onClick = { playAsWhite = false },
                        label = { Text(stringResource(R.string.play_as_black)) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MarbleDark.copy(alpha = 0.5f),
                            selectedLabelColor = MarbleWhite
                        )
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onConfirm(selectedDifficulty, if (playAsWhite) Side.WHITE else Side.BLACK)
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = GoldAccent,
                    contentColor = MarbleDark
                )
            ) {
                Text("Start Game")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel", color = MarbleGray)
            }
        }
    )
}

@Composable
private fun MarbleDecoration() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center
    ) {
        repeat(5) { index ->
            val size = if (index % 2 == 0) 12.dp else 8.dp
            Box(
                modifier = Modifier
                    .padding(horizontal = 4.dp)
                    .size(size)
                    .clip(RoundedCornerShape(50))
                    .background(
                        if (index % 2 == 0) MarbleLight else MarbleGray
                    )
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewMainMenu() {
    MaterialTheme {
        MainMenuScreen(onStartGame = {})
    }
}
