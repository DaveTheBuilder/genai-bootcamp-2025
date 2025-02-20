export interface Word {
  id: number;
  spanish: string;
  english: string;
  parts: {
    type: string;
    category: string;
    level: string;
  };
}

export interface Group {
  id: number;
  name: string;
  words_count: number;
}

export interface StudyActivity {
  id: number;
  name: string;
  description: string;
  url: string;
}

export interface Session {
  id: number;
  group_name: string;
  activity_id: number;
  start_time: string;
  review_items_count: number;
}

export interface WordReview {
  correct_count: number;
  incorrect_count: number;
  last_reviewed_at: string;
} 