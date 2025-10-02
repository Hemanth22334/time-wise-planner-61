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
            className="p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1 border-2 border-border backdrop-blur-sm bg-card/80 group overflow-hidden relative"
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-full bg-gradient-to-br from-secondary to-secondary/50 ${stat.color} shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}>
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
