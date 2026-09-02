import { AlertCircle, RefreshCw } from "lucide-react";
import Button from "./Button";

const ErrorState = ({
  message = "Something went wrong.",
  onRetry,
}) => {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50 p-6 text-center">
      <AlertCircle className="mb-3 h-8 w-8 text-red-500" />

      <h3 className="text-sm font-semibold text-slate-900">
        Unable to load data
      </h3>

      <p className="mt-1 max-w-md text-sm text-slate-500">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          onClick={onRetry}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  );
};

export default ErrorState;