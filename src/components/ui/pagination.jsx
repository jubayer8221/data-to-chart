import React from "react";
import PropTypes from "prop-types";
import { Button } from "./Button";

const Pagination = ({
  table,
  showAll,
  className = "",
  pageSizeOptions = [10, 20, 50, 100],
  showPageSizeOptions = true,
}) => {
  const pageCount = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;

  if (pageCount <= 1 && !showPageSizeOptions) {
    return null;
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      table.setPageIndex(newPage);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    table.setPageSize(newSize);
  };

  const getPageRange = () => {
    const totalPages = pageCount;
    const current = currentPage;
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(totalPages - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift("...");
    }

    if (current + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div
      className={`flex flex-wrap items-center gap-2 sm:gap-3 mt-4 justify-center ${className}`}
    >
      <Button
        onClick={() => handlePageChange(0)}
        disabled={!table.getCanPreviousPage()}
        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
        aria-label="First page"
      >
        «
      </Button>
      <Button
        onClick={() => handlePageChange(currentPage - 2)}
        disabled={!table.getCanPreviousPage()}
        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
        aria-label="Previous page"
      >
        ‹
      </Button>

      {getPageRange().map((page, index) =>
        page === "..." ? (
          <span key={`ellipsis-${index}`} className="text-xs sm:text-sm px-1">
            ...
          </span>
        ) : (
          <Button
            key={page}
            onClick={() => handlePageChange(page - 1)}
            className={`text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 ${
              currentPage === page ? "font-bold bg-blue-100" : ""
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Button>
        )
      )}

      <Button
        onClick={() => handlePageChange(currentPage)}
        disabled={!table.getCanNextPage()}
        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
        aria-label="Next page"
      >
        ›
      </Button>
      <Button
        onClick={() => handlePageChange(pageCount - 1)}
        disabled={!table.getCanNextPage()}
        className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5"
        aria-label="Last page"
      >
        »
      </Button>

      {showPageSizeOptions && (
        <div className="flex items-center gap-2 ml-2">
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border rounded px-2 py-1 text-xs sm:text-sm"
            aria-label="Select page size"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  table: PropTypes.object.isRequired,
  showAll: PropTypes.bool,
  className: PropTypes.string,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  showPageSizeOptions: PropTypes.bool,
};

export default Pagination;
