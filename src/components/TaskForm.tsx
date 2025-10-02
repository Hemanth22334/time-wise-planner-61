import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface TaskFormProps {
  onAddTask: (title: string, timeInMinutes: number) => void;
}

export const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [title, setTitle] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const totalMinutes = (parseInt(hours) || 0) * 60 + (parseInt(minutes) || 0);
    
    if (totalMinutes <= 0) return;
    
    onAddTask(title.trim(), totalMinutes);
    setTitle("");
    setHours("");
    setMinutes("");
  };

  return (
    <Card className="p-6 shadow-lg border-2 border-border hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-card/80">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="task-title" className="text-sm font-medium">
            Task Name
          </Label>
          <Input
            id="task-title"
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Time Estimate</Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Hours"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="Minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-primary to-accent"
          size="lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>
    </Card>
  );
};
