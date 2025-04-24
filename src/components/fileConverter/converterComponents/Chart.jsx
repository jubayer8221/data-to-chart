"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function Chart({ data }) {
  const numericKey = Object.keys(data[0] || {}).find(
    (key) => typeof data[0][key] === "number"
  );
  const labelKey = Object.keys(data[0] || {}).find((key) => key !== numericKey);
  if (!numericKey || !labelKey) return null;

  return (
    <div className="py-6 my-2">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={numericKey} fill="#0A3A66" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
