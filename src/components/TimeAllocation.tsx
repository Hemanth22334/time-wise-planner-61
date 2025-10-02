import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
}

interface ScheduledTask {
  taskId: string;
  taskTitle: string;
  startHour: number;
  duration: number;
  completed: boolean;
}

interface TimeAllocationProps {
  tasks: Task[];
}

export const TimeAllocation = ({ tasks }: TimeAllocationProps) => {
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>(() => {
    const stored = localStorage.getItem("flowtime-schedule");
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedTask, setSelectedTask] = useState<string>("");
  const [selectedHour, setSelectedHour] = useState<string>("9");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);

  const currentHour = new Date().getHours();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const saveSchedule = (newSchedule: ScheduledTask[]) => {
    setScheduledTasks(newSchedule);
    localStorage.setItem("flowtime-schedule", JSON.stringify(newSchedule));
  };

  const addTaskToSchedule = () => {
    if (!selectedTask) {
      toast.error("Please select a task");
      return;
    }

    const task = tasks.find(t => t.id === selectedTask);
    if (!task) return;

    const hour = parseInt(selectedHour);
    const newScheduledTask: ScheduledTask = {
      taskId: task.id,
      taskTitle: task.title,
      startHour: hour,
      duration: task.timeInMinutes,
      completed: task.completed,
    };

    saveSchedule([...scheduledTasks, newScheduledTask]);
    toast.success("Task scheduled!");
    setDialogOpen(false);
    setSelectedTask("");
  };

  const removeScheduledTask = (taskId: string, startHour: number) => {
    saveSchedule(scheduledTasks.filter(st => !(st.taskId === taskId && st.startHour === startHour)));
    toast.success("Task removed from schedule");
  };

  const openEditDialog = (task: ScheduledTask) => {
    setEditingTask(task);
    setSelectedHour(task.startHour.toString());
    setEditMode(true);
    setDialogOpen(true);
  };

  const updateScheduledTask = () => {
    if (!editingTask) return;

    const newHour = parseInt(selectedHour);
    const updatedSchedule = scheduledTasks.map(st => 
      st.taskId === editingTask.taskId && st.startHour === editingTask.startHour
        ? { ...st, startHour: newHour }
        : st
    );

    saveSchedule(updatedSchedule);
    toast.success("Task rescheduled!");
    closeDialog();
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditMode(false);
    setEditingTask(null);
    setSelectedTask("");
    setSelectedHour("9");
  };

  const getTasksForHour = (hour: number) => {
    return scheduledTasks.filter(st => {
      const endHour = st.startHour + (st.duration / 60);
      return hour >= st.startHour && hour < endHour;
    });
  };

  const calculateHourFill = (hour: number) => {
    const tasksInHour = getTasksForHour(hour);
    if (tasksInHour.length === 0) return 0;
    
    let totalMinutes = 0;
    tasksInHour.forEach(task => {
      const startMinute = hour === task.startHour ? 0 : 0;
      const endHour = task.startHour + (task.duration / 60);
      const endMinute = hour + 1 >= endHour ? (task.duration % 60) : 60;
      totalMinutes += Math.min(60, endMinute - startMinute);
    });
    
    return Math.min(100, (totalMinutes / 60) * 100);
  };

  const unscheduledTasks = tasks.filter(
    task => !scheduledTasks.some(st => st.taskId === task.id)
  );

  const totalScheduledMinutes = scheduledTasks.reduce((sum, st) => sum + st.duration, 0);
  const totalTaskMinutes = tasks.reduce((sum, t) => sum + t.timeInMinutes, 0);

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              24-Hour Time Allocation
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              if (!open) closeDialog();
              else setDialogOpen(open);
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editMode ? "Reschedule Task" : "Schedule a Task"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  {!editMode && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Task</label>
                      <Select value={selectedTask} onValueChange={setSelectedTask}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a task" />
                        </SelectTrigger>
                        <SelectContent>
                          {unscheduledTasks.map(task => (
                            <SelectItem key={task.id} value={task.id}>
                              {task.title} ({task.timeInMinutes} min)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {editMode && editingTask && (
                    <div className="p-3 rounded-lg bg-secondary/50 border">
                      <p className="text-sm font-medium">{editingTask.taskTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        Duration: {editingTask.duration} minutes
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {editMode ? "New Start Time (Hour)" : "Start Time (Hour)"}
                    </label>
                    <Select value={selectedHour} onValueChange={setSelectedHour}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map(hour => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {hour.toString().padStart(2, '0')}:00
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={editMode ? updateScheduledTask : addTaskToSchedule} 
                    className="w-full"
                  >
                    {editMode ? "Update Schedule" : "Add to Schedule"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {format(new Date(), "EEEE, MMMM d")}
              </span>
            </div>
            <Badge variant="outline">
              {Math.floor(totalScheduledMinutes / 60)}h {totalScheduledMinutes % 60}m / {Math.floor(totalTaskMinutes / 60)}h {totalTaskMinutes % 60}m
            </Badge>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {hours.map(hour => {
              const tasksInHour = getTasksForHour(hour);
              const fillPercentage = calculateHourFill(hour);
              const isCurrentHour = hour === currentHour;
              const isPast = hour < currentHour;

              return (
                <div key={hour} className="relative group">
                  <div
                    className={cn(
                      "relative h-16 rounded-lg border-2 transition-all cursor-pointer overflow-hidden",
                      isCurrentHour && "ring-2 ring-primary ring-offset-2",
                      isPast && "opacity-50",
                      tasksInHour.length > 0
                        ? "border-primary/50 bg-primary/10"
                        : "border-border bg-secondary/30"
                    )}
                  >
                    {fillPercentage > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-primary/30 transition-all"
                        style={{ height: `${fillPercentage}%` }}
                      />
                    )}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                      <span className={cn(
                        "text-xs font-bold",
                        tasksInHour.length > 0 ? "text-primary" : "text-muted-foreground"
                      )}>
                        {hour.toString().padStart(2, '0')}
                      </span>
                      {tasksInHour.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1 py-0 h-4 mt-1"
                        >
                          {tasksInHour.length}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {tasksInHour.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-2 z-10 hidden group-hover:block">
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[200px]">
                        <div className="space-y-2">
                          {tasksInHour.map((task, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-2 p-2 bg-card rounded border hover:border-primary/50 transition-colors cursor-pointer"
                              onClick={() => openEditDialog(task)}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">
                                  {task.taskTitle}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {task.startHour.toString().padStart(2, '0')}:00 • {task.duration}min
                                </p>
                                <p className="text-[10px] text-primary mt-1">
                                  Click to reschedule
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeScheduledTask(task.taskId, task.startHour);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary/30 border-2 border-primary/50" />
              <span className="text-muted-foreground">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-secondary/30 border-2 border-border" />
              <span className="text-muted-foreground">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded ring-2 ring-primary" />
              <span className="text-muted-foreground">Current Hour</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {unscheduledTasks.length > 0 && (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle className="text-base">Unscheduled Tasks ({unscheduledTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {unscheduledTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground">{task.timeInMinutes} minutes</p>
                  </div>
                  <Badge variant={task.completed ? "default" : "secondary"}>
                    {task.completed ? "Done" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
