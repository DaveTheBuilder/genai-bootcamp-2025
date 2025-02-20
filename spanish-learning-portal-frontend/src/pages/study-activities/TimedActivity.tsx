// src/pages/study-activities/TimedActivity.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const TimedActivity: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchWords = async () => {
      const data = await api.words.list();
      setWords(data.items.map((word: any) => word.spanish));
    };

    fetchWords();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const startGame = () => {
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
    setTimeLeft(30);
    setScore(0);
    setGameOver(false);
    setInputValue('');
  };

  const handleAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim().toLowerCase() === currentWord.toLowerCase()) {
      setScore((prev) => prev + 1);
      setCurrentWord(words[Math.floor(Math.random() * words.length)]);
      setInputValue('');
    }
  };

  return (
    <div>
      <h2>Timed Activity</h2>
      {gameOver ? (
        <div>
          <h3>Game Over! Your score: {score}</h3>
          <button onClick={startGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <h3>Time Left: {timeLeft}s</h3>
          <h3>Current Word: {currentWord}</h3>
          <form onSubmit={handleAnswer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Your answer"
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TimedActivity;