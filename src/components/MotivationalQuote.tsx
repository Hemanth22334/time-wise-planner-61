import { useState, useEffect } from "react";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";

const quotes = [
  {
    text: "Time is what we want most, but what we use worst.",
    author: "William Penn"
  },
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    text: "Productivity is never an accident. It is always the result of a commitment to excellence.",
    author: "Paul J. Meyer"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar"
  },
  {
    text: "Time management is life management.",
    author: "Robin Sharma"
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
