import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PracticeType, TopicType, LevelType } from "@/types/practice";
import { Headphones } from "lucide-react";

interface PracticeSelectorProps {
  practiceType: PracticeType;
  topic: TopicType;
  level: LevelType;
  onPracticeTypeChange: (value: PracticeType) => void;
  onTopicChange: (value: TopicType) => void;
  onLevelChange: (value: LevelType) => void;
  onPromptChange: (value: string) => void;
  onGenerateQuestion: () => void;
}

const topicsByType: Record<PracticeType, TopicType[]> = {
  "Dialogue Practice": [
    "Daily Conversation",
    "Shopping",
    "Restaurant",
    "Travel",
    "School/Work",
  ],
  "Phrase Matching": [
    "Announcements",
    "Instructions",
    "Weather Reports",
    "News Updates",
  ], 
};

const levelsByType: Record<PracticeType, LevelType[]> = {
  "Dialogue Practice": ["beginner", "intermediate", "advanced"],
  "Phrase Matching": ["beginner", "intermediate", "advanced"],
};

export function PracticeSelector({
  practiceType,
  topic,
  level,
  onPracticeTypeChange,
  onTopicChange,
  onLevelChange,
  onGenerateQuestion,
}: PracticeSelectorProps) {
  return (
    <Card className="p-6 space-y-6 bg-jlpt-light border-none shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="practiceType">Practice Type</Label>
        <Select
          value={practiceType}
          onValueChange={(value) => onPracticeTypeChange(value as PracticeType)}
        >
          <SelectTrigger id="practiceType" className="w-full">
            <SelectValue placeholder="Select practice type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Dialogue Practice">Dialogue Practice</SelectItem>
            <SelectItem value="Phrase Matching">Phrase Matching</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="topic">Topic</Label>
        <Select value={topic} onValueChange={(value) => onTopicChange(value as TopicType)}>
          <SelectTrigger id="topic" className="w-full">
            <SelectValue placeholder="Select topic" />
          </SelectTrigger>
          <SelectContent>
            {topicsByType[practiceType].map((topicOption) => (  
              <SelectItem key={topicOption} value={topicOption}>
                {topicOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="level">Level</Label>
        <Select value={level} onValueChange={(value) => onLevelChange(value as LevelType)}>
          <SelectTrigger id="level" className="w-full">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            {levelsByType[practiceType].map((levelOption) => (
              <SelectItem key={levelOption} value={levelOption}>
                {levelOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onGenerateQuestion}
        className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
      >
        <Headphones className="mr-2 h-5 w-5" />
        Generate New Question
      </Button>
    </Card>
  );
}