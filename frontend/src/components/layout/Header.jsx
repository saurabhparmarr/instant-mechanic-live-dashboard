import { Menu, Bell } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block">
        <h2 className="text-sm font-semibold text-slate-900">
          Live Operations
        </h2>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            A
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-slate-900">
              Admin
            </p>
            <p className="text-[11px] text-slate-500">
              Operations
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;