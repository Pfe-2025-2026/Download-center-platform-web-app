import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { LogEntry, LogLevel } from "@/types";

const columns: ColumnDef<LogEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-gray-600">
        {new Date(row.original.timestamp).toLocaleString()}
      </span>
    ),
  },
  { accessorKey: "level", header: "Level", cell: ({ row }) => <StatusBadge status={row.original.level} /> },
  { accessorKey: "clientHostname", header: "Client", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.clientHostname}</span> },
  { accessorKey: "packageName", header: "Package" },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => <span className="max-w-md truncate text-gray-700">{row.original.message}</span>,
  },
];

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<LogLevel | "all">("all");
  const [clientFilter, setClientFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("");

  const { data: logs = [] } = useQuery({
    queryKey: ["logs"],
    queryFn: () => apiGet<LogEntry[]>("/api/logs"),
  });

  const uniqueClients = useMemo(() => [...new Set(logs.map((l) => l.clientHostname))], [logs]);
  const uniquePackages = useMemo(() => [...new Set(logs.map((l) => l.packageName))], [logs]);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (levelFilter !== "all" && l.level !== levelFilter) return false;
      if (clientFilter && l.clientHostname !== clientFilter) return false;
      if (packageFilter && l.packageName !== packageFilter) return false;
      return true;
    });
  }, [logs, levelFilter, clientFilter, packageFilter]);

  const exportCsv = useCallback(() => {
    const header = "Timestamp,Level,Client,Package,Message";
    const rows = filtered.map(
      (l) =>
        `"${l.timestamp}","${l.level}","${l.clientHostname}","${l.packageName}","${l.message.replace(/"/g, '""')}"`,
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div>
      <PageHeader
        title="Logs"
        description="System and deployment logs"
        action={
          <button
            onClick={exportCsv}
            className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value as LogLevel | "all")}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="all">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
        <select
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="">All Clients</option>
          {uniqueClients.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={packageFilter}
          onChange={(e) => setPackageFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
        >
          <option value="">All Packages</option>
          {uniquePackages.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} searchValue={search} pageSize={15} />
    </div>
  );
}
