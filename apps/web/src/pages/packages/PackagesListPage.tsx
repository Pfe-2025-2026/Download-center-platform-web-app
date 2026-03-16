import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { SoftwarePackage, Architecture, PackageStatus } from "@/types";

const columns: ColumnDef<SoftwarePackage>[] = [
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
  { accessorKey: "latestVersion", header: "Latest Version" },
  {
    accessorKey: "architectures",
    header: "Arch",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.architectures.map((a) => (
          <span key={a} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{a}</span>
        ))}
      </div>
    ),
  },
  { accessorKey: "size", header: "Size" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    cell: () => <span className="text-xs text-primary hover:underline">View →</span>,
  },
];

export default function PackagesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [archFilter, setArchFilter] = useState<Architecture | "all">("all");
  const [statusFilter, setStatusFilter] = useState<PackageStatus | "all">("all");

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: () => apiGet<SoftwarePackage[]>("/api/packages"),
  });

  const filtered = useMemo(() => {
    return packages.filter((p) => {
      if (archFilter !== "all" && !p.architectures.includes(archFilter)) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [packages, archFilter, statusFilter]);

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Manage software packages"
        action={
          <button
            onClick={() => navigate("/packages/new")}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            <Plus className="h-4 w-4" />
            New Package
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search packages…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={archFilter}
          onChange={(e) => setArchFilter(e.target.value as Architecture | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="all">All Architectures</option>
          <option value="x86_64">x86_64</option>
          <option value="arm64">arm64</option>
          <option value="armhf">armhf</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PackageStatus | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchValue={search}
        onRowClick={(row) => navigate(`/packages/${row.id}`)}
      />
    </div>
  );
}
