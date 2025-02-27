
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import HangmanDrawing from '../../components/HangmanDrawing';

const SPANISH_WORDS = [
  'hola', 'gato', 'perro', 'casa', 'amor', 'vida', 'sol', 'luna', 'mar', 'cielo',
  'tierra', 'fuego', 'agua', 'aire', 'árbol', 'flor', 'libro', 'mesa', 'silla', 'pan'
];

const Hangman: React.FC = () => {
  const [word, setWord] = useState<string>('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number>(0);
  const [maxWrongGuesses] = useState<number>(10); // Updated to match number of hangman pieces
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const randomWord = SPANISH_WORDS[Math.floor(Math.random() * SPANISH_WORDS.length)];
    setWord(randomWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setGameOver(false);
    setGameWon(false);
  };

  const handleGuess = (letter: string) => {
    if (gameOver || gameWon || guessedLetters.includes(letter)) return;

    setGuessedLetters((prev) => [...prev, letter]);
    
    if (!word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1);
      toast.error('¡Incorrecto!', {
        description: 'Try another letter',
      });
    } else {
      toast.success('¡Correcto!', {
        description: 'Keep going!',
      });
    }
  };

  useEffect(() => {
    if (wrongGuesses >= maxWrongGuesses) {
      setGameOver(true);
      toast.error('¡Game Over!', {
        description: `The word was: ${word}`,
      });
    } else if (word && word.split('').every(letter => guessedLetters.includes(letter))) {
      setGameWon(true);
      toast.success('¡Felicitaciones!', {
        description: 'You won the game!',
      });
    }
  }, [wrongGuesses, guessedLetters, word]);

  const displayWord = word.split('').map((letter, index) => (
    <motion.span
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mx-1 text-4xl font-mono border-b-2 border-primary min-w-[30px] inline-block text-center"
    >
      {guessedLetters.includes(letter) 
|| gameOver 
? letter : '_'}
    </motion.span>
  ));

  const keyboard = Array.from('abcdefghijklmnopqrstuvwxyzáéíóúñ').map((letter) => (
    <motion.button
      key={letter}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => handleGuess(letter)}
      disabled={guessedLetters.includes(letter) || gameOver || gameWon}
      className={`m-1 px-4 py-2 rounded-lg transition-colors duration-200
        ${guessedLetters.includes(letter)
          ? word.includes(letter)
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
          : 'bg-white hover:bg-gray-100 text-gray-800'}
        disabled:opacity-50 disabled:cursor-not-allowed
        border border-gray-200 shadow-sm`}
    >
      {letter}
    </motion.button>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Hangman</h1>
          <p className="text-gray-600">Guess the Spanish word!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-8">
          <div className="flex justify-center">
            <HangmanDrawing wrongGuesses={wrongGuesses} />
          </div>
          
          <div className="text-center">
            <div className="mb-6">{displayWord}</div>
            <p className="text-gray-600 mb-4">
              Wrong Guesses: {wrongGuesses}/{maxWrongGuesses}
            </p>
          </div>
        </div>

        <AnimatePresence>
          {(gameOver || gameWon) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center mb-8"
            >
              <h2 className={`text-2xl font-bold mb-4 ${gameWon ? 'text-green-600' : 'text-red-600'}`}>
                {gameWon ? '¡Felicitaciones!' : '¡Game Over!'}
              </h2>
              {gameOver && !gameWon && (
                <p className="text-lg mb-4">
                  The word was: <span className="font-bold text-primary">{word}</span>
                </p>
              )}
              <button
                onClick={startNewGame}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-wrap justify-center gap-1"
        >
          {keyboard}
        </motion.div>
      </div>
    </div>
  );
};

export default Hangman;