
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import type { WeightRecord } from "@/pages/WeightTracker";

interface WeightChartProps {
  weightRecords: WeightRecord[];
}

const WeightChart = ({ weightRecords }: WeightChartProps) => {
  // Process data for the chart
  const chartData = [...weightRecords]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => ({
      date: record.date,
      weight: record.weight
    }));

  // Calculate min and max for Y axis (with padding)
  const weights = chartData.map(d => d.weight);
  const minWeight = Math.floor(Math.min(...weights) - 1);
  const maxWeight = Math.ceil(Math.max(...weights) + 1);
  
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-2 text-card-foreground">Weight Chart</h2>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(date) => format(parseISO(date), "MMM d")}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `${value}`}
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              formatter={(value) => [`${value} kg`, "Weight"]}
              labelFormatter={(date) => format(parseISO(date as string), "MMMM d, yyyy")}
              contentStyle={{ 
                backgroundColor: "hsl(var(--card))", 
                color: "hsl(var(--card-foreground))",
                border: "1px solid hsl(var(--border))"
              }}
              itemStyle={{ color: "hsl(var(--primary))" }}
              labelStyle={{ color: "hsl(var(--card-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#6366F1"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeightChart;
