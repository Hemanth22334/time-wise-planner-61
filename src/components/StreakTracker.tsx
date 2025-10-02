import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, Trophy, Calendar } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalDays: number;
}

export const StreakTracker = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
    totalDays: 0,
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

    const newData: StreakData = {
      currentStreak: newCurrentStreak,
      longestStreak: Math.max(newCurrentStreak, data.longestStreak),
      lastActivityDate: new Date().toISOString(),
      totalDays: data.totalDays + 1,
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

        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Total Active Days
            </span>
            <Badge variant="secondary">{streakData.totalDays}</Badge>
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
