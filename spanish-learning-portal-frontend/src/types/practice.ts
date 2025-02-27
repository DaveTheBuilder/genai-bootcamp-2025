
export interface Question {
    Introduction?: string;
    Conversation?: string;
    Situation?: string;
    Question: string;
    Options: string[];
    correctAnswer: number;
    explanation: string;
  }
  
  export interface Feedback {
    correct: boolean;
    explanation: string;
    correct_answer: number;
  }
  
  export type PracticeType = "Dialogue Practice" | "Phrase Matching";
  export type TopicType = 
    | "Daily Conversation" 
    | "Shopping" 
    | "Restaurant" 
    | "Travel" 
    | "School/Work"
    | "Announcements"
    | "Instructions"
    | "Weather Reports"
    | "News Updates";


export type LevelType = "beginner" | "intermediate" | "advanced";

export type PromptType = "" | "";
