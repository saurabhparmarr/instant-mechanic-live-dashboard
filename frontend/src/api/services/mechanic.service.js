
import api from "../axios";

export const getMechanics = async (params = {}) => {
  const response = await api.get("/mechanics", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search || "",
      status: params.status || undefined,

      // Sorting
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
    },
  });

  return response.data;
};

export const getMechanicById = async (id) => {
  const response = await api.get(`/mechanics/${id}`);

  return response.data;
};
