import { Inbox } from "lucide-react";

const EmptyState = ({
  title = "No data found",
  message = "There is nothing to display here.",
}) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center p-6 text-center">
      <Inbox className="mb-3 h-8 w-8 text-slate-300" />

      <h3 className="text-sm font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;