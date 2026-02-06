# Marble Chess - Android

A native Android chess application with a classic marble aesthetic, featuring both player-vs-player and player-vs-AI modes.

## Features

- ♟️ **Complete Chess Rules**: Full implementation including castling, en passant, promotion, check, checkmate, and stalemate detection
- 👥 **Two Game Modes**:
  - **Player vs Player**: Play against a friend on the same device
  - **Player vs Computer**: Challenge the AI with multiple difficulty levels
- 🤖 **Strong AI**: Integrated Stockfish chess engine (or fallback to built-in tactical engine)
- 🎨 **Marble Aesthetic**: Beautiful marble-themed UI with custom-drawn pieces
- 📱 **Responsive Design**: Optimized for phones and tablets
- ↩️ **Undo Support**: Take back moves during gameplay
- 🎯 **Visual Hints**: Legal move indicators, last move highlighting, and check warnings

## Screenshots

*Main Menu, Game Board, and Promotion Dialog*

## Game Modes

### Player vs Player
Perfect for playing with friends on the same device. The board automatically rotates to show whose turn it is.

### Player vs Computer
Challenge the AI with four difficulty levels:
- **Easy**: Quick moves, suitable for beginners
- **Medium**: Balanced gameplay
- **Hard**: Strong tactical play
- **Expert**: Maximum strength (Stockfish engine)

You can play as either White or Black against the AI.

## Architecture

### Tech Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Chess Logic**: [Chesslib](https://github.com/bhlangonijr/chesslib) - A robust Java chess library
- **AI Engine**: Stockfish (UCI protocol) with fallback to custom evaluation

### Project Structure
```
app/src/main/java/com/marble/chess/
├── ChessApplication.kt         # Application class
├── MainActivity.kt             # Main entry point
├── engine/
│   ├── GameController.kt       # Game state management
│   └── EngineManager.kt        # Stockfish integration
├── viewmodel/
│   └── ChessViewModel.kt       # UI state management
├── ui/
│   ├── theme/                  # Material 3 theming
│   ├── components/
│   │   ├── ChessBoard.kt       # Board rendering
│   │   └── ChessPieces.kt      # Custom piece graphics
│   └── screens/
│       ├── MainMenuScreen.kt   # Game mode selection
│       └── ChessGameScreen.kt  # Main game UI
```

## Building the App

### Prerequisites
- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 or later
- Android SDK with API level 34

### Build Instructions

1. **Clone the repository** (or navigate to the android-chess folder)

2. **Open in Android Studio**:
   ```bash
   cd android-chess
   ```
   Then open the folder in Android Studio

3. **Configure SDK** (if needed):
   - Copy `local.properties.example` to `local.properties`
   - Update `sdk.dir` to point to your Android SDK location

4. **Build and Run**:
   - Connect an Android device or start an emulator
   - Click the "Run" button in Android Studio (or press Shift+F10)

### Building from Command Line

```bash
cd android-chess
./gradlew assembleDebug
```

The APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

## Installing Stockfish (Optional)

The app includes a fallback AI engine, but for the strongest play, you can include Stockfish:

1. Download prebuilt Stockfish binaries for Android:
   - `stockfish-android-arm64` for 64-bit ARM devices
   - `stockfish-android-armv7` for 32-bit ARM devices
   - `stockfish-android-x86_64` for x86_64 emulators

2. Place the binaries in:
   `app/src/main/assets/`

3. The app will automatically detect and use Stockfish on supported devices

**Note**: Stockfish is licensed under GPL v3. If you distribute this app with Stockfish included, you must comply with the GPL license terms.

## Development

### Adding a Custom Theme
The app uses Material 3 with custom marble colors. Modify `ui/theme/Color.kt` and `ui/theme/Theme.kt` to customize the appearance.

### Modifying Piece Graphics
Chess pieces are custom-drawn using Jetpack Compose Canvas API. Edit `ui/components/ChessPieces.kt` to change the piece designs.

### Extending AI Difficulty
Add new difficulty levels in `engine/Difficulty.kt` and adjust time controls in `ChessViewModel.kt`.

## License

The Marble Chess Android app code is provided as-is for educational purposes. 

**Important**: If you include Stockfish in your distribution, the combined work falls under GPL v3 due to Stockfish's license. The fallback AI engine and UI code can be used under more permissive terms.

## Acknowledgments

- [Chesslib](https://github.com/bhlangonijr/chesslib) - For chess move generation and validation
- [Stockfish](https://stockfishchess.org/) - For the powerful chess engine (optional)
- [Jetpack Compose](https://developer.android.com/jetpack/compose) - For modern Android UI
