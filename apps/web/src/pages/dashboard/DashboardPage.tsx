import { useQuery } from "@tanstack/react-query";
import { Package, Monitor, Rocket, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { DownloadActivityBar } from "@/components/charts/DownloadActivityBar";
import { ClientStatusPie } from "@/components/charts/ClientStatusPie";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type {
  DashboardStats,
  DownloadActivity,
  ClientStatusBreakdown,
  Deployment,
} from "@/types";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiGet<DashboardStats>("/api/dashboard/stats"),
  });

  const { data: downloads } = useQuery({
    queryKey: ["dashboard", "downloads"],
    queryFn: () => apiGet<DownloadActivity[]>("/api/dashboard/downloads"),
  });

  const { data: clientStatus } = useQuery({
    queryKey: ["dashboard", "client-status"],
    queryFn: () => apiGet<ClientStatusBreakdown[]>("/api/dashboard/client-status"),
  });

  const { data: deployments } = useQuery({
    queryKey: ["deployments"],
    queryFn: () => apiGet<Deployment[]>("/api/deployments"),
  });

  const recentDeployments = (deployments ?? []).slice(0, 5);

  const statCards = [
    { label: "Total Packages", value: stats?.totalPackages ?? 0, icon: Package, color: "text-primary bg-primary/10" },
    { label: "Total Clients", value: stats?.totalClients ?? 0, icon: Monitor, color: "text-emerald-600 bg-emerald-50" },
    { label: "Active Deployments", value: stats?.activeDeployments ?? 0, icon: Rocket, color: "text-amber-600 bg-amber-50" },
    { label: "Failed Deployments", value: stats?.failedDeployments ?? 0, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your download center" />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DownloadActivityBar data={downloads ?? []} />
        <ClientStatusPie data={clientStatus ?? []} />
      </div>

      {/* Recent Deployments */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-700">Recent Deployments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Package</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Version</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Targets</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDeployments.map((d) => (
                <tr
                  key={d.id}
                  className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-gray-50"
                  onClick={() => navigate(`/deployments/${d.id}`)}
                >
                  <td className="px-6 py-3 font-medium text-gray-900">{d.packageName}</td>
                  <td className="px-6 py-3 text-gray-600">{d.version}</td>
                  <td className="px-6 py-3 text-gray-600">{d.targetCount}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
