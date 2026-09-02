import { useCallback } from "react";

import { useApi } from "./useApi";

import {
  getMechanics,
  getMechanicById,
} from "../api/services/mechanic.service";

const useMechanics = (options = {}) => {
  const {
    immediate = true,
    initialData = null,
  } = options;

  const {
    data,
    loading,
    error,
    execute,
    refetch,
    setData,
    setError,
  } = useApi(getMechanics, {
    immediate,
    initialData,
  });

  const fetchMechanics = useCallback(
    (params = {}) => execute(params),
    [execute]
  );

  const fetchMechanicById = useCallback(
    (id) => getMechanicById(id),
    []
  );

  return {
    data,
    loading,
    error,

    mechanics:
      data?.data?.mechanics ||
      data?.data ||
      [],

    pagination:
      data?.data?.pagination ||
      null,

    fetchMechanics,
    fetchMechanicById,

    refetch,
    setData,
    setError,
  };
};

export default useMechanics;