import {
  BOOKING_STATUS,
  MECHANIC_STATUS,
} from "../../constants/booking.constants";

const statusStyles = {
  [BOOKING_STATUS.PENDING]:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  [BOOKING_STATUS.ASSIGNED]:
    "bg-blue-50 text-blue-700 ring-blue-600/20",

  [BOOKING_STATUS.MECHANIC_ON_THE_WAY]:
    "bg-purple-50 text-purple-700 ring-purple-600/20",

  [BOOKING_STATUS.IN_PROGRESS]:
    "bg-indigo-50 text-indigo-700 ring-indigo-600/20",

  [BOOKING_STATUS.COMPLETED]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  [BOOKING_STATUS.CANCELLED]:
    "bg-red-50 text-red-700 ring-red-600/20",

  [MECHANIC_STATUS.AVAILABLE]:
    "bg-emerald-50 text-emerald-700 ring-emerald-600/20",

  [MECHANIC_STATUS.BUSY]:
    "bg-amber-50 text-amber-700 ring-amber-600/20",

  [MECHANIC_STATUS.OFFLINE]:
    "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const StatusBadge = ({ status }) => {
  const style =
    statusStyles[status] ||
    "bg-slate-100 text-slate-600 ring-slate-500/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;