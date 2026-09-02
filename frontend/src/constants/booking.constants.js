export const BOOKING_STATUS = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  MECHANIC_ON_THE_WAY: "Mechanic On The Way",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export const BOOKING_STATUSES = Object.values(BOOKING_STATUS);

export const ACTIVE_BOOKING_STATUSES = [
  BOOKING_STATUS.ASSIGNED,
  BOOKING_STATUS.MECHANIC_ON_THE_WAY,
  BOOKING_STATUS.IN_PROGRESS,
];

export const SERVICE_CATEGORY = {
  PERIODIC_SERVICE: "Periodic Service",
  OIL_CHANGE: "Oil Change",
  BRAKE_SERVICE: "Brake Service",
  AC_SERVICE: "AC Service",
  BATTERY: "Battery",
  TYRE_SERVICE: "Tyre Service",
  CAR_WASH: "Car Wash",
  ENGINE_REPAIR: "Engine Repair",
};

export const SERVICE_CATEGORIES = Object.values(SERVICE_CATEGORY);

export const MECHANIC_STATUS = {
  AVAILABLE: "Available",
  BUSY: "Busy",
  OFFLINE: "Offline",
};

export const MECHANIC_STATUSES = Object.values(MECHANIC_STATUS);

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export const DEFAULT_SORT_BY = "scheduledAt";
export const DEFAULT_SORT_ORDER = "desc";