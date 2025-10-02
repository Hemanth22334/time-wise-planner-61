import { Clock, Check, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ id, title, timeInMinutes, completed, onToggle, onDelete }: TaskItemProps) => {
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-lg border-2",
        completed ? "opacity-60 bg-muted/50 border-muted" : "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant={completed ? "secondary" : "default"}
          size="icon"
          className="shrink-0 rounded-full transition-all duration-300"
          onClick={() => onToggle(id)}
        >
          {completed && <Check className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-base transition-all duration-300",
            completed && "line-through text-muted-foreground"
          )}>
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground",
            completed && "opacity-60"
          )}>
            <Clock className="h-3.5 w-3.5" />
            <span className="text-sm font-medium">{timeDisplay}</span>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
