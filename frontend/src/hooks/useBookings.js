
import { useCallback, useEffect, useMemo, useState } from "react";

import { useApi } from "./useApi";
import {
  getBookings,
  getBookingById,
} from "../api/services/booking.service";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
  search: "",
  status: "",
  sortBy: "scheduledAt",
  sortOrder: "desc",
  from: "",
  to: "",
};

const DEFAULT_DATA = {
  bookings: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

const useBookings = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const {
    data: response,
    loading,
    error,
    execute,
    setError,
  } = useApi(getBookings, {
    immediate: false,
    initialData: null,
  });

  const fetchBookings = useCallback(
    async (currentFilters = filters) => {
      return execute(currentFilters);
    },
    [execute, filters]
  );

  useEffect(() => {
    fetchBookings(filters).catch(() => {});
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilters = useCallback((updates) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(Number(page) || 1, 1),
    }));
  }, []);

  const setSorting = useCallback((sortBy, sortOrder = "desc") => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const refetch = useCallback(() => {
    return execute(filters);
  }, [execute, filters]);

  const fetchBookingById = useCallback(async (id) => {
    if (!id) {
      throw new Error("Booking ID is required");
    }

    return getBookingById(id);
  }, []);

  const data = response?.data ?? DEFAULT_DATA;

  const bookings = useMemo(
    () => data.bookings ?? [],
    [data.bookings]
  );

  const pagination = useMemo(
    () => data.pagination ?? DEFAULT_DATA.pagination,
    [data.pagination]
  );

  return {
    bookings,
    pagination,

    filters,
    setFilters,
    updateFilters,

    setPage,
    setSorting,
    resetFilters,

    loading,
    error,
    setError,

    fetchBookings,
    fetchBookingById,
    refetch,
  };
};

export default useBookings;

