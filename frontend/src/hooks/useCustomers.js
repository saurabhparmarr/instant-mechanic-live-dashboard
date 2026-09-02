
import { useCallback, useEffect, useState } from "react";

import { useApi } from "./useApi";
import {
  getCustomers,
  getCustomerById,
} from "../api/services/customer.service";

const DEFAULT_FILTERS = {
  page: 1,
  limit: 20,
  search: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

const useCustomers = () => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const {
    data: response,
    loading,
    error,
    execute,
    setError,
  } = useApi(getCustomers, {
    immediate: false,
    initialData: null,
  });

  const fetchCustomers = useCallback(
    async (currentFilters = filters) => {
      return execute(currentFilters);
    },
    [execute, filters]
  );

  useEffect(() => {
    fetchCustomers(filters).catch(() => {});
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateFilters = useCallback((updates) => {
    setFilters((previous) => ({
      ...previous,
      ...updates,
      page: 1,
    }));
  }, []);

  const setPage = useCallback((page) => {
    setFilters((previous) => ({
      ...previous,
      page: Math.max(Number(page) || 1, 1),
    }));
  }, []);

  const setSorting = useCallback((sortBy, sortOrder = "desc") => {
    setFilters((previous) => ({
      ...previous,
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

  const fetchCustomerById = useCallback(async (id) => {
    if (!id) {
      throw new Error("Customer ID is required");
    }

    return getCustomerById(id);
  }, []);

  const customers = response?.data?.customers ?? [];

  const pagination =
    response?.data?.pagination ?? DEFAULT_PAGINATION;

  return {
    customers,
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

    fetchCustomers,
    fetchCustomerById,
    refetch,
  };
};

export default useCustomers;

