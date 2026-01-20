'use client';

import { useState, useEffect, useCallback } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    id: 4,
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Gd", "Go", "Ag", "Au"],
    correctAnswer: 3,
  },
];

const QUESTION_TIME = 15; // seconds

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const isAnswered = selectedAnswer !== null || timeLeft === 0;

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  }, [currentQuestionIndex]);

  // Handle countdown timer
  useEffect(() => {
    if (showResult || isAnswered || timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [showResult, isAnswered, timeLeft]);

  // Handle progression after answering
  useEffect(() => {
    if (!isAnswered || showResult) return;

    const timer = setTimeout(handleNextQuestion, 1500);
    return () => clearTimeout(timer);
  }, [isAnswered, showResult, handleNextQuestion]);

  const handleAnswerClick = (optionIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(optionIndex);

    if (optionIndex === QUESTIONS[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(QUESTION_TIME);
    setSelectedAnswer(null);
  };

  if (showResult) {
    return (
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Quiz Completed!</h2>
        <div className="mb-6">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Your score</p>
          <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">
            {score} / {QUESTIONS.length}
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {score === QUESTIONS.length ? 'Perfect score! You are a genius!' : 
             score >= QUESTIONS.length / 2 ? 'Great job! You know your stuff.' : 
             'Better luck next time!'}
          </p>
        </div>
        <button
          onClick={resetQuiz}
          className="w-full rounded-md bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors shadow-md active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Question
          </span>
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {currentQuestionIndex + 1} <span className="text-zinc-400">/ {QUESTIONS.length}</span>
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Time Left
          </span>
          <span className={`text-lg font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-zinc-900 dark:text-white'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold leading-tight text-zinc-900 dark:text-white">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div 
          className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-indigo-600'}`}
          style={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
        />
      </div>

      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => {
          let buttonClass = "w-full rounded-xl border-2 p-4 text-left font-medium transition-all duration-200 ";
          
          if (isAnswered) {
            if (index === currentQuestion.correctAnswer) {
              buttonClass += "bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-500 dark:text-green-400";
            } else if (index === selectedAnswer) {
              buttonClass += "bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-500 dark:text-red-400";
            } else {
              buttonClass += "border-zinc-100 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 opacity-60";
            }
          } else {
            buttonClass += "border-zinc-100 hover:border-indigo-300 hover:bg-indigo-50 dark:border-zinc-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-900/20 text-zinc-700 dark:text-zinc-300 active:scale-[0.98]";
          }

          return (
            <button
              key={index}
              disabled={isAnswered}
              onClick={() => handleAnswerClick(index)}
              className={buttonClass}
            >
              <div className="flex items-center">
                <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-current text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <span>Overall Progress</span>
          <span>{Math.round(((currentQuestionIndex) / QUESTIONS.length) * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div 
            className="h-full bg-zinc-400 transition-all duration-500 ease-out dark:bg-zinc-600"
            style={{ width: `${((currentQuestionIndex) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
