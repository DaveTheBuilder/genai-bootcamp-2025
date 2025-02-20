// src/pages/study-activities/Hangman.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

const Hangman: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [maxWrongGuesses] = useState<number>(6);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const fetchWords = async () => {
      const data = await api.words.list();
      const randomWord = data.items[Math.floor(Math.random() * data.items.length)].spanish;
      setWord(randomWord);
    };

    fetchWords();
  }, []);

  const handleGuess = (letter: string) => {
    if (!guessedLetters.includes(letter)) {
      setGuessedLetters((prev) => [...prev, letter]);
      if (!word.includes(letter)) {
        setWrongGuesses((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (wrongGuesses >= maxWrongGuesses) {
      setGameOver(true);
    }
  }, [wrongGuesses]);

  const displayWord = word.split('').map((letter) => (guessedLetters.includes(letter) ? letter : '_')).join(' ');

  return (
    <div>
      <h2>Hangman</h2>
      <h3>{gameOver ? 'Game Over!' : displayWord}</h3>
      <h4>Wrong Guesses: {wrongGuesses}/{maxWrongGuesses}</h4>
      {!gameOver && (
        <div>
          {Array.from('abcdefghijklmnopqrstuvwxyz').map((letter) => (
            <button key={letter} onClick={() => handleGuess(letter)} disabled={guessedLetters.includes(letter)}>
              {letter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hangman;