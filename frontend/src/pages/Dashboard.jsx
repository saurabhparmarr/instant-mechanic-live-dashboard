import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  IndianRupee,
  Users,
  Wrench,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import useDashboard from "../hooks/useDashboard";

import {
  Card,
  EmptyState,
  ErrorState,
  Spinner,
} from "../components/ui";

const Dashboard = () => {
  const {
    stats,
    statsLoading,
    statsError,

    bookingStatus,
    bookingStatusLoading,
    bookingStatusError,
    refetchBookingStatus,

    revenueTrend,
    revenueTrendLoading,
    revenueTrendError,
    fetchRevenueTrend,

    bookingsTrend,
    bookingsTrendLoading,
    bookingsTrendError,
    fetchBookingsTrend,

    serviceDistribution,
    serviceDistributionLoading,
    serviceDistributionError,
    refetchServiceDistribution,

    refetchStats,
  } = useDashboard();

  // =====================================================
  // FORMATTERS
  // =====================================================

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (value) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  // =====================================================
  // DASHBOARD STATS CARDS
  // =====================================================

  const statsCards = [
    {
      title: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      icon: CalendarCheck,
    },
    {
      title: "Today's Bookings",
      value: stats?.todayBookings ?? 0,
      icon: CalendarCheck,
    },
    {
      title: "Completed Bookings",
      value: stats?.completedBookings ?? 0,
      icon: CheckCircle2,
    },
    {
      title: "Pending Bookings",
      value: stats?.pendingBookings ?? 0,
      icon: CalendarCheck,
    },
    {
      title: "Cancelled Bookings",
      value: stats?.cancelledBookings ?? 0,
      icon: Activity,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: IndianRupee,
    },
    {
      title: "Active Mechanics",
      value: stats?.availableMechanics ?? 0,
      icon: Wrench,
    },
    {
      title: "New Customers",
      value: stats?.newCustomers ?? 0,
      icon: Users,
    },
  ];

  // =====================================================
  // CHART DATA
  // =====================================================

  const statusData = Array.isArray(bookingStatus)
    ? bookingStatus
    : [];

  const serviceData = Array.isArray(serviceDistribution)
    ? serviceDistribution
    : [];

  const revenueData = Array.isArray(revenueTrend)
    ? revenueTrend
    : [];

  const bookingsData = Array.isArray(bookingsTrend)
    ? bookingsTrend
    : [];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Live operations overview
        </p>
      </div>

      {/* =====================================================
          STATS
      ===================================================== */}

      {statsError ? (
        <ErrorState
          message="Unable to load dashboard statistics."
          onRetry={() => refetchStats().catch(() => {})}
        />
      ) : statsLoading ? (
        <div className="flex min-h-32 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map(
            ({ title, value, icon: Icon }) => (
              <Card key={title}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {value}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                </div>
              </Card>
            )
          )}
        </div>
      )}

      {/* =====================================================
          BOOKINGS OVER TIME
      ===================================================== */}

      <Card
        title="Bookings Over Time"
        description="Daily booking volume"
        action={
          <div className="flex gap-1">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() =>
                  fetchBookingsTrend(days).catch(() => {})
                }
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {days}D
              </button>
            ))}
          </div>
        }
      >
        {bookingsTrendError ? (
          <ErrorState
            message="Unable to load bookings trend."
            onRetry={() =>
              fetchBookingsTrend(30).catch(() => {})
            }
          />
        ) : bookingsTrendLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : bookingsData.length === 0 ? (
          <EmptyState
            title="No booking trend data"
            message="Booking volume data is not available."
          />
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                />

                <YAxis />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Bookings",
                  ]}
                  labelFormatter={formatDate}
                />

                <Area
                  type="monotone"
                  dataKey="bookings"
                  strokeWidth={2}
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* =====================================================
          BOOKING STATUS + SERVICE DISTRIBUTION
      ===================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* =====================================================
            BOOKING STATUS
        ===================================================== */}

        <Card
          title="Booking Status"
          description="Current distribution of bookings"
        >
          {bookingStatusError ? (
            <ErrorState
              message="Unable to load booking status."
              onRetry={() =>
                refetchBookingStatus().catch(() => {})
              }
            />
          ) : bookingStatusLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : statusData.length === 0 ? (
            <EmptyState
              title="No booking data"
              message="Booking status data is not available."
            />
          ) : (
            <div className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`status-${index}`}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* =====================================================
            SERVICE DISTRIBUTION
        ===================================================== */}

        <Card
          title="Service Distribution"
          description="Bookings by service category"
        >
          {serviceDistributionError ? (
            <ErrorState
              message="Unable to load service distribution."
              onRetry={() =>
                refetchServiceDistribution().catch(() => {})
              }
            />
          ) : serviceDistributionLoading ? (
            <div className="flex min-h-72 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : serviceData.length === 0 ? (
            <EmptyState
              title="No service data"
              message="Service distribution data is not available."
            />
          ) : (
            <div className="h-72">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={serviceData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="service"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      value,
                      "Bookings",
                    ]}
                  />

                  <Bar
                    dataKey="bookings"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* =====================================================
          REVENUE TREND
      ===================================================== */}

      <Card
        title="Revenue Trend"
        description="Completed booking revenue"
        action={
          <div className="flex gap-1">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() =>
                  fetchRevenueTrend(days).catch(() => {})
                }
                className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
              >
                {days}D
              </button>
            ))}
          </div>
        }
      >
        {revenueTrendError ? (
          <ErrorState
            message="Unable to load revenue trend."
            onRetry={() =>
              fetchRevenueTrend(30).catch(() => {})
            }
          />
        ) : revenueTrendLoading ? (
          <div className="flex min-h-80 items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : revenueData.length === 0 ? (
          <EmptyState
            title="No revenue data"
            message="Revenue trend data is not available."
          />
        ) : (
          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  labelFormatter={formatDate}
                />

                <Bar
                  dataKey="revenue"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* =====================================================
          SYSTEM STATUS
      ===================================================== */}

      <Card>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <Activity className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              System Operational
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Dashboard services are connected and running.
            </p>
          </div>

          <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;