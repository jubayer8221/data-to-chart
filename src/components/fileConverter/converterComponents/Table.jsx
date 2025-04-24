"use client";
import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { requestExport, resetExport } from "@/redux/slices/exportSlice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Table({ data }) {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.data);
  const { exportFormat, exportRequested } = useAppSelector(
    (state) => state.export
  );
  const [showAll, setShowAll] = useState(false);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [sorting, setSorting] = useState([]);
  const tableRef = useRef(null);

  // Log incoming data for debugging
  console.log("Incoming data:", data);

  // Normalize data to ensure correct format
  const normalizedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn("Data is empty or not an array:", data);
      return [];
    }

    // Verify data is an array of objects
    const isObjectArray = data.every(
      (item) => typeof item === "object" && !Array.isArray(item)
    );
    if (!isObjectArray) {
      console.error(
        "Data is not in the correct format (array of objects):",
        data
      );
      return [];
    }

    return data;
  }, [data]);

  // Initialize table
  const table = useReactTable({
    data: normalizedData,
    columns: useMemo(() => {
      if (!normalizedData || normalizedData.length === 0) return [];

      return [
        {
          header: "#",
          accessorKey: "rowNumber",
          cell: ({ row }) => row.index + 1,
          enableSorting: false,
        },
        ...Object.keys(normalizedData[0]).map((key) => ({
          header: key,
          accessorKey: key,
          enableSorting: true,
          cell: ({ getValue }) => {
            const value = getValue();
            if (value === null || value === undefined) return "N/A";
            // Avoid over-stringifying; directly render numbers and strings
            return value;
          },
        })),
      ];
    }, [normalizedData]),
    state: {
      globalFilter: searchTerm,
      pagination: {
        pageSize: showAll ? normalizedData.length : 10,
        pageIndex: 0,
      },
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => dispatch(setSearchTerm(value)),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExport = (format) => {
    console.log("Dispatching requestExport with format:", format);
    dispatch(requestExport(format));
    setShowExportDropdown(false);
  };

  useEffect(() => {
    console.log("Export state:", { exportRequested, exportFormat });
    if (exportRequested && tableRef.current) {
      const exportTable = async () => {
        try {
          // Clone table for export
          const clone = tableRef.current.cloneNode(true);
          clone.classList.remove("table-fixed");
          clone.querySelectorAll("td").forEach((td) => {
            td.classList.remove("max-w-xs");
            td.style.width = "auto";
            td.style.whiteSpace = "normal";
          });
          clone.style.position = "absolute";
          clone.style.left = "-9999px";
          clone.style.width = "auto";
          document.body.appendChild(clone);

          // Show all rows for export
          const originalPageSize = table.getState().pagination.pageSize;
          table.setPageSize(normalizedData.length);
          console.log("Page size set to:", normalizedData.length);
          await new Promise((resolve) => setTimeout(resolve, 100));

          const canvas = await html2canvas(clone, {
            scale: 1,
            useCORS: true,
            backgroundColor: "#ffffff",
            logging: true,
          });

          if (exportFormat === "pdf") {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width, canvas.height],
            });
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
            pdf.save(
              `table-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`
            );
          } else if (exportFormat === "image") {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `table-${new Date()
              .toISOString()
              .replace(/[:.]/g, "-")}.png`;
            link.click();
          }

          // Clean up
          document.body.removeChild(clone);
          table.setPageSize(originalPageSize);
          dispatch(resetExport());
        } catch (error) {
          console.error("Export failed:", error);
          dispatch(resetExport());
        }
      };

      exportTable();
    }
  }, [exportRequested, exportFormat, dispatch, normalizedData]);

  if (!normalizedData || normalizedData.length === 0) return null;

  return (
    <div className="px-[100px]">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex gap-2 sm:gap-4 items-center">
          <Button onClick={() => setShowColumnDropdown((prev) => !prev)}>
            Toggle Columns
          </Button>
          <div className="text-sm font-medium text-gray-700">
            Showing {table.getFilteredRowModel().rows.length} rows
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2">
          <Input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="flex-1"
          />
          <Button
            className="w-[90px]"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Paginate" : "Show All"}
          </Button>

          {/* Export Dropdown */}
          <div className="relative inline-block text-left">
            <Button onClick={() => setShowExportDropdown((prev) => !prev)}>
              Export
            </Button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  <button
                    onClick={() => handleExport("pdf")}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport("image")}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100"
                  >
                    Export as Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Column Toggle Dropdown */}
      <div className="relative inline-block text-left">
        {showColumnDropdown && (
          <div className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1 max-h-60 overflow-y-auto">
              {table.getAllLeafColumns().map((column) => {
                if (column.id === "rowNumber") return null;
                return (
                  <label
                    key={column.id}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="mr-2"
                    />
                    {column.columnDef.header}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border w-full max-w-full">
        <table
          ref={tableRef}
          className="table-fixed w-full text-sm sm:text-base"
        >
          <thead className="bg-[#0A3A66]/90 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="hover:bg-[#0A3A66]/60">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-2 sm:px-4 py-2 text-left font-medium cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted === "asc" && <ArrowUp size={14} />}
                        {isSorted === "desc" && <ArrowDown size={14} />}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <motion.tr
                key={row.id}
                whileTap={{ scale: 0.97 }}
                className="hover:bg-muted"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 sm:px-4 py-2 whitespace-pre-wrap break-words max-w-xs"
                    title={String(cell.getValue())}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!showAll && (
        <div className="flex items-center space-x-2 mt-4 justify-center">
          <Button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </Button>
          <span className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </Button>
        </div>
      )}
    </div>
  );
}
