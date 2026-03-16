import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { PackageVersion } from "@/types";
import { Star, Archive, RotateCcw } from "lucide-react";

const columns: ColumnDef<PackageVersion>[] = [
  { accessorKey: "version", header: "Version", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.version}</span> },
  { accessorKey: "releaseDate", header: "Release Date", cell: ({ row }) => new Date(row.original.releaseDate).toLocaleDateString() },
  {
    accessorKey: "architecture",
    header: "Arch",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{row.original.architecture}</span>
    ),
  },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
  { accessorKey: "size", header: "Size" },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => (
      <div className="flex items-center gap-2">
        {original.status !== "stable" && (
          <button title="Promote to stable" className="rounded p-1 text-gray-400 hover:bg-green-50 hover:text-green-600">
            <Star className="h-4 w-4" />
          </button>
        )}
        {original.status !== "deprecated" && (
          <button title="Deprecate" className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600">
            <Archive className="h-4 w-4" />
          </button>
        )}
        {!original.isRollbackTarget && (
          <button title="Set as rollback target" className="rounded p-1 text-gray-400 hover:bg-amber-50 hover:text-amber-600">
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
        {original.isRollbackTarget && (
          <span className="text-xs font-medium text-amber-600">Rollback Target</span>
        )}
      </div>
    ),
  },
];

export default function PackageVersionsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: versions = [] } = useQuery({
    queryKey: ["packages", id, "versions"],
    queryFn: () => apiGet<PackageVersion[]>(`/api/packages/${id}/versions`),
    enabled: !!id,
  });

  return (
    <div>
      <PageHeader
        title="Package Versions"
        description={`All versions for package ${id}`}
      />
      <DataTable columns={columns} data={versions} />
    </div>
  );
}
