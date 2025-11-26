import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Lightbulb } from "lucide-react";

interface LearningContentProps {
  explanation: string;
  example: string;
}

const LearningContent = ({ explanation, example }: LearningContentProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="animate-fade-in shadow-glow">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-primary">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <CardTitle>Explanation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-fade-in shadow-glow-secondary" style={{ animationDelay: "0.1s" }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg gradient-secondary">
              <Lightbulb className="w-5 h-5 text-secondary-foreground" />
            </div>
            <CardTitle>Example</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {example}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningContent;
