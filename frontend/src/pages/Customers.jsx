import { Search, RefreshCw } from "lucide-react";
import { useState } from "react";

import useCustomers from "../hooks/useCustomers";

import {
  Button,
  Card,
  EmptyState,
  ErrorState,
  Spinner,
} from "../components/ui";

import Pagination from "../components/ui/Pagination";

const Customers = () => {
  const [search, setSearch] = useState("");

  const {
    customers,
    pagination,
    loading,
    error,
    updateFilters,
    setPage,
    refetch,
  } = useCustomers();

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearch(value);

    updateFilters({
      search: value,
    });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and view customer information
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetch().catch(() => {})}
          loading={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="search"
            value={search}
            onChange={handleSearch}
            placeholder="Search customer by name, phone or email..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card
        title="Customers"
        description={`${pagination?.total || 0} total customers`}
      >
        {error ? (
          <ErrorState
            message={
              error.userMessage ||
              "Unable to load customers."
            }
            onRetry={() => refetch().catch(() => {})}
          />
        ) : loading && customers.length === 0 ? (
          <div className="flex min-h-72 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : customers.length === 0 ? (
          <EmptyState
            title="No customers found"
            message="Try changing your search."
          />
        ) : (
          <>
            <div className="-mx-5 overflow-x-auto">
              <table className="min-w-[650px] w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </th>

                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                            {customer.name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <p className="text-sm font-semibold text-slate-900">
                            {customer.name || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {customer.email || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {customer.createdAt
                          ? new Date(
                              customer.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={pagination?.page || 1}
              totalPages={pagination?.totalPages || 0}
              total={pagination?.total || 0}
              limit={pagination?.limit || 20}
              onPageChange={handlePageChange}
              disabled={loading}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default Customers;