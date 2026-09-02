import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  page = 1,
  totalPages = 0,
  total = 0,
  limit = 20,
  onPageChange,
  disabled = false,
}) => {
  if (!total || totalPages <= 1) {
    return null;
  }

  const currentPage = Math.min(
    Math.max(page, 1),
    totalPages
  );

  const start =
    (currentPage - 1) * limit + 1;

  const end = Math.min(
    currentPage * limit,
    total
  );

  const goToPage = (nextPage) => {
    if (
      disabled ||
      !onPageChange ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === currentPage
    ) {
      return;
    }

    onPageChange(nextPage);
  };

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {start}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-700">
          {end}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">
          {total}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            goToPage(currentPage - 1)
          }
          disabled={
            disabled || currentPage <= 1
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="px-3 text-xs font-medium text-slate-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            goToPage(currentPage + 1)
          }
          disabled={
            disabled ||
            currentPage >= totalPages
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;