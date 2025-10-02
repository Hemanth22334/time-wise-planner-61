import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

const quotes = [
  {
    text: "The ability to perform deep work is becoming increasingly rare and valuable in our economy.",
    author: "Deep Work Principle"
  },
  {
    text: "Clarity about what matters provides clarity about what does not.",
    author: "Deep Work Principle"
  },
  {
    text: "Focus intensely without distraction on a cognitively demanding task to push your capabilities.",
    author: "Deep Work Principle"
  },
  {
    text: "Schedule every minute of your day to protect time for what matters most.",
    author: "Deep Work Principle"
  },
  {
    text: "Embrace boredom and resist the urge to check your phone during idle moments.",
    author: "Deep Work Principle"
  },
  {
    text: "High-quality work produced equals time spent multiplied by intensity of focus.",
    author: "Deep Work Principle"
  },
  {
    text: "Train your ability to concentrate by eliminating shallow obligations from your schedule.",
    author: "Deep Work Principle"
  },
  {
    text: "Create rituals and routines to minimize friction when starting important work.",
    author: "Deep Work Principle"
  },
  {
    text: "Say no to shallow commitments to say yes to deep, meaningful work.",
    author: "Deep Work Principle"
  },
  {
    text: "Batch shallow tasks together and complete them in designated time blocks.",
    author: "Deep Work Principle"
  },
];

export const MotivationalQuote = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 15000); // Change every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const quote = quotes[currentQuote];

  return (
    <Card className="p-6 backdrop-blur-sm bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/20 animate-fade-in">
      <div className="flex gap-4">
        <Quote className="h-8 w-8 text-primary shrink-0 opacity-50" />
        <div className="space-y-2">
          <p className="text-lg font-medium italic text-foreground">
            "{quote.text}"
          </p>
          <p className="text-sm text-muted-foreground font-semibold">
            — {quote.author}
          </p>
        </div>
      </div>
    </Card>
  );
};
