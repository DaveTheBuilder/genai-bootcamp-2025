
import React from 'react';
import { motion } from 'framer-motion';

interface HangmanDrawingProps {
  wrongGuesses: number;
}

const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ wrongGuesses }) => {
  const parts = [
    // Base
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="20" y1="230" x2="100" y2="230"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Vertical pole
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="60" y1="20" x2="60" y2="230"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Horizontal beam
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="60" y1="20" x2="140" y2="20"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Rope
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="20" x2="140" y2="50"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Head
    <motion.circle
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5 }}
      cx="140" cy="70" r="20"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />,
    // Body
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="90" x2="140" y2="150"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Left Arm
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="120" x2="100" y2="100"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Right Arm
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="120" x2="180" y2="100"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Left Leg
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="150" x2="100" y2="180"
      stroke="currentColor"
      strokeWidth="4"
    />,
    // Right Leg
    <motion.line
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      x1="140" y1="150" x2="180" y2="180"
      stroke="currentColor"
      strokeWidth="4"
    />
  ];

  return (
    <div className="w-[200px] h-[250px] relative">
      <svg width="200" height="250" className="stroke-primary">
        {parts.slice(0, wrongGuesses)}
      </svg>
    </div>
  );
};

export default HangmanDrawing;