# Interactive Quiz App Implementation

## Overview

This implementation creates an interactive quiz application with question timers, scoring logic, and a responsive UI. The app tests user knowledge through a series of timed questions and provides immediate feedback.

## Changes Made

### 1. Quiz Component (`components/Quiz.tsx`)
- Developed a comprehensive client-side quiz engine.
- Implemented state management for:
  - Current question tracking
  - User score
  - Timer logic (15 seconds per question)
  - Answer selection and validation
  - Quiz completion state
- Added automatic progression to the next question after a brief delay when an answer is selected or time runs out.
- Created a polished result screen showing the final score and performance summary.

### 2. Updated Home Page (`app/page.tsx`)
- Replaced the previous weather app interface with the new Interactive Quiz UI.
- Simplified the layout to focus on the quiz experience.
- Maintained consistent styling and dark mode support.

### 3. Documentation (`README.md`)
- Completely rewritten to reflect the new quiz application.
- Added features, usage instructions, and tech stack details.

## Technical Details

### Timer Logic
- Uses `useEffect` and `setInterval` to handle the countdown.
- Implements a 15-second limit per question.
- Includes visual feedback (pulsing red text) when less than 5 seconds remain.
- Uses a progress bar that animates in sync with the timer.

### Scoring and Feedback
- Questions are stored in a typed array with options and correct answer indices.
- Immediate visual feedback is provided:
  - Green border/background for correct answers.
  - Red border/background for incorrect selections.
  - Correct answer is highlighted even if the user picks the wrong one or time expires.

### Responsive Design
- Built with Tailwind CSS 4.
- Centered layout optimized for both desktop and mobile devices.
- Uses a clean, card-based interface with subtle animations and transitions.

## Testing the Implementation

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Answer the questions as they appear. Notice the timer decreasing at the top right.

4. After the 5th question, view your final score on the result screen.

5. Click "Try Again" to restart the quiz.

## Future Enhancements

Possible improvements:
- Add difficulty levels (Easy, Medium, Hard).
- Fetch questions from an external API (like Open Quizz DB).
- Add sound effects for correct/incorrect answers and timer ticking.
- Implement a global leaderboard.
- Add category selection for the quiz.
- Support for multiple quiz sets.
