import { Bell, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <button className="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2 rounded-md px-3 py-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-white">
            {user?.name?.charAt(0) ?? "A"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name ?? "Admin"}</p>
            <p className="text-xs text-gray-500">{user?.role ?? "admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
