import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import VoiceInput from "@/components/VoiceInput";
import LearningContent from "@/components/LearningContent";
import Quiz from "@/components/Quiz";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}

interface LearningData {
  explanation: string;
  example: string;
  quiz: QuizQuestion[];
}

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [topic, setTopic] = useState("");
  const [learningData, setLearningData] = useState<LearningData | null>(null);
  const { toast } = useToast();

  const handleTranscript = async (transcript: string) => {
    setTopic(transcript);
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-learning-content", {
        body: { topic: transcript },
      });

      if (error) throw error;

      setLearningData(data);
      toast({
        title: "Success!",
        description: "Your learning content is ready!",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setLearningData(null);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-card shadow-glow">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">AI-Powered Learning</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Speak & Solve
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn anything instantly with voice-powered AI explanations, examples, and interactive quizzes
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {!learningData ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-scale-in">
              <VoiceInput onTranscript={handleTranscript} isProcessing={isProcessing} />
              
              {isProcessing && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card shadow-glow">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">
                      Generating your personalized learning content...
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Topic Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    {topic}
                  </h2>
                  <p className="text-muted-foreground">
                    Let's dive into this topic together!
                  </p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  New Topic
                </Button>
              </div>

              {/* Learning Content */}
              <LearningContent
                explanation={learningData.explanation}
                example={learningData.example}
              />

              {/* Quiz */}
              <Quiz questions={learningData.quiz} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-muted-foreground animate-fade-in">
          <p>Powered by AI • Made for curious minds 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
