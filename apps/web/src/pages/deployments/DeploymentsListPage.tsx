import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { Deployment, DeploymentStatus } from "@/types";

const columns: ColumnDef<Deployment>[] = [
  { accessorKey: "packageName", header: "Package", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.packageName}</span> },
  { accessorKey: "version", header: "Version" },
  { accessorKey: "targetCount", header: "Targets" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
];

export default function DeploymentsListPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<DeploymentStatus | "all">("all");

  const { data: deployments = [] } = useQuery({
    queryKey: ["deployments"],
    queryFn: () => apiGet<Deployment[]>("/api/deployments"),
  });

  const filtered = useMemo(() => {
    if (statusFilter === "all") return deployments;
    return deployments.filter((d) => d.status === statusFilter);
  }, [deployments, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Deployments"
        description="Track and manage deployments"
        action={
          <button
            onClick={() => navigate("/deployments/new")}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            New Deployment
          </button>
        }
      />

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DeploymentStatus | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={(row) => navigate(`/deployments/${row.id}`)}
      />
    </div>
  );
}
