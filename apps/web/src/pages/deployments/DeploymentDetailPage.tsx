import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { apiGet } from "@/services/api";
import type { Deployment, DeploymentClientStatus } from "@/types";

const columns: ColumnDef<DeploymentClientStatus>[] = [
  { accessorKey: "clientHostname", header: "Client", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.clientHostname}</span> },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: "duration", header: "Duration", cell: ({ row }) => row.original.duration ?? "—" },
  {
    accessorKey: "errorMessage",
    header: "Error",
    cell: ({ row }) => {
      const msg = row.original.errorMessage;
      return msg ? (
        <span className="text-xs text-red-600">{msg}</span>
      ) : (
        <span className="text-gray-400">—</span>
      );
    },
  },
];

export default function DeploymentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [showRollback, setShowRollback] = useState(false);

  const { data: deployment } = useQuery({
    queryKey: ["deployments", id],
    queryFn: () => apiGet<Deployment>(`/api/deployments/${id}`),
    enabled: !!id,
  });

  const { data: clientStatuses = [] } = useQuery({
    queryKey: ["deployments", id, "clients"],
    queryFn: () => apiGet<DeploymentClientStatus[]>(`/api/deployments/${id}/clients`),
    enabled: !!id,
  });

  if (!deployment) {
    return <div className="py-12 text-center text-gray-400">Loading…</div>;
  }

  return (
    <div>
      <PageHeader
        title={`Deployment ${deployment.id}`}
        description={`${deployment.packageName} v${deployment.version}`}
        action={
          deployment.status === "failed" ? (
            <button
              onClick={() => setShowRollback(true)}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <RotateCcw className="h-4 w-4" />
              Rollback
            </button>
          ) : undefined
        }
      />

      {/* Summary Card */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Deployment Summary</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <StatusBadge status={deployment.status} className="mt-1" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Targets</p>
            <p className="mt-1 text-lg font-bold text-gray-900">{deployment.targetCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Succeeded</p>
            <p className="mt-1 text-lg font-bold text-green-600">{deployment.successCount}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Failed</p>
            <p className="mt-1 text-lg font-bold text-red-600">{deployment.failedCount}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created: </span>
            <span className="text-gray-900">{new Date(deployment.createdAt).toLocaleString()}</span>
          </div>
          {deployment.completedAt && (
            <div>
              <span className="text-gray-500">Completed: </span>
              <span className="text-gray-900">{new Date(deployment.completedAt).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Per-client progress */}
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Client Progress</h3>
      <DataTable columns={columns} data={clientStatuses} />

      <ConfirmDialog
        open={showRollback}
        title="Rollback Deployment"
        description={`Are you sure you want to rollback deployment ${deployment.id}? This will revert ${deployment.packageName} on all affected clients.`}
        confirmLabel="Rollback"
        variant="danger"
        onConfirm={() => {
          setShowRollback(false);
          // In mock mode, just close
        }}
        onCancel={() => setShowRollback(false)}
      />
    </div>
  );
}
