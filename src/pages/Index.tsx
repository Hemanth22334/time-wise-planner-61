import { useState, useEffect } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { TaskStats } from "@/components/TaskStats";
import { TaskChart } from "@/components/TaskChart";
import { Navbar } from "@/components/Navbar";
import { MotivationalBackground } from "@/components/MotivationalBackground";
import { MotivationalQuote } from "@/components/MotivationalQuote";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
  firstPrinciples?: string;
  steps?: string[];
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("flowtime-tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse tasks:", e);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("flowtime-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (title: string, timeInMinutes: number, firstPrinciples?: string, steps?: string[]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      timeInMinutes,
      completed: false,
      firstPrinciples,
      steps,
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success(task.completed ? "Task marked as incomplete" : "Task completed! Great job!");
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted");
  };

  const totalTimeMinutes = tasks.reduce((sum, task) => sum + task.timeInMinutes, 0);
  const remainingTimeMinutes = tasks
    .filter(task => !task.completed)
    .reduce((sum, task) => sum + task.timeInMinutes, 0);
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <div className="min-h-screen relative">
      <MotivationalBackground />
      <Navbar />
      
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <header className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2 animate-shimmer bg-[length:200%_auto]">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Plan your day efficiently with AI-powered time estimation
          </p>
        </header>

        <div className="space-y-8">
          <div className="animate-fade-in">
            <MotivationalQuote />
          </div>

          <div className="animate-slide-in-right">
            <TaskStats
              totalTasks={tasks.length}
              completedTasks={completedTasks}
              totalTimeMinutes={totalTimeMinutes}
              remainingTimeMinutes={remainingTimeMinutes}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <div className="lg:col-span-2">
              <TaskForm onAddTask={handleAddTask} />
            </div>
            <div className="lg:col-span-1">
              <TaskChart tasks={tasks} />
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <span className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full" />
                Your Tasks
              </h2>
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div 
                    key={task.id}
                    className="animate-scale-in"
                    style={{ 
                      animationDelay: `${0.1 * index}s`,
                      animationFillMode: 'both'
                    }}
                  >
                    <TaskItem
                      {...task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-16 space-y-4 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary text-muted-foreground mb-4 animate-bounce-in">
                <CalendarCheck2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-muted-foreground">No tasks yet</h3>
              <p className="text-muted-foreground">Add your first task to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
