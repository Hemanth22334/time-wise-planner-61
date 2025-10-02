import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type TimerMode = "work" | "shortBreak" | "longBreak";

const TIMER_DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>("work");
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.work);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === "work") {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      // Record activity for streak tracking
      if ((window as any).recordFlowTimeActivity) {
        (window as any).recordFlowTimeActivity();
      }
      
      toast({
        title: "Pomodoro Complete! 🎉",
        description: `Great work! Time for a ${newCount % 4 === 0 ? "long" : "short"} break.`,
      });

      if (newCount % 4 === 0) {
        setMode("longBreak");
        setTimeLeft(TIMER_DURATIONS.longBreak);
      } else {
        setMode("shortBreak");
        setTimeLeft(TIMER_DURATIONS.shortBreak);
      }
    } else {
      toast({
        title: "Break Complete! 💪",
        description: "Ready to focus again?",
      });
      setMode("work");
      setTimeLeft(TIMER_DURATIONS.work);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[mode]);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_DURATIONS[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((TIMER_DURATIONS[mode] - timeLeft) / TIMER_DURATIONS[mode]) * 100;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Pomodoro Timer
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            Completed: {completedPomodoros}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2 justify-center">
          <Button
            variant={mode === "work" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("work")}
          >
            <Brain className="h-4 w-4 mr-1" />
            Focus
          </Button>
          <Button
            variant={mode === "shortBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("shortBreak")}
          >
            <Coffee className="h-4 w-4 mr-1" />
            Short Break
          </Button>
          <Button
            variant={mode === "longBreak" ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode("longBreak")}
          >
            <Coffee className="h-4 w-4 mr-1" />
            Long Break
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="text-6xl font-bold tabular-nums tracking-tight">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={toggleTimer} size="lg">
            {isRunning ? (
              <>
                <Pause className="h-5 w-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start
              </>
            )}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="lg">
            <RotateCcw className="h-5 w-5 mr-2" />
            Reset
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "work" && "Time to focus on deep work"}
          {mode === "shortBreak" && "Take a short break to recharge"}
          {mode === "longBreak" && "Enjoy a longer break, you've earned it!"}
        </div>
      </CardContent>
    </Card>
  );
};
