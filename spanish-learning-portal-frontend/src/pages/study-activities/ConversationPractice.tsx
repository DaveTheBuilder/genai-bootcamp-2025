
import { useState } from "react";
import { PracticeSelector } from "@/components/PracticeSelector";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { Question, Feedback, PracticeType, TopicType, LevelType } from "@/types/practice";
import { useToast } from "@/hooks/use-toast";

// Temporary mock data - replace with actual API calls later
/* const mockGenerateQuestion = (practiceType: PracticeType, topic: TopicType): Question => {
  if (practiceType === "Dialogue Practice") {
    return {
      Introduction: "You are at a restaurant in Madrid.",
      Conversation: "A: Disculpe, ¿este plato es picante?\nB: Sí, es un poco picante.",
      Question: "What is the customer asking about?",
      Options: [
        "If the food is expensive",
        "If the food is spicy",
        "If the food is ready",
        "If the food is delicious"
      ],
      correctAnswer: 2,
      explanation: "The customer asks '¿este plato es picante?' which means 'Is this dish spicy?'"
    };
  } else {
    return {
      Situation: "You are at a train station in Barcelona.",
      Question: "What is the next train's destination?",
      Options: [
        "Sants Station",
        "Plaza Catalunya",
        "El Prat Airport",
        "Sagrada Familia"
      ],
      correctAnswer: 1,
      explanation: "The announcement clearly states that the next train is bound for Sants Station."
    };
  }
}; */

const Index = () => {
  const { toast } = useToast();
  const [practiceType, setPracticeType] = useState<PracticeType>("Dialogue Practice");
  const [topic, setTopic] = useState<TopicType>("Daily Conversation");
  const [level, setLevel] = useState<LevelType>("beginner");
  const [prompt, setPrompt] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>();
  const [feedback, setFeedback] = useState<Feedback | undefined>();
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [debugData, setDebugData] = useState<string>("");

/*   const handleGenerateQuestion = () => {
    const question = mockGenerateQuestion(practiceType, topic);
    setCurrentQuestion(question);
    setSelectedAnswer(undefined);
    setFeedback(undefined);
    toast({
      title: "New Question Generated",
      description: "¡Buena suerte con tu práctica!",
    });
  }; */

  const API_URL = "http://localhost:8000/api"
  const handleGenerateQuestion = async () => {
    try {
      const response = await fetch(`${API_URL}/generate_question/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ practiceType, topic, level }),
      });
      const data = await response.json();
      setCurrentQuestion(data);
      setSelectedAnswer(undefined);
      setFeedback(undefined);
      setDebugData(JSON.stringify(data, null, 2)); // Store JSON response
      toast({ title: "New Question Generated", description: "¡Buena suerte con tu práctica!" });
    } catch (error) {
      console.error("Error fetching question:", error);
      toast({ title: "Error", description: "Failed to generate question.", variant: "destructive" });
    }
  };


  const handleNextQuestion = async () => {
    // Call the generate_similar_question function
    try {
        const response = await fetch(`${API_URL}/similar/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ practiceType, topic, level, prompt }),
        });
        const similarQuestion = await response.json();
        if (similarQuestion) {
            setCurrentQuestion(similarQuestion);
            setSelectedAnswer(undefined);
            setFeedback(undefined);
            toast({ title: "New Similar Question Generated", description: "¡Buena suerte con tu práctica!" });
        } else {
            toast({ title: "Error", description: "Failed to generate a similar question.", variant: "destructive" });
        }
    } catch (error) {
        console.error("Error fetching similar question:", error);
        toast({ title: "Error", description: "Failed to generate a similar question.", variant: "destructive" });
    }
};



  const handleSubmitAnswer = () => {
    if (!currentQuestion || selectedAnswer === undefined) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const feedback: Feedback = {
      correct: isCorrect,
      explanation: currentQuestion.explanation,
      correct_answer: currentQuestion.correctAnswer,
    };

    setFeedback(feedback);
    toast({
      title: isCorrect ? "¡Correcto!" : "Incorrecto",
      description: currentQuestion.explanation,
      variant: isCorrect ? "default" : "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-jlpt-light">
      <div className="container py-8 space-y-8">
        <div className="text-center space-y-4 animate-fadeIn">
          <h1 className="text-4xl font-bold tracking-tight">Spanish Listening Practice</h1>
          <p className="text-lg text-gray-600">Improve your Spanish listening skills with interactive exercises</p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px,1fr]">
          <PracticeSelector
            practiceType={practiceType}
            topic={topic}
            level={level}
            onPracticeTypeChange={setPracticeType}
            onTopicChange={setTopic}
            onLevelChange={setLevel}
            onPromptChange={setPrompt}
            onGenerateQuestion={handleGenerateQuestion}
          />

          <div className="space-y-6">
            {currentQuestion ? (
              <QuestionDisplay
                question={currentQuestion}
                feedback={feedback}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={setSelectedAnswer}
                onSubmit={handleSubmitAnswer}
                onNextQuestion={handleNextQuestion}
              />
            ) : (
              <div className="h-full flex items-center justify-center p-12 bg-white rounded-lg border border-jlpt shadow-sm animate-fadeIn">
                <p className="text-lg text-gray-500">Click 'Generate New Question' to start practicing!</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Debug Mode Toggle */}
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={debugMode} onChange={() => setDebugMode(!debugMode)} />
            <span>Enable Debug Mode</span>
          </label>
          {debugMode && (
            <textarea className="w-full h-40 mt-2 p-2 text-sm font-mono bg-white border border-gray-300 rounded-md" readOnly value={debugData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;