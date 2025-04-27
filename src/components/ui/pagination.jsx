import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";
import { ArrowUp } from "lucide-react";

const Pagination = ({
  table,
  showAll,
  className = "",
  pageSizeOptions = [10, 20, 50],
  showPageSizeOptions = true,
  tableRef,
}) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;

  const scrollToTop = () => {
    if (tableRef?.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage, shouldScroll = true) => {
    if (newPage >= 0 && newPage < pageCount) {
      table.setPageIndex(newPage);
      if (shouldScroll) {
        scrollToTop();
      }
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    table.setPageSize(newSize);
    scrollToTop();
  };

  const getPageRange = () => {
    const totalPages = pageCount;
    const current = currentPage;
    const delta = 1;
    const range = [];

    range.push(1);

    if (current - delta > 2) {
      range.push("...");
    }

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current + delta < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  if (pageCount <= 1 && !showPageSizeOptions) {
    return null;
  }

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 ${className}`}
    >
      {/* Page size selector and row info */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {showPageSizeOptions && (
          <>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select page size"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </>
        )}
        <span>
          {table.getRowModel().rows.length === 0
            ? 0
            : (currentPage - 1) * pageSize + 1}
          -{(currentPage - 1) * pageSize + table.getRowModel().rows.length} of{" "}
          {totalRows}
        </span>
      </div>

      {/* Navigation and scroll up */}
      <div className="flex items-center gap-2">
        {/* Scroll to top button */}
        <Button
          onClick={scrollToTop}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={16} />
        </Button>

        {/* Page navigation */}
        {!showAll && pageCount > 1 && (
          <div className="flex items-center gap-1">
            {/* First */}
            <Button
              onClick={() => handlePageChange(0)}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="First page"
            >
              «
            </Button>

            {/* Previous */}
            <Button
              onClick={() => handlePageChange(currentPage - 2, false)} // 🔥 No scroll on previous
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              ‹
            </Button>

            {/* Page numbers */}
            {getPageRange().map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-sm text-gray-500"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page - 1)}
                  disabled={currentPage === page}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === page
                      ? "bg-blue-500 text-white font-semibold cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              )
            )}

            {/* Next */}
            <Button
              onClick={() => handlePageChange(currentPage)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              ›
            </Button>

            {/* Last */}
            <Button
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Last page"
            >
              »
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

Pagination.propTypes = {
  table: PropTypes.object.isRequired,
  showAll: PropTypes.bool,
  className: PropTypes.string,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showPageSizeOptions: PropTypes.bool,
  tableRef: PropTypes.object,
};

export default Pagination;
