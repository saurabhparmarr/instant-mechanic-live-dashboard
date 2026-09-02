import { useCallback, useEffect } from "react";

import {
  getDashboardStats,
  getBookingStatusDistribution,
  getRevenueTrend,
  getBookingsTrend,
  getServiceDistribution,
} from "../api/services/dashboard.service";

import { useApi } from "./useApi";
import socket from "../socket";

const useDashboard = () => {
  const statsApi = useApi(getDashboardStats);

  const statusApi = useApi(getBookingStatusDistribution);

  const revenueApi = useApi(getRevenueTrend, {
    immediate: false,
  });

  const bookingsTrendApi = useApi(getBookingsTrend, {
    immediate: true,
  });

  const servicesApi = useApi(getServiceDistribution);

  const fetchRevenueTrend = useCallback(
    (days = 30) => {
      return revenueApi.execute(days);
    },
    [revenueApi.execute]
  );

  const fetchBookingsTrend = useCallback(
    (days = 30) => {
      return bookingsTrendApi.execute(days);
    },
    [bookingsTrendApi.execute]
  );

  // =====================================================
  // INITIAL REVENUE DATA
  // =====================================================

  useEffect(() => {
    fetchRevenueTrend(30).catch(() => {});
  }, [fetchRevenueTrend]);

  // =====================================================
  // SOCKET.IO LIVE UPDATE
  // =====================================================

  useEffect(() => {
    // Join operations room when socket connects
    const handleConnect = () => {
      console.log("🔌 Socket connected:", socket.id);

      socket.emit("join:operations");

      console.log("📡 Joined operations room");
    };

    // Booking created / updated / deleted
    const handleBookingUpdated = (data) => {
      console.log("🔄 Booking updated:", data);

      // Refresh dashboard stat cards
      statsApi.refetch().catch(() => {});

      // Refresh booking status
      statusApi.refetch().catch(() => {});

      // Refresh revenue chart
      revenueApi.execute(30).catch(() => {});

      // Refresh bookings over time chart
      bookingsTrendApi.execute(30).catch(() => {});

      // Refresh service distribution
      servicesApi.refetch().catch(() => {});
    };

    // Listen for socket connection
    socket.on("connect", handleConnect);

    // Listen for booking updates
    socket.on(
      "booking:updated",
      handleBookingUpdated
    );

    // Socket may already be connected
    if (socket.connected) {
      console.log(
        "🔌 Socket already connected:",
        socket.id
      );

      socket.emit("join:operations");

      console.log("📡 Joined operations room");
    }

    // Cleanup listeners
    return () => {
      socket.off("connect", handleConnect);

      socket.off(
        "booking:updated",
        handleBookingUpdated
      );
    };
  }, [
    statsApi.refetch,
    statusApi.refetch,
    revenueApi.execute,
    bookingsTrendApi.execute,
    servicesApi.refetch,
  ]);

  return {
    // =====================================================
    // STATS
    // =====================================================

    stats: statsApi.data?.data ?? null,

    statsLoading: statsApi.loading,

    statsError: statsApi.error,

    refetchStats: statsApi.refetch,

    // =====================================================
    // BOOKING STATUS
    // =====================================================

    bookingStatus:
      statusApi.data?.data ?? [],

    bookingStatusLoading:
      statusApi.loading,

    bookingStatusError:
      statusApi.error,

    refetchBookingStatus:
      statusApi.refetch,

    // =====================================================
    // REVENUE TREND
    // =====================================================

    revenueTrend:
      revenueApi.data?.data ?? [],

    revenueTrendLoading:
      revenueApi.loading,

    revenueTrendError:
      revenueApi.error,

    fetchRevenueTrend,

    refetchRevenueTrend: () =>
      fetchRevenueTrend(30),

    // =====================================================
    // BOOKINGS TREND
    // =====================================================

    bookingsTrend:
      bookingsTrendApi.data?.data ?? [],

    bookingsTrendLoading:
      bookingsTrendApi.loading,

    bookingsTrendError:
      bookingsTrendApi.error,

    fetchBookingsTrend,

    refetchBookingsTrend: () =>
      fetchBookingsTrend(30),

    // =====================================================
    // SERVICES
    // =====================================================

    serviceDistribution:
      servicesApi.data?.data ?? [],

    serviceDistributionLoading:
      servicesApi.loading,

    serviceDistributionError:
      servicesApi.error,

    refetchServiceDistribution:
      servicesApi.refetch,

    // =====================================================
    // GLOBAL
    // =====================================================

    loading:
      statsApi.loading ||
      statusApi.loading ||
      revenueApi.loading ||
      bookingsTrendApi.loading ||
      servicesApi.loading,

    hasError:
      statsApi.error ||
      statusApi.error ||
      revenueApi.error ||
      bookingsTrendApi.error ||
      servicesApi.error,
  };
};

export default useDashboard;