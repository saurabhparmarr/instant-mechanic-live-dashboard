
import { useEffect, useState } from "react";
import {
  Search,
  Wrench,
  Phone,
  Mail,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import {
  Card,
  StatusBadge,
  Spinner,
  ErrorState,
  EmptyState,
} from "../components/ui";

import Pagination from "../components/ui/Pagination";

import { getMechanics } from "../api/services/mechanic.service";

const MECHANIC_STATUSES = [
  "Available",
  "Busy",
  "Offline",
];

const SORT_OPTIONS = [
  {
    value: "createdAt-desc",
    label: "Date: Newest",
  },
  {
    value: "createdAt-asc",
    label: "Date: Oldest",
  },
  {
    value: "name-asc",
    label: "Name: A-Z",
  },
  {
    value: "name-desc",
    label: "Name: Z-A",
  },
  {
    value: "status-asc",
    label: "Status: A-Z",
  },
  {
    value: "status-desc",
    label: "Status: Z-A",
  },
  {
    value: "jobsCompleted-desc",
    label: "Jobs Completed: High to Low",
  },
  {
    value: "jobsCompleted-asc",
    label: "Jobs Completed: Low to High",
  },
];

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20;

  // =====================================================
  // FETCH MECHANICS
  // =====================================================

  const fetchMechanics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getMechanics({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });

      const data = response?.data;

      setMechanics(data?.mechanics || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load mechanics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMechanics();
  }, [
    page,
    status,
    search,
    sortBy,
    sortOrder,
  ]);

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // =====================================================
  // STATUS FILTER
  // =====================================================

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  // =====================================================
  // SORT
  // =====================================================

  const handleSortChange = (event) => {
    const [field, order] =
      event.target.value.split("-");

    setSortBy(field);
    setSortOrder(order);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Mechanics
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor mechanics and their current workload
        </p>
      </div>

      {/* Main Card */}
      <Card>
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search mechanic..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={handleStatusChange}
              className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">
                All Statuses
              </option>

              {MECHANIC_STATUSES.map(
                (mechanicStatus) => (
                  <option
                    key={mechanicStatus}
                    value={mechanicStatus}
                  >
                    {mechanicStatus}
                  </option>
                )
              )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Sorting */}
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={handleSortChange}
              className="h-10 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            >
              {SORT_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="p-5">
            <ErrorState
              message={error}
              onRetry={fetchMechanics}
            />
          </div>
        ) : loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : mechanics.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No mechanics found"
              message={
                search || status
                  ? "Try changing your search or filters."
                  : "There are no mechanics available."
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Mechanic
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Specialization
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Jobs Completed
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Current Booking
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Last Booking
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {mechanics.map((mechanic) => (
                    <tr
                      key={mechanic._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Mechanic */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                            <Wrench className="h-4 w-4 text-slate-600" />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {mechanic.name || "-"}
                            </p>

                            <div className="mt-1 flex flex-col gap-0.5">
                              {mechanic.phone && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Phone className="h-3 w-3" />
                                  {mechanic.phone}
                                </span>
                              )}

                              {mechanic.email && (
                                <span className="flex items-center gap-1 text-xs text-slate-500">
                                  <Mail className="h-3 w-3" />
                                  {mechanic.email}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {mechanic.specialization || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={mechanic.status}
                        />
                      </td>

                      {/* Jobs Completed */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {mechanic.jobsCompleted ?? 0}
                        </span>
                      </td>

                      {/* Current Booking */}
                      <td className="px-5 py-4">
                        {mechanic.currentBooking ? (
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                mechanic.currentBooking
                                  .bookingId
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                mechanic.currentBooking
                                  .service?.category
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                mechanic.currentBooking
                                  .vehicle
                                  ?.registrationNumber
                              }
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No active booking
                          </span>
                        )}
                      </td>

                      {/* Last Booking */}
                      <td className="px-5 py-4">
                        {mechanic.lastBooking ? (
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {
                                mechanic.lastBooking
                                  .bookingId
                              }
                            </p>

                            <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <CalendarDays className="h-3 w-3" />

                              {formatDate(
                                mechanic.lastBooking
                                  .scheduledAt
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No previous booking
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {mechanics.map((mechanic) => (
                <div
                  key={mechanic._id}
                  className="space-y-4 p-5"
                >
                  {/* Mechanic Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Wrench className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {mechanic.name || "-"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {mechanic.specialization || "-"}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      status={mechanic.status}
                    />
                  </div>

                  {/* Contact */}
                  <div className="space-y-1">
                    {mechanic.phone && (
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                        {mechanic.phone}
                      </p>
                    )}

                    {mechanic.email && (
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail className="h-3.5 w-3.5" />
                        {mechanic.email}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Jobs Completed
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        {mechanic.jobsCompleted ?? 0}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Current Booking
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {mechanic.currentBooking
                          ?.bookingId || "None"}
                      </p>
                    </div>
                  </div>

                  {/* Last Booking */}
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Last Booking
                    </p>

                    {mechanic.lastBooking ? (
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">
                          {
                            mechanic.lastBooking
                              .bookingId
                          }
                        </span>

                        <span className="text-xs text-slate-400">
                          •
                        </span>

                        <span className="text-xs text-slate-500">
                          {formatDate(
                            mechanic.lastBooking
                              .scheduledAt
                          )}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-slate-400">
                        No previous booking
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
                limit={pagination.limit}
                disabled={loading}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Mechanics;
