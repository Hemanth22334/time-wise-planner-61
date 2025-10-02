import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  timeInMinutes: number;
  completed: boolean;
}

interface TaskChartProps {
  tasks: Task[];
}

export const TaskChart = ({ tasks }: TaskChartProps) => {
  if (tasks.length === 0) {
    return null;
  }

  const completedTime = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.timeInMinutes, 0);
  
  const remainingTime = tasks
    .filter((t) => !t.completed)
    .reduce((sum, t) => sum + t.timeInMinutes, 0);

  const data = [
    { name: "Completed", value: completedTime, color: "hsl(142, 76%, 36%)" },
    { name: "Remaining", value: remainingTime, color: "hsl(262, 83%, 58%)" },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 backdrop-blur-sm bg-card/80 border-2 border-border">
      <h3 className="text-lg font-semibold mb-4">Time Distribution</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => {
              const hours = Math.floor(value / 60);
              const mins = value % 60;
              return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};
