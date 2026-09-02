import api from "../axios";

export const getCustomers = async (params = {}) => {
  const response = await api.get("/customers", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search || "",
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "desc",
    },
  });

  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}`);

  return response.data;
};