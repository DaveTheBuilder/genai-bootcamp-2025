import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, RefreshCcw } from "lucide-react";
const MAX_ATTEMPTS = 5;
const MissingLetters = () => {
  const [word, setWord] = useState('HELLO');
  const [missingIndex, setMissingIndex] = useState(1);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fetchNewWord = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/words'); // Replace with your API
      const data = await response.json();
      const randomWord = data.results[Math.floor(Math.random() * data.results.length)].spanish;
      setWord(randomWord.toUpperCase());
      setMissingIndex(Math.floor(Math.random() * randomWord.length));
      setAttempts(0);
    } catch (error) {
      console.error('Error fetching word:', error);
      // For demo purposes, use a fallback word
      const fallbackWords = ['HELLO', 'WORLD', 'REACT', 'CODE'];
      setWord(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
      setMissingIndex(Math.floor(Math.random() * 5));
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchNewWord();
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.trim().toUpperCase() === word[missingIndex]) {
      toast({
        title: "Correct!",
        description: "Great job! Here's a new word for you.",
        className: "bg-green-50 border-green-200",
      });
      setScore((prev) => prev + 1);
      fetchNewWord();
    } else {
      toast({
        title: "Try again",
        description: `${MAX_ATTEMPTS - attempts - 1} attempts remaining`,
        variant: "destructive",
      });
      setAttempts((prev) => prev + 1);
    }
    setUserInput('');
  };
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="p-8 bg-white/90 backdrop-blur-sm shadow-lg border-0">
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <motion.div
                className="inline-flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-700"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
              >
                Score: {score}
              </motion.div>
              <h1 className="text-3xl font-semibold tracking-tight">Missing Letter</h1>
              <p className="text-muted-foreground">Fill in the missing letter</p>
            </div>
            <div className="flex justify-center space-x-2">
              {word.split('').map((letter, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    w-12 h-12 flex items-center justify-center
                    border-2 rounded-lg text-2xl font-bold
                    ${index === missingIndex ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
                  `}
                >
                  {index === missingIndex ? '_' : letter}
                </motion.div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center">
                <Input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  maxLength={1}
                  className="w-16 h-16 text-2xl text-center font-bold"
                  autoFocus
                  disabled={attempts >= MAX_ATTEMPTS || isLoading}
                />
              </div>
              <div className="flex justify-center space-x-3">
                <Button
                  type="submit"
                  disabled={!userInput || attempts >= MAX_ATTEMPTS || isLoading}
                  className="w-32"
                >
                  Submit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                {attempts >= MAX_ATTEMPTS && (
                  <Button
                    onClick={fetchNewWord}
                    variant="outline"
                    className="w-32"
                  >
                    New Word
                    <RefreshCcw className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
            <div className="flex justify-center space-x-1">
              {Array.from({ length: MAX_ATTEMPTS }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`
                    w-2 h-2 rounded-full
                    ${index < attempts ? 'bg-red-400' : 'bg-gray-200'}
                  `}
                />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
export default MissingLetters;