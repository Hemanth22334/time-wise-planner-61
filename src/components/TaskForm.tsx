import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TaskFormProps {
  onAddTask: (title: string, timeInMinutes: number) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a task name");
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('estimate-task-time', {
        body: { taskTitle: title.trim() }
      });

      if (error) {
        console.error("Error calling edge function:", error);
        toast.error("Failed to analyze task. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      if (!data || typeof data.minutes !== 'number') {
        console.error("Invalid response from edge function:", data);
        toast.error("Failed to estimate time. Please try again.");
        setIsAnalyzing(false);
        return;
      }

      const estimatedMinutes = data.minutes;
      const hours = Math.floor(estimatedMinutes / 60);
      const minutes = estimatedMinutes % 60;
      const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
      
      onAddTask(title.trim(), estimatedMinutes);
      toast.success(`Task added! Estimated time: ${timeDisplay}`);
      setTitle("");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6 shadow-lg border-2 border-border hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/80">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-title" className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Task Name
          </Label>
          <Input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isAnalyzing}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            AI will automatically estimate the time needed
          </p>
        </div>

        <Button 
          type="submit" 
          disabled={isAnalyzing || !title.trim()}
          className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-accent"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Sparkles className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </>
          )}
        </Button>
      </form>
    </Card>
  );
};
