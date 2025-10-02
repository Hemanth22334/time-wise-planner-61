import { Clock, CheckCircle2, ListTodo } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TaskStatsProps {
  totalTasks: number;
  completedTasks: number;
  totalTimeMinutes: number;
  remainingTimeMinutes: number;
}

export const TaskStats = ({ totalTasks, completedTasks, totalTimeMinutes, remainingTimeMinutes }: TaskStatsProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const stats = [
    {
      icon: ListTodo,
      label: "Total Tasks",
      value: totalTasks,
      color: "text-primary",
    },
    {
      icon: CheckCircle2,
      label: "Completed",
      value: completedTasks,
      color: "text-green-600",
    },
    {
      icon: Clock,
      label: "Remaining Time",
      value: formatTime(remainingTimeMinutes),
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 border-border"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
