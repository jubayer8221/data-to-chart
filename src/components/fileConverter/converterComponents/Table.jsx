// src/components/fileConverter/converterComponents/Table.js
"use client";
import React, { useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setSearchTerm } from "@/redux/slices/convertDataSlice";

export default function Table({ data }) {
  const dispatch = useAppDispatch();
  const { searchTerm } = useAppSelector((state) => state.data);

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]).map((key) => ({
      header: key,
      accessorKey: key,
      cell: ({ getValue }) => {
        const value = getValue();
        return typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
      },
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: searchTerm,
    },
    onGlobalFilterChange: (value) => dispatch(setSearchTerm(value)),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          type="text"
          placeholder="Search data..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="flex-1"
        />
        <div>
          <Button>Print</Button>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-2 text-left font-medium text-gray-700"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center space-x-2">
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
      </div>
    </div>
  );
}
