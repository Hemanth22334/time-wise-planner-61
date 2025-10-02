import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Sparkles, TrendingUp, Target, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Tip {
  icon: any;
  title: string;
  description: string;
  category: "productivity" | "wellness" | "strategy";
}

const productivityTips: Tip[] = [
  {
    icon: Target,
    title: "Use the Two-Minute Rule",
    description: "If a task takes less than two minutes, do it immediately. This prevents small tasks from piling up.",
    category: "productivity"
  },
  {
    icon: TrendingUp,
    title: "Eat the Frog First",
    description: "Tackle your most challenging or important task at the start of your day when energy is highest.",
    category: "strategy"
  },
  {
    icon: Sparkles,
    title: "Batch Similar Tasks",
    description: "Group similar tasks together to minimize context switching and maximize focus.",
    category: "productivity"
  },
  {
    icon: Lightbulb,
    title: "The 80/20 Rule",
    description: "Focus on the 20% of tasks that will generate 80% of your results. Prioritize ruthlessly.",
    category: "strategy"
  },
  {
    icon: Target,
    title: "Take Regular Breaks",
    description: "Use techniques like Pomodoro (25 min work, 5 min break) to maintain high performance throughout the day.",
    category: "wellness"
  },
  {
    icon: TrendingUp,
    title: "Break Down Big Tasks",
    description: "Divide large projects into smaller, actionable steps. This makes progress more tangible and less overwhelming.",
    category: "strategy"
  },
  {
    icon: Sparkles,
    title: "Time Block Your Calendar",
    description: "Schedule specific time blocks for different types of work to ensure important tasks get dedicated focus time.",
    category: "productivity"
  },
  {
    icon: Lightbulb,
    title: "Review and Reflect Daily",
    description: "Spend 5 minutes each evening reviewing what you accomplished and planning tomorrow's priorities.",
    category: "strategy"
  }
];

export const TaskSuggestions = () => {
  const [currentTips, setCurrentTips] = useState<Tip[]>(() => {
    // Get 3 random tips initially
    const shuffled = [...productivityTips].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const refreshTips = () => {
    const shuffled = [...productivityTips].sort(() => Math.random() - 0.5);
    setCurrentTips(shuffled.slice(0, 3));
    toast.success("Fresh tips loaded!");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "productivity":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "wellness":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "strategy":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Productivity Tips
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshTips}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="p-4 rounded-lg border border-border/50 bg-card/50 space-y-2 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-semibold">{tip.title}</h4>
                    <Badge
                      variant="outline"
                      className={getCategoryColor(tip.category)}
                    >
                      {tip.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
