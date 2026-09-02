import api from "../axios";

export const getBookings = async (params = {}) => {
  const response = await api.get("/bookings", {
    params: {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search || "",
      status: params.status || undefined,
      sortBy: params.sortBy || "scheduledAt",
      sortOrder: params.sortOrder || "desc",
      from: params.from || undefined,
      to: params.to || undefined,
    },
  });

  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};