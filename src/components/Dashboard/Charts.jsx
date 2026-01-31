import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../../utils/formatNumber";

const Charts = ({ dailyData, monthlyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Analytics */}
      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Daily Revenue vs Expenses
        </h2>
        <ResponsiveContainer width="100%" height={370}>
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="dayLabel"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={2}
              tickFormatter={(value, index) => {
                const dataPoint = dailyData[index];
                if (dataPoint && dataPoint.date) {
                  const date = new Date(dataPoint.date);
                  const dayOfMonth = date.getDate();
                  // Show month name on 1st of each month
                  if (dayOfMonth === 1) {
                    return date.toLocaleString("default", { month: "short" });
                  }
                }
                // Return just the day number for other days
                return value.split(" ")[0];
              }}
            />
            <YAxis domain={[0, 20000]} />
            <Tooltip
              formatter={(value) => formatCurrency(value)}
              labelFormatter={(value, payload) => {
                if (payload && payload[0] && payload[0].payload) {
                  const dataPoint = payload[0].payload;
                  return `${dataPoint.dayLabel} - ${dataPoint.monthLabel}`;
                }
                return value;
              }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Analytics */}
      <div className="bg-[#F8F8F9] p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Monthly Revenue vs Expenses
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
            <YAxis domain={[0, 150000]} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              name="Revenue"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              name="Expenses"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
