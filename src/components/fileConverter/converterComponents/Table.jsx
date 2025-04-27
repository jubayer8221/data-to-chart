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
import { requestExport, resetExport } from "@/redux/slices/exportSlice";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Pagination from "@/components/ui/pagination";

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
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const tableRef = useRef(null);

  // Normalize data
  const normalizedData = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
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
            return value;
          },
        })),
      ];
    }, [normalizedData]),
    state: {
      globalFilter: searchTerm,
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: showAll ? normalizedData.length : pagination.pageSize,
      },
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => dispatch(setSearchTerm(value)),
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleExport = async (format) => {
    try {
      const tableElement = tableRef.current;
      if (!tableElement) {
        throw new Error("Table element not found");
      }

      // Create a clone of the table for export
      const clone = tableElement.cloneNode(true);

      // Apply export-specific styles
      clone.style.width = "auto";
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.visibility = "visible";
      clone.style.backgroundColor = "#ffffff";

      clone.querySelectorAll("td, th").forEach((cell) => {
        cell.style.width = "auto";
        cell.style.whiteSpace = "normal";
        cell.style.maxWidth = "none";
        cell.style.padding = "4px";
        cell.style.border = "1px solid #e5e7eb";
      });

      document.body.appendChild(clone);

      // Temporarily show all rows for export
      const originalPageSize = table.getState().pagination.pageSize;
      table.setPageSize(normalizedData.length);

      // Wait for DOM to update
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Generate the canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
        windowWidth: clone.scrollWidth,
        windowHeight: clone.scrollHeight,
      });

      // Remove the clone
      document.body.removeChild(clone);

      // Reset to original page size
      table.setPageSize(originalPageSize);

      // Generate the export file
      if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
        });

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`table-export-${new Date().toISOString().slice(0, 10)}.pdf`);
      } else if (format === "image") {
        const link = document.createElement("a");
        link.download = `table-export-${new Date()
          .toISOString()
          .slice(0, 10)}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      dispatch(resetExport());
    }
  };

  // Handle export when triggered by Redux
  useEffect(() => {
    if (exportRequested && exportFormat) {
      handleExport(exportFormat);
    }
  }, [exportRequested, exportFormat]);

  if (!normalizedData || normalizedData.length === 0) return null;

  return (
    <div className="px-4 sm:px-8 lg:px-[100px] py-4">
      {/* Top Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Button
            onClick={() => setShowColumnDropdown((prev) => !prev)}
            className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
          >
            Toggle Columns
          </Button>
          <div className="text-xs sm:text-sm font-medium text-gray-700">
            Showing {table.getFilteredRowModel().rows.length} rows
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <Input
            type="text"
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="flex-1 text-xs sm:text-sm py-1 sm:py-2"
          />
          <Button
            className="w-[80px] sm:w-[90px] text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
            onClick={() => setShowAll((prev) => !prev)}
          >
            {showAll ? "Paginate" : "Show All"}
          </Button>

          {/* Export Dropdown */}
          <div className="relative inline-block text-left">
            <Button
              onClick={() => setShowExportDropdown((prev) => !prev)}
              className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
            >
              Export
            </Button>
            {showExportDropdown && (
              <div className="absolute right-0 mt-2 w-36 sm:w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      dispatch(requestExport("pdf"));
                      setShowExportDropdown(false);
                    }}
                    className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm w-full text-left hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      dispatch(requestExport("image"));
                      setShowExportDropdown(false);
                    }}
                    className="block px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm w-full text-left hover:bg-gray-100"
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
      <div className="relative inline-block text-left mt-2">
        {showColumnDropdown && (
          <div className="absolute z-10 mt-2 w-48 sm:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-y-auto">
            <div className="py-1">
              {table.getAllLeafColumns().map((column) => {
                if (column.id === "rowNumber") return null;
                return (
                  <label
                    key={column.id}
                    className="flex items-center px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="mr-2 w-3.5 h-3.5 sm:w-4 sm:h-4"
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
      <div className="overflow-x-auto rounded-lg border mt-4">
        <table
          ref={tableRef}
          className="w-full text-xs sm:text-sm min-w-[600px]"
        >
          <thead className="bg-[#0A3A66]/90 text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="hover:bg-[#0A3A66]/60">
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className="px-2 sm:px-3 py-1.5 sm:py-2 text-left font-medium cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSorted === "asc" && <ArrowUp size={12} />}
                        {isSorted === "desc" && <ArrowDown size={12} />}
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
                className="hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-2 sm:px-3 py-1.5 sm:py-2 whitespace-pre-wrap break-words"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination table={table} showAll={showAll} />
      {/* Pagination */}
      {/* {!showAll && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 justify-center">
          <Button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
          >
            «
          </Button>
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
          >
            ‹
          </Button>
          <span className="text-xs sm:text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
          >
            ›
          </Button>
          <Button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
          >
            »
          </Button>
        </div>
      )} */}
    </div>
  );
}
