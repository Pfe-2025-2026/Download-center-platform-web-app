import { useState } from "react";
import { X } from "lucide-react";

const isMock = import.meta.env.VITE_USE_MOCK === "true";

export function MockBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (!isMock || dismissed) return null;

  return (
    <div className="flex items-center justify-between bg-yellow-400 px-4 py-2 text-sm font-medium text-yellow-900">
      <span>⚠️ Mock Mode — No backend connected</span>
      <button onClick={() => setDismissed(true)} className="hover:text-yellow-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
