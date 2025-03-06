import { useState, useRef, useEffect } from "react";
import { PracticeSelector } from "@/components/PracticeSelector";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
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

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const splitConversation = (conversation: string) => {
    const lines = conversation.split('\n');
    const parts = {
      personA: [] as string[],
      personB: [] as string[]
    };
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Person A:')) {
        parts.personA.push(trimmedLine.substring('Person A:'.length).trim());
      } else if (trimmedLine.startsWith('Person B:')) {
        parts.personB.push(trimmedLine.substring('Person B:'.length).trim());
      }
    });
    
    console.log('Split conversation parts:', parts);
    return parts;
  };

  const playAudio = async () => {
    if (!currentQuestion?.Conversation || !audioRef.current) {
      console.log('Missing conversation or audio ref:', { 
        hasConversation: !!currentQuestion?.Conversation,
        hasAudioRef: !!audioRef.current 
      });
      return;
    }
    
    try {
      setIsPlaying(true);
      console.log('Original conversation:', currentQuestion.Conversation);
      const parts = splitConversation(currentQuestion.Conversation);

      // Helper function to add delay between lines
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Interleave the conversation lines
      const maxLines = Math.max(parts.personA.length, parts.personB.length);
      for (let i = 0; i < maxLines; i++) {
        // Play person A's line if available
        if (parts.personA[i]) {
          console.log('Playing Person A line:', parts.personA[i]);
          const responseA = await fetch(`${API_URL}/synthesize-speech/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: parts.personA[i], voice: 'Lucia' })
          });

          if (!responseA.ok) {
            console.error('Response not OK:', await responseA.text());
            throw new Error('Failed to synthesize speech for person A');
          }
          
          const audioBlobA = await responseA.blob();
          const audioUrlA = URL.createObjectURL(audioBlobA);
          audioRef.current.src = audioUrlA;
          await audioRef.current.play();
          await new Promise(resolve => audioRef.current!.onended = resolve);
          URL.revokeObjectURL(audioUrlA);
          await delay(800); // Slightly longer pause after first speaker
        }

        // Play person B's line if available
        if (parts.personB[i]) {
          console.log('Playing Person B line:', parts.personB[i]);
          const responseB = await fetch(`${API_URL}/synthesize-speech/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: parts.personB[i], voice: 'Enrique' })
          });

          if (!responseB.ok) {
            console.error('Response not OK:', await responseB.text());
            throw new Error('Failed to synthesize speech for person B');
          }
          
          const audioBlobB = await responseB.blob();
          const audioUrlB = URL.createObjectURL(audioBlobB);
          audioRef.current.src = audioUrlB;
          await audioRef.current.play();
          await new Promise(resolve => audioRef.current!.onended = resolve);
          URL.revokeObjectURL(audioUrlB);
          await delay(800); // Slightly longer pause between exchanges
        }
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to play audio.',
        variant: 'destructive'
      });
    } finally {
      setIsPlaying(false);
    }
  };

  // Clean up audio URL when component unmounts or question changes
  useEffect(() => {
    return () => {
      if (audioRef.current?.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
    };
  }, [currentQuestion]);

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
              <>
                <QuestionDisplay
                  question={currentQuestion}
                  feedback={feedback}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={setSelectedAnswer}
                  onSubmit={handleSubmitAnswer}
                  onNextQuestion={handleNextQuestion}
                />
                {currentQuestion.Conversation && (
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      onClick={playAudio}
                      disabled={isPlaying}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Volume2 className="w-4 h-4" />
                      {isPlaying ? "Playing..." : "Play Conversation"}
                    </Button>
                    <audio 
                      ref={audioRef} 
                      onEnded={() => setIsPlaying(false)}
                      onError={() => {
                        setIsPlaying(false);
                        toast({
                          title: "Error",
                          description: "Failed to play audio.",
                          variant: "destructive",
                        });
                      }}
                    />
                  </div>
                )}
              </>
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