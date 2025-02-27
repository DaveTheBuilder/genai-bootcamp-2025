
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  title: string;
  description?: string;
  icon: string;
  to: string;
  className?: string;
}

export const ActivityCard = ({ title, description, icon, to, className }: ActivityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-400/5 dark:to-blue-500/20" />
      <div className="relative z-10 flex flex-col items-start space-y-4">
        <div className="rounded-xl bg-blue-50/80 p-3 dark:bg-blue-900/20">
          <img src={icon} alt={title} className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>
        <Link
          to={to}
          className="mt-auto inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Start Activity
          <svg
            className="ml-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};