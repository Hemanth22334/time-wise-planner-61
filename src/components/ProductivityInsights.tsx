import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap, Award, Target, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
}

interface ProductivityInsightsProps {
  tasks: Task[];
}

export const ProductivityInsights = ({ tasks }: ProductivityInsightsProps) => {
  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);
  
  const completionRate = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const totalPlannedMinutes = tasks.reduce((sum, t) => sum + t.timeInMinutes, 0);
  const completedMinutes = completedTasks.reduce((sum, t) => sum + t.timeInMinutes, 0);
  
  const timeCompletionRate = totalPlannedMinutes > 0 
    ? Math.round((completedMinutes / totalPlannedMinutes) * 100) 
    : 0;

  const averageTaskTime = tasks.length > 0 
    ? Math.round(totalPlannedMinutes / tasks.length) 
    : 0;

  const getPerformanceLevel = () => {
    if (completionRate >= 80) return { label: "Excellent", color: "text-green-600", icon: TrendingUp };
    if (completionRate >= 60) return { label: "Good", color: "text-blue-600", icon: TrendingUp };
    if (completionRate >= 40) return { label: "Fair", color: "text-yellow-600", icon: TrendingDown };
    return { label: "Needs Focus", color: "text-red-600", icon: TrendingDown };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  const insights = [
    {
      icon: Target,
      label: "Task Completion",
      value: `${completionRate}%`,
      description: `${completedTasks.length} of ${tasks.length} tasks completed`,
      color: "text-blue-500"
    },
    {
      icon: Zap,
      label: "Time Efficiency",
      value: `${timeCompletionRate}%`,
      description: `${completedMinutes} of ${totalPlannedMinutes} minutes done`,
      color: "text-purple-500"
    },
    {
      icon: Calendar,
      label: "Average Task Time",
      value: `${averageTaskTime}min`,
      description: tasks.length > 0 ? "per task planned" : "No tasks yet",
      color: "text-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Current Performance</p>
              <div className="flex items-center gap-2">
                <PerformanceIcon className={`h-5 w-5 ${performance.color}`} />
                <span className={`text-2xl font-bold ${performance.color}`}>
                  {performance.label}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="text-lg px-4 py-2">
              {completionRate}%
            </Badge>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completionRate >= 80 
              ? "You're crushing it! Keep up the excellent work!" 
              : completionRate >= 60 
              ? "Great progress! You're on the right track." 
              : completionRate >= 40
              ? "Good effort! Focus on completing remaining tasks."
              : "Let's boost your productivity! Start with small wins."}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <Card key={index} className="border border-border/50">
              <CardContent className="pt-6 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${insight.color}`} />
                  <p className="text-xs text-muted-foreground">{insight.label}</p>
                </div>
                <div className="space-y-1">
                  <p className={`text-2xl font-bold ${insight.color}`}>
                    {insight.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
