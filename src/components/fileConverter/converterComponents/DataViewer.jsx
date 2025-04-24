"use client";
import { useAppSelector } from "../../../redux/store";
import { Table } from "../converterComponents/Table";
import { Chart } from "../converterComponents/Chart";

export function DataViewer() {
  const data = useAppSelector((state) => state.data.data);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full">
      {/* <h1 className="text-2xl font-bold mb-4 text-black">Data Visualizer</h1> */}

      <div className="p-4 rounded-md">
        <h1 className="text-2xl font-semibold ">Your Data as Table</h1>
        <Table data={data} />
      </div>
      <div className=" p-4 rounded-md">
        <h1 className="text-2xl font-semibold">Data as Chart</h1>
        <Chart data={data} />
      </div>
    </div>
  );
}
