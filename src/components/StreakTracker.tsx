import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDays: number;
  activeDates: string[]; // Array of ISO date strings
}

export const StreakTracker = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
    totalDays: 0,
    activeDates: [],
  });

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = () => {
    const stored = localStorage.getItem("flowtime-streaks");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        updateStreakStatus(data);
      } catch (e) {
        console.error("Failed to parse streak data:", e);
      }
    }
  };

  const updateStreakStatus = (data: StreakData) => {
    const today = new Date().toDateString();
    const lastActivity = new Date(data.lastActivityDate).toDateString();
    
    if (lastActivity === today) {
      // Already active today
      setStreakData(data);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      if (lastActivity === yesterdayStr) {
        // Streak continues
        setStreakData(data);
      } else if (data.lastActivityDate) {
        // Streak broken - reset current streak
        setStreakData({
          ...data,
          currentStreak: 0,
        });
      } else {
        setStreakData(data);
      }
    }
  };

  const recordActivity = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("flowtime-streaks");
    let data: StreakData = streakData;

    if (stored) {
      data = JSON.parse(stored);
    }

    const lastActivity = new Date(data.lastActivityDate).toDateString();

    if (lastActivity === today) {
      // Already recorded today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newCurrentStreak = 1;
    
    if (lastActivity === yesterdayStr) {
      // Continuing streak
      newCurrentStreak = data.currentStreak + 1;
    }

    const todayISO = new Date().toISOString().split('T')[0];
    const activeDates = [...(data.activeDates || [])];
    if (!activeDates.includes(todayISO)) {
      activeDates.push(todayISO);
    }

    const newData: StreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, data.longestStreak),
      lastActivityDate: new Date().toISOString(),
      totalDays: data.totalDays + 1,
      activeDates,
    };

    localStorage.setItem("flowtime-streaks", JSON.stringify(newData));
    setStreakData(newData);
  };

  // Expose recordActivity globally so other components can call it
  useEffect(() => {
    (window as any).recordFlowTimeActivity = recordActivity;
  }, [streakData]);

  const getStreakEmoji = () => {
    if (streakData.currentStreak >= 30) return "🔥🔥🔥";
    if (streakData.currentStreak >= 7) return "🔥🔥";
    if (streakData.currentStreak >= 3) return "🔥";
    return "✨";
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const isDateActive = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return streakData.activeDates.includes(dateStr);
  };

  const getDayLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' })[0];
  };

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            Your Streak
          </span>
          <span className="text-2xl">{getStreakEmoji()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-orange-500">
                {streakData.currentStreak}
              </span>
              <span className="text-muted-foreground">days</span>
            </div>
          </div>
          
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground flex items-center gap-1 justify-end">
              <Trophy className="h-4 w-4" />
              Best Streak
            </p>
            <div className="flex items-baseline gap-2 justify-end">
              <span className="text-2xl font-bold">
                {streakData.longestStreak}
              </span>
              <span className="text-sm text-muted-foreground">days</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Last 7 Days
            </span>
            <Badge variant="secondary">{streakData.totalDays} total</Badge>
          </div>
          
          <div className="flex justify-between gap-1">
            {getLast7Days().map((date, index) => {
              const isActive = isDateActive(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {getDayLabel(date)}
                  </span>
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                      isActive
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-secondary/50",
                      isToday && "ring-2 ring-primary ring-offset-2"
                    )}
                  >
                    {isActive && <Check className="h-4 w-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {streakData.currentStreak > 0 && (
          <p className="text-xs text-center text-muted-foreground pt-2">
            Keep going! Complete tasks or Pomodoros daily to maintain your streak.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
