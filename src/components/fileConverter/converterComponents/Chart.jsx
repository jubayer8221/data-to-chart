// src/components/fileConverter/converterComponents/Chart.js
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export function Chart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="py-6 my-2 text-center text-gray-500">
        No chart data available
      </div>
    );
  }

  // Find numeric and label keys
  const numericKeys = Object.keys(data[0] || {}).filter(
    (key) => typeof data[0][key] === "number"
  );
  const labelKey = Object.keys(data[0] || {}).find(
    (key) => !numericKeys.includes(key)
  );

  if (!numericKeys.length || !labelKey) {
    return (
      <div className="py-6 my-2 text-center text-gray-500">
        No numeric data found for chart
      </div>
    );
  }

  // Color palette for multiple bars
  const colors = ["#0A3A66", "#1E6FB9", "#4A90E2", "#7FB6F0"];

  return (
    <div className="py-6 my-2 rounded-md mx-[100px] border-1">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Legend />
          {numericKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              name={key}
              fill={colors[index % colors.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
