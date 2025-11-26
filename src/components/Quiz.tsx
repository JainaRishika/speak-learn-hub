import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}

interface QuizProps {
  questions: QuizQuestion[];
}

const Quiz = ({ questions }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(
    new Array(questions.length).fill(false)
  );
  const { toast } = useToast();

  const handleAnswer = (answerIndex: number) => {
    if (answeredQuestions[currentQuestion]) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: "Correct! 🎉",
        description: "Great job! Moving to the next question...",
      });
    } else {
      toast({
        title: "Not quite right",
        description: "Try reviewing the explanation and example.",
        variant: "destructive",
      });
    }

    const newAnsweredQuestions = [...answeredQuestions];
    newAnsweredQuestions[currentQuestion] = true;
    setAnsweredQuestions(newAnsweredQuestions);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowHint(false);
      }
    }, 2000);
  };

  const question = questions[currentQuestion];
  const isCompleted = answeredQuestions.every((answered) => answered);
  const hasAnswered = answeredQuestions[currentQuestion];

  return (
    <Card className="animate-fade-in shadow-glow-accent" style={{ animationDelay: "0.2s" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-accent">
              <HelpCircle className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <CardTitle>Quiz Time!</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {questions.length}
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg">
            Score: {score}/{questions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCompleted ? (
          <>
            <h3 className="text-lg font-semibold text-foreground">
              {question.question}
            </h3>

            <div className="grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = hasAnswered;

                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={hasAnswered}
                    variant={showResult && isCorrect ? "default" : "outline"}
                    className={`justify-start h-auto py-3 px-4 text-left transition-all ${
                      showResult && isCorrect
                        ? "gradient-secondary text-secondary-foreground border-secondary"
                        : showResult && isSelected && !isCorrect
                        ? "border-destructive text-destructive"
                        : ""
                    }`}
                  >
                    <span className="flex items-center gap-2 w-full">
                      <span className="flex-1">{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle className="w-5 h-5 shrink-0" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 shrink-0" />
                      )}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="pt-4 border-t">
              <Button
                onClick={() => setShowHint(!showHint)}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
              {showHint && (
                <p className="mt-2 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  💡 {question.hint}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="text-6xl mb-4">🎓</div>
            <h3 className="text-2xl font-bold text-foreground">
              Quiz Complete!
            </h3>
            <p className="text-xl text-muted-foreground">
              You scored {score} out of {questions.length}
            </p>
            <p className="text-muted-foreground">
              {score === questions.length
                ? "Perfect score! You're a master! 🌟"
                : score >= questions.length * 0.7
                ? "Great job! You've got a solid understanding! 👏"
                : "Good effort! Review the material and try again! 💪"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Quiz;
