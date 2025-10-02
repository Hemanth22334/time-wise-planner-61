import { Clock, Check, Trash2, ChevronDown, Lightbulb, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface TaskItemProps {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
  firstPrinciples?: string;
  steps?: string[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem = ({ 
  id, 
  title, 
  timeInMinutes, 
  completed, 
  firstPrinciples, 
  steps, 
  onToggle, 
  onDelete 
}: TaskItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  const timeDisplay = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  const hasDetails = firstPrinciples || (steps && steps.length > 0);

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 group backdrop-blur-sm",
        completed 
          ? "opacity-60 bg-muted/50 border-muted" 
          : "border-border hover:border-primary/30 hover:shadow-primary/10"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Button
            variant={completed ? "secondary" : "default"}
            size="icon"
            className={cn(
              "shrink-0 rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
              completed ? "bg-green-500 hover:bg-green-600" : "shadow-lg hover:shadow-xl"
            )}
            onClick={() => onToggle(id)}
          >
            {completed && <Check className="h-4 w-4 animate-scale-in" />}
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
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground backdrop-blur-sm border border-border/50 transition-all duration-300 group-hover:shadow-md",
              completed && "opacity-60"
            )}>
              <Clock className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{timeDisplay}</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all duration-300 hover:scale-110 active:scale-95"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {hasDetails && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start gap-2 text-xs hover:bg-primary/5"
              >
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  isOpen && "rotate-180"
                )} />
                {isOpen ? "Hide details" : "View analysis & steps"}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-3">
              {firstPrinciples && (
                <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm mb-1 text-accent">First Principles</h4>
                      <p className="text-xs text-muted-foreground">{firstPrinciples}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {steps && steps.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <ListChecks className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-2 text-primary">Step-by-Step Plan</h4>
                      <ol className="space-y-1.5">
                        {steps.map((step, index) => (
                          <li key={index} className="text-xs text-muted-foreground flex gap-2">
                            <span className="font-semibold text-primary shrink-0">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </Card>
  );
};
