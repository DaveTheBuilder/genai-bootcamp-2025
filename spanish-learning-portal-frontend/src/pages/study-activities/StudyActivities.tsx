import { motion } from "framer-motion";
import { ActivityCard } from "@/components/Study/ActivityCard";

const activities = [
  {
    title: "Timed Activity",
    description: "Race against the clock to complete challenges and improve your speed",
    icon: "src/icons/timer.svg",
    to: "/study-activities/timed",
  },
  {
    title: "Missing Letters",
    description: "Fill in the gaps to complete words and enhance your vocabulary",
    icon: "src/icons/letters.svg",
    to: "/study-activities/missing-letters",
  },
  {
    title: "Hangman",
    description: "Classic word-guessing game to test your knowledge",
    icon: "src/icons/hangman.svg",
    to: "/study-activities/hangman",
  },
  {
    title: "Translation Game",
    description: "Practice translating phrases between languages",
    icon: "src/icons/translate.svg",
    to: "/study-activities/translation-game",
  },
  {
    title: "Conversation Practice",
    description: "Improve your speaking skills through interactive dialogues",
    icon: "src/icons/conversation.svg",
    to: "/study-activities/conversation-practice",
  },
  {
    title: "Writing Practice",
    description: "Improve your Writing skills through OCR",
    icon: "src/icons/conversation.svg",
    to: "/study-activities/writing-practice",
  },
  {
    title: "Video Transcriber",
    description: "Learn from Spanish YouTube videos with searchable transcripts",
    icon: "src/icons/video.svg",
    to: "/study-activities/transcriber",
  },

];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-16 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
          >
            Study <span className="text-blue-600 dark:text-blue-400">Activities</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300"
          >
            Choose an activity to start learning and practicing
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activities.map((activity, index) => (
            <ActivityCard
              key={activity.title}
              {...activity}
              className={`transform transition-all duration-300 hover:scale-[1.02]`}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;