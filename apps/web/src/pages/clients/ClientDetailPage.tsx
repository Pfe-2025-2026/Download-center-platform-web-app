import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DeploymentTimeline } from "@/components/charts/DeploymentTimeline";
import { apiGet } from "@/services/api";
import type { Client, InstalledPackage, Deployment } from "@/types";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: client } = useQuery({
    queryKey: ["clients", id],
    queryFn: () => apiGet<Client>(`/api/clients/${id}`),
    enabled: !!id,
  });

  const { data: installedPkgs = [] } = useQuery({
    queryKey: ["clients", id, "packages"],
    queryFn: () => apiGet<InstalledPackage[]>(`/api/clients/${id}/packages`),
    enabled: !!id,
  });

  const { data: deployments = [] } = useQuery({
    queryKey: ["deployments"],
    queryFn: () => apiGet<Deployment[]>("/api/deployments"),
  });

  if (!client) {
    return <div className="py-12 text-center text-gray-400">Loading…</div>;
  }

  return (
    <div>
      <PageHeader title={client.hostname} description={`Client details — ${client.ip}`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Info Card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Client Information</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Hostname</dt>
              <dd className="font-medium text-gray-900">{client.hostname}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">IP Address</dt>
              <dd className="text-gray-900">{client.ip}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">OS</dt>
              <dd className="text-gray-900">{client.os}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Architecture</dt>
              <dd><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{client.architecture}</span></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Current Version</dt>
              <dd className="text-gray-900">{client.currentVersion}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Last Seen</dt>
              <dd className="text-gray-900">{new Date(client.lastSeen).toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd><StatusBadge status={client.status} /></dd>
            </div>
          </dl>
        </div>

        {/* Installed Packages */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Installed Packages</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 text-left font-semibold text-gray-600">Package</th>
                  <th className="pb-2 text-left font-semibold text-gray-600">Version</th>
                  <th className="pb-2 text-left font-semibold text-gray-600">Installed</th>
                </tr>
              </thead>
              <tbody>
                {installedPkgs.map((ip) => (
                  <tr key={ip.packageId} className="border-b border-gray-50">
                    <td className="py-2 font-medium text-gray-900">{ip.packageName}</td>
                    <td className="py-2 text-gray-600">{ip.version}</td>
                    <td className="py-2 text-gray-500">{new Date(ip.installedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deployment History */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Deployment History</h3>
        <DeploymentTimeline deployments={deployments.slice(0, 5)} />
      </div>
    </div>
  );
}
