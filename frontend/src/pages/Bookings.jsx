
import { useEffect, useState } from "react";
import {
  Search,
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

import { getBookings } from "../api/services/booking.service";

const BOOKING_STATUSES = [
  "Pending",
  "Assigned",
  "Mechanic On The Way",
  "In Progress",
  "Completed",
  "Cancelled",
];

const SORT_OPTIONS = [
  { value: "scheduledAt-desc", label: "Date: Newest" },
  { value: "scheduledAt-asc", label: "Date: Oldest" },
  { value: "amount-desc", label: "Amount: High to Low" },
  { value: "amount-asc", label: "Amount: Low to High" },
  { value: "status-asc", label: "Status: A-Z" },
  { value: "status-desc", label: "Status: Z-A" },
];

const formatDateTime = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // Sorting
  const [sortBy, setSortBy] = useState("scheduledAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const limit = 20;

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getBookings({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });

      // booking.service.js already returns response.data
      const data = response?.data;

      setBookings(data?.bookings || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, status, search, sortBy, sortOrder]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleSortChange = (event) => {
    const [newSortBy, newSortOrder] =
      event.target.value.split("-");

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const currentSort = `${sortBy}-${sortOrder}`;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bookings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor all service bookings
        </p>
      </div>

      {/* Main Card */}
      <Card>
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Filters */}
          <div className="flex w-full flex-col gap-3 sm:flex-row">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search booking, customer, vehicle..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={status}
                onChange={handleStatusChange}
                className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-auto"
              >
                <option value="">All Statuses</option>

                {BOOKING_STATUSES.map((bookingStatus) => (
                  <option
                    key={bookingStatus}
                    value={bookingStatus}
                  >
                    {bookingStatus}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Sorting */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={handleSortChange}
              className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 text-sm text-slate-600 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100 sm:w-52"
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

        {/* Error State */}
        {error ? (
          <div className="p-5">
            <ErrorState
              message={error}
              onRetry={fetchBookings}
            />
          </div>
        ) : loading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No bookings found"
              message={
                search || status
                  ? "Try changing your search or filters."
                  : "There are no bookings available."
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
                      Booking ID
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date / Time
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Vehicle
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Mechanic
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Service
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* Booking ID */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {booking.bookingId ||
                            booking._id ||
                            "-"}
                        </span>
                      </td>

                      {/* Date / Time */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <span className="text-sm text-slate-600">
                            {formatDateTime(
                              booking.scheduledAt
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {booking.customer?.name || "-"}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {booking.customer?.phone ||
                            booking.customer?.email ||
                            ""}
                        </p>
                      </td>

                      {/* Vehicle */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {[
                            booking.vehicle?.make,
                            booking.vehicle?.model,
                          ]
                            .filter(Boolean)
                            .join(" ") || "-"}
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-slate-500">
                          {booking.vehicle
                            ?.registrationNumber || ""}
                        </p>
                      </td>

                      {/* Mechanic */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {booking.mechanic?.name ||
                            "Unassigned"}
                        </span>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {booking.service?.category || "-"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="text-sm font-semibold text-slate-900">
                          {formatCurrency(booking.amount)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="divide-y divide-slate-100 md:hidden">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="space-y-4 p-5"
                >
                  {/* ID + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {booking.bookingId ||
                          booking._id ||
                          "-"}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />

                        {formatDateTime(
                          booking.scheduledAt
                        )}
                      </div>
                    </div>

                    <StatusBadge status={booking.status} />
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Customer
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {booking.customer?.name || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Mechanic
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {booking.mechanic?.name ||
                          "Unassigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Vehicle
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {[
                          booking.vehicle?.make,
                          booking.vehicle?.model,
                        ]
                          .filter(Boolean)
                          .join(" ") || "-"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {booking.vehicle
                          ?.registrationNumber || ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Service
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {booking.service?.category || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                        Amount
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatCurrency(booking.amount)}
                      </p>
                    </div>
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

export default Bookings;
