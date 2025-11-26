import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

const VoiceInput = ({ onTranscript, isProcessing }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US";

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        toast({
          title: "Error",
          description: "Failed to recognize speech. Please try again.",
          variant: "destructive",
        });
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscript, toast]);

  const toggleListening = () => {
    if (!recognition) {
      toast({
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your topic or question now",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        onClick={toggleListening}
        disabled={isProcessing}
        size="lg"
        className={`w-32 h-32 rounded-full p-0 transition-all duration-300 ${
          isListening
            ? "gradient-secondary shadow-glow-secondary animate-pulse-glow"
            : "gradient-primary shadow-glow hover:scale-105"
        }`}
      >
        {isListening ? (
          <Mic className="w-16 h-16 text-secondary-foreground" />
        ) : (
          <MicOff className="w-16 h-16 text-primary-foreground" />
        )}
      </Button>
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {isListening ? "Listening..." : "Tap to Speak"}
        </h2>
        <p className="text-muted-foreground">
          {isListening 
            ? "Ask any question or topic" 
            : "Click the microphone to start"}
        </p>
      </div>
    </div>
  );
};

export default VoiceInput;
