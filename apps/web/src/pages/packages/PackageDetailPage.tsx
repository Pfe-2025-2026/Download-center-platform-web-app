import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { SoftwarePackage } from "@/types";

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: pkg } = useQuery({
    queryKey: ["packages", id],
    queryFn: () => apiGet<SoftwarePackage>(`/api/packages/${id}`),
    enabled: !!id,
  });

  if (!pkg) {
    return <div className="py-12 text-center text-gray-400">Loading…</div>;
  }

  return (
    <div>
      <PageHeader
        title={pkg.name}
        description={pkg.description}
        action={
          <Link
            to={`/packages/${id}/versions`}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            View Versions
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Metadata */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Package Metadata</h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Status</dt>
              <dd><StatusBadge status={pkg.status} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Latest Version</dt>
              <dd className="font-medium text-gray-900">{pkg.latestVersion}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Architectures</dt>
              <dd className="flex gap-1">
                {pkg.architectures.map((a) => (
                  <span key={a} className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{a}</span>
                ))}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Size</dt>
              <dd className="text-gray-900">{pkg.size}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Created</dt>
              <dd className="text-gray-900">{new Date(pkg.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Updated</dt>
              <dd className="text-gray-900">{new Date(pkg.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        {/* GPG Signature */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">GPG Signature</h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Fingerprint</dt>
              <dd className="mt-1 break-all font-mono text-xs text-gray-900">{pkg.gpgFingerprint}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Signature Status</dt>
              <dd><StatusBadge status={pkg.gpgStatus} /></dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
