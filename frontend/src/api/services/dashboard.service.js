import api from "../axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getBookingStatusDistribution = async () => {
  const response = await api.get("/dashboard/booking-status");
  return response.data;
};

export const getRevenueTrend = async (days = 30) => {
  const response = await api.get("/dashboard/revenue-trend", {
    params: { days },
  });

  return response.data;
};

export const getServiceDistribution = async () => {
  const response = await api.get("/dashboard/services");
  return response.data;
};
export const getBookingsTrend = async (days = 30) => {
  const response = await api.get("/dashboard/bookings-trend", {
    params: { days },
  });

  return response.data;
};