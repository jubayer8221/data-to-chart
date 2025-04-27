"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export function Chart({ data }) {
  const [chartType, setChartType] = useState("bar");
  const [labelColumn, setLabelColumn] = useState("");
  const [valueColumns, setValueColumns] = useState([]);
  const [colors, setColors] = useState({});
  const [showValueDropdown, setShowValueDropdown] = useState(false);

  const defaultColors = ["#0A3A66", "#1E6FB9", "#4A90E2", "#7FB6F0"];

  // Validate and process data
  const { columns, processedData } = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return { columns: [], processedData: [] };
    }

    const columns = Array.from(
      new Set(data.flatMap((row) => Object.keys(row)))
    );
    const processedData = data.map((row) => {
      const newRow = {};
      columns.forEach((col) => {
        newRow[col] = row[col] !== undefined ? row[col] : null;
      });
      return newRow;
    });

    return { columns, processedData };
  }, [data]);

  // Get numeric columns
  const numericColumns = useMemo(() => {
    if (!processedData.length) return [];
    return columns.filter((col) =>
      processedData.some(
        (row) => typeof row[col] === "number" && row[col] !== null
      )
    );
  }, [columns, processedData]);

  // Initialize default selections
  useEffect(() => {
    if (columns.length && !labelColumn) {
      setLabelColumn(columns[0]);
    }
    if (numericColumns.length && valueColumns.length === 0) {
      setValueColumns([numericColumns[0]]);
      setColors({ [numericColumns[0]]: defaultColors[0] });
    }
  }, [columns, numericColumns]);

  // Prepare data for Pie chart
  const pieData = useMemo(() => {
    if (!labelColumn || !valueColumns.length) return [];
    if (valueColumns.length > 1) {
      return [
        {
          name: valueColumns[0],
          value: processedData.reduce(
            (sum, item) =>
              sum +
              (typeof item[valueColumns[0]] === "number"
                ? item[valueColumns[0]]
                : 0),
            0
          ),
        },
      ];
    }
    return processedData
      .filter(
        (item) =>
          item[labelColumn] !== null &&
          typeof item[valueColumns[0]] === "number"
      )
      .map((item) => ({
        name: String(item[labelColumn]),
        value: item[valueColumns[0]],
      }));
  }, [processedData, labelColumn, valueColumns]);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleLabelColumnChange = (event) => {
    setLabelColumn(event.target.value);
  };

  const toggleValueColumn = (column) => {
    setValueColumns((prev) => {
      const newColumns = prev.includes(column)
        ? prev.filter((c) => c !== column)
        : [...prev, column];

      // Update colors for new selection
      const newColors = { ...colors };
      if (!newColors[column]) {
        newColors[column] =
          defaultColors[newColumns.length % defaultColors.length];
      }
      setColors(newColors);

      return newColumns;
    });
  };

  const handleColorChange = (column, color) => {
    setColors((prev) => ({ ...prev, [column]: color }));
  };

  const renderChart = () => {
    if (!labelColumn || !valueColumns.length) {
      return (
        <div className="py-6 my-2 text-center text-gray-500">
          Please select a label and at least one numeric column
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={labelColumn}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {valueColumns.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={key}
                fill={colors[key] || defaultColors[0]}
              />
            ))}
          </BarChart>
        );
      case "line":
        return (
          <LineChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={labelColumn}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {valueColumns.map((key) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={colors[key] || defaultColors[0]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    colors[valueColumns[0]] ||
                    defaultColors[index % defaultColors.length]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6 my-2 rounded-md mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-[100px] border-1">
      {/* Controls */}
      <div className="mb-4 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center">
        {/* Chart Type Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="chartType"
            className="font-medium text-gray-700 text-sm sm:text-base"
          >
            Chart Type:
          </label>
          <select
            id="chartType"
            value={chartType}
            onChange={handleChartTypeChange}
            className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        {/* Label Column Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label
            htmlFor="labelColumn"
            className="font-medium text-gray-700 text-sm sm:text-base"
          >
            Label:
          </label>
          <select
            id="labelColumn"
            value={labelColumn}
            onChange={handleLabelColumnChange}
            className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base w-full sm:w-auto"
          >
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Value Columns Selector - Custom Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto relative">
          <label className="font-medium text-gray-700 text-sm sm:text-base">
            Values:
          </label>
          <div className="relative w-full sm:w-48 md:w-56 lg:w-64">
            <button
              type="button"
              onClick={() => setShowValueDropdown(!showValueDropdown)}
              className="px-2 py-1 sm:px-3 sm:py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-left flex justify-between items-center text-sm sm:text-base"
            >
              <span className="truncate">
                {valueColumns.length > 0
                  ? `${valueColumns.length} selected`
                  : "Select columns"}
              </span>
              <svg
                className={`h-4 w-4 sm:h-5 sm:w-5 text-gray-400 transition-transform ${
                  showValueDropdown ? "rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {showValueDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
                {numericColumns.length > 0 ? (
                  numericColumns.map((col) => (
                    <div
                      key={col}
                      className="px-3 py-1 sm:px-4 sm:py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm sm:text-base"
                      onClick={() => toggleValueColumn(col)}
                    >
                      <input
                        type="checkbox"
                        checked={valueColumns.includes(col)}
                        readOnly
                        className="mr-2"
                      />
                      <span className="truncate">{col}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm sm:text-base">
                    No numeric columns available
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Selected Value Columns Display */}
        {valueColumns.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <span className="font-medium text-gray-700 text-sm sm:text-base hidden sm:inline">
              Color:
            </span>
            <div className="flex flex-wrap gap-1">
              {valueColumns.map((col) => (
                <div
                  key={col}
                  className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded text-xs sm:text-sm"
                >
                  <span className="truncate max-w-[80px] sm:max-w-none">
                    {col}
                  </span>
                  <input
                    type="color"
                    value={colors[col] || defaultColors[0]}
                    onChange={(e) => handleColorChange(col, e.target.value)}
                    className="w-3 h-3 sm:w-4 sm:h-4 border-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="w-full" style={{ height: "clamp(300px, 60vh, 600px)" }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
