import type { Deployment } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface DeploymentTimelineProps {
  deployments: Deployment[];
}

export function DeploymentTimeline({ deployments }: DeploymentTimelineProps) {
  return (
    <div className="space-y-4">
      {deployments.map((d, i) => (
        <div key={d.id} className="relative flex gap-4 pl-6">
          {/* dot + line */}
          <div className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-primary/20" />
          {i < deployments.length - 1 && (
            <div className="absolute left-[5px] top-5 h-full w-0.5 bg-gray-200" />
          )}
          <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {d.packageName} <span className="text-gray-500">v{d.version}</span>
              </p>
              <StatusBadge status={d.status} />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(d.createdAt).toLocaleString()} · {d.targetCount} targets
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
