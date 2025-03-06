
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
  
  // Determine if we should show the overweight line (BMI > 25 threshold)
  // Since we don't have height data here, we'll just show a visual indicator for the highest value
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-2">Weight Chart</h2>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => format(parseISO(date), "MMM d")}
            />
            <YAxis 
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              formatter={(value) => [`${value} kg`, "Weight"]}
              labelFormatter={(date) => format(parseISO(date as string), "MMMM d, yyyy")}
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
