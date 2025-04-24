// src/components/fileConverter/converterComponents/DataViewer.jsx
"use client";

import { useAppSelector } from "@/redux/hooks";
import Table from "./Table"; // Changed to default import
import Chart from "./Chart"; // Changed to default import

export default function DataViewer() {
  const { data, loading, error } = useAppSelector((state) => state.data);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data?.length) return <div>No data available</div>;

  return (
    <div className="space-y-8">
      <Table data={data} />
      <Chart data={data} />
    </div>
  );
}
