
import { Question, Feedback } from "@/types/practice";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface QuestionDisplayProps {
  question: Question;
  feedback?: Feedback;
  selectedAnswer?: number;
  onAnswerSelect: (answer: number) => void;
  onSubmit: () => void;
  onNextQuestion: () => void;
}

export function QuestionDisplay({
  question,
  feedback,
  selectedAnswer,
  onAnswerSelect,
  onSubmit,
  onNextQuestion,
}: QuestionDisplayProps) {
  return (
    <Card className="p-6 space-y-6 animate-fadeIn bg-white">
      {question.Introduction && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Introduction</h3>
          <p className="text-gray-700">{question.Introduction}</p>
        </div>
      )}

      {question.Conversation && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Conversation</h3>
          <p className="text-gray-700">{question.Conversation}</p>
        </div>
      )}

      {question.Situation && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Situation</h3>
          <p className="text-gray-700">{question.Situation}</p>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Question</h3>
        <p className="text-gray-700">{question.Question}</p>
      </div>

      <div className="space-y-4">
        <RadioGroup
          value={selectedAnswer !== undefined ? selectedAnswer.toString() : ""}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
          disabled={!!feedback}
        >
          {question.Options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-md transition-all ${
                feedback
                  ? index === feedback.correct_answer 
                    ? "bg-green-50"
                    : index === selectedAnswer
                    ? "bg-red-50"
                    : "bg-gray-50"
                  : "hover:bg-gray-50"
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="flex-grow cursor-pointer"
              >
                {option}
              </Label>
              {feedback && (
                <span>
                  {index === feedback.correct_answer ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : index === selectedAnswer ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : null}
                </span>
              )}
            </div>
          ))}
        </RadioGroup>

        {feedback ? (
          <div className="space-y-4 animate-slideIn">
            <div
              className={`p-4 rounded-md ${
                feedback.correct ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <p
                className={`text-sm ${
                  feedback.correct ? "text-green-700" : "text-red-700"
                }`}
              >
                {feedback.explanation}
              </p>
            </div>
            <Button
              onClick={onNextQuestion}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Try Another Question
            </Button>
          </div>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={selectedAnswer === undefined}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            Submit Answer
          </Button>
        )}
      </div>
    </Card>
  );
}