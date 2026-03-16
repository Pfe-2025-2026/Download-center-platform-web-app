import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { Client } from "@/types";

const columns: ColumnDef<Client>[] = [
  { accessorKey: "hostname", header: "Hostname", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.hostname}</span> },
  { accessorKey: "ip", header: "IP Address" },
  { accessorKey: "os", header: "OS" },
  {
    accessorKey: "architecture",
    header: "Arch",
    cell: ({ row }) => (
      <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{row.original.architecture}</span>
    ),
  },
  {
    accessorKey: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => new Date(row.original.lastSeen).toLocaleString(),
  },
  { accessorKey: "currentVersion", header: "Version" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];

export default function ClientsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => apiGet<Client[]>("/api/clients"),
  });

  return (
    <div>
      <PageHeader title="Clients" description="Connected client machines" />

      <div className="mb-4">
        <div className="relative inline-block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        searchValue={search}
        onRowClick={(row) => navigate(`/clients/${row.id}`)}
      />
    </div>
  );
}
