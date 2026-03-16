import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "error" | "default";

const variantMap: Record<string, Variant> = {
  online: "success",
  success: "success",
  stable: "success",
  active: "success",
  valid: "success",
  pending: "warning",
  beta: "warning",
  outdated: "warning",
  downloading: "warning",
  installing: "warning",
  running: "warning",
  draft: "warning",
  failed: "error",
  offline: "error",
  error: "error",
  expired: "error",
  missing: "error",
  deprecated: "default",
  archived: "default",
};

const variantClasses: Record<Variant, string> = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-600",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = variantMap[status] ?? "default";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variantClasses[variant],
        className,
      )}
    >
      {status}
    </span>
  );
}
