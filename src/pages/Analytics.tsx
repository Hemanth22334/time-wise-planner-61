import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Clock, TrendingUp, Target, Zap } from "lucide-react";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
}

const Analytics = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage
    const stored = localStorage.getItem("flowtime-tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tasks:", e);
      }
    }
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalTime = tasks.reduce((sum, t) => sum + t.timeInMinutes, 0);
  const completedTime = tasks.filter((t) => t.completed).reduce((sum, t) => sum + t.timeInMinutes, 0);
  const avgTaskTime = totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0;

  // Distribution data
  const distributionData = [
    { name: "Completed", value: completedTime, color: "hsl(142, 76%, 36%)" },
    { name: "Remaining", value: totalTime - completedTime, color: "hsl(262, 83%, 58%)" },
  ].filter((item) => item.value > 0);

  // Task duration categories
  const durationCategories = [
    { name: "Quick (<30m)", count: 0, color: "hsl(142, 76%, 36%)" },
    { name: "Short (30m-1h)", count: 0, color: "hsl(200, 70%, 50%)" },
    { name: "Medium (1-2h)", count: 0, color: "hsl(262, 83%, 58%)" },
    { name: "Long (>2h)", count: 0, color: "hsl(0, 84%, 60%)" },
  ];

  tasks.forEach((task) => {
    if (task.timeInMinutes < 30) durationCategories[0].count++;
    else if (task.timeInMinutes < 60) durationCategories[1].count++;
    else if (task.timeInMinutes < 120) durationCategories[2].count++;
    else durationCategories[3].count++;
  });

  const stats = [
    {
      icon: Target,
      label: "Completion Rate",
      value: `${completionRate}%`,
      color: "text-green-600",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Clock,
      label: "Avg Task Time",
      value: avgTaskTime > 60 ? `${Math.floor(avgTaskTime / 60)}h ${avgTaskTime % 60}m` : `${avgTaskTime}m`,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: TrendingUp,
      label: "Total Tasks",
      value: totalTasks,
      color: "text-purple-600",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: Zap,
      label: "Total Time",
      value: totalTime > 60 ? `${Math.floor(totalTime / 60)}h` : `${totalTime}m`,
      color: "text-orange-600",
      bgColor: "bg-orange-500/10",
    },
  ];

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navbar />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Insights into your productivity and task management
          </p>
        </header>

        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in-right">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index}
                  className="p-6 backdrop-blur-sm bg-card/80 border-2 border-border hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
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

          {tasks.length === 0 ? (
            <Card className="p-12 text-center backdrop-blur-sm bg-card/80 border-2 border-border animate-fade-in">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary text-muted-foreground mb-4">
                  <BarChart className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">No Data Yet</h3>
                <p className="text-muted-foreground">
                  Add some tasks to see your analytics and insights
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Time Distribution Pie Chart */}
              {distributionData.length > 0 && (
                <Card className="p-6 backdrop-blur-sm bg-card/80 border-2 border-border animate-scale-in">
                  <h3 className="text-lg font-semibold mb-4">Time Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatTime(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              )}

              {/* Task Duration Categories */}
              <Card className="p-6 backdrop-blur-sm bg-card/80 border-2 border-border animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <h3 className="text-lg font-semibold mb-4">Task Duration Categories</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={durationCategories}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {durationCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
