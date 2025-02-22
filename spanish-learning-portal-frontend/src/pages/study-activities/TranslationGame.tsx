import React, { useState, useEffect } from "react";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Audio } from "react-loader-spinner"; // Optional: For loading state
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TranslationGame: React.FC = () => {
  const [spanishWord, setSpanishWord] = useState<string>("");
  const [options, setOptions] = useState<string[]>([]);
  const [correctTranslation, setCorrectTranslation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTranslationGame();
  }, []); // ✅ Keep dependencies empty to avoid unnecessary rerenders

  const fetchTranslationGame = async () => {
    setLoading(true);
    try {
      const response = await api.words.getTranslationGame(); // Adjust API call
      setSpanishWord(response.spanish);
      setOptions(response.options);
      setCorrectTranslation(response.correct_translation);
      setSelectedOption(null);
      // ✅ Call Polly to play the audio
      await playAudio(response.spanish);
    } catch (error) {
      console.error("Error fetching translation game:", error);
      toast({
        title: "Error",
        description: "Failed to load the translation game.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const playAudio = async (word: string) => {
    try {
      const response = await fetch('/api/synthesize-speech/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: word }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create an audio element and play it
      const audio = new window.Audio(audioUrl); // 👈 Ensure it's accessed correctly
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Audio Error",
        description: "Could not play the pronunciation.",
        variant: "destructive",
      });
    }
  };

  // ✅ Utility function to convert Polly AudioStream to Blob
  const streamToBlob = async (stream: any, mimeType: string) => {
    const reader = stream.getReader();
    const chunks = [];
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    return new Blob(chunks, { type: mimeType });
  };

  const handleOptionClick = async (option: string) => {
    setSelectedOption(option);
    const isCorrect = option === correctTranslation;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      toast({
        title: "¡Correcto! 🎉",
        description: "Well done! Keep going!",
        className: "bg-green-50 border-green-200",
      });
    } else {
      toast({
        title: "Not quite right 😢",
        description: `The correct answer was: ${correctTranslation}`,
        variant: "destructive",
      });
    }

    // Add delay for animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    fetchTranslationGame();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Audio
          height="80"
          width="80"
          color="#4F46E5"
          ariaLabel="loading"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto space-y-8 bg-white rounded-xl shadow-lg p-8"
    >
      <div className="text-center space-y-4">
        <motion.div
          layout
          className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium"
        >
          Score: {score}
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={spanishWord}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-gray-900">{spanishWord}</h1>
            <button
              onClick={() => playAudio(spanishWord)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Click to hear pronunciation 🔊
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <motion.div
            key={option}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => handleOptionClick(option)}
              disabled={selectedOption !== null}
              className={cn(
                "w-full h-16 text-lg transition-all duration-200",
                selectedOption === option && option === correctTranslation && "bg-green-500 hover:bg-green-600",
                selectedOption === option && option !== correctTranslation && "bg-red-500 hover:bg-red-600"
              )}
            >
              {option}
            </Button>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => playAudio(spanishWord)}
        className="w-full mt-4 py-2 px-4 text-indigo-600 hover:text-indigo-700 transition-colors text-sm text-center"
      >
        Replay pronunciation 🔊
      </motion.button>
    </motion.div>
  );
};

export default TranslationGame;
