import { useState } from "react";
import { TaskForm } from "@/components/TaskForm";
import { TaskItem } from "@/components/TaskItem";
import { TaskStats } from "@/components/TaskStats";
import { toast } from "sonner";
import { CalendarCheck2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = (title: string, timeInMinutes: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      timeInMinutes,
      completed: false,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
            <CalendarCheck2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Task Planner
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Plan your day efficiently by allocating time to each task
          </p>
        </header>

        <div className="space-y-8">
          <TaskStats
            totalTasks={tasks.length}
            completedTasks={completedTasks}
            totalTimeMinutes={totalTimeMinutes}
            remainingTimeMinutes={remainingTimeMinutes}
          />

          <TaskForm onAddTask={handleAddTask} />

          {tasks.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Tasks</h2>
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    {...task}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-16 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary text-muted-foreground mb-4">
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
