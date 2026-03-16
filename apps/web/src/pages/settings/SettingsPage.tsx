import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Plus, RotateCcw, Upload } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { apiGet } from "@/services/api";
import type { PlatformSettings, SigningKey, AdminUser } from "@/types";

type Tab = "general" | "keys" | "notifications" | "users";

const keyColumns: ColumnDef<SigningKey>[] = [
  { accessorKey: "fingerprint", header: "Fingerprint", cell: ({ row }) => <span className="font-mono text-xs">{row.original.fingerprint}</span> },
  { accessorKey: "createdAt", header: "Created", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
  { accessorKey: "expiresAt", header: "Expires", cell: ({ row }) => new Date(row.original.expiresAt).toLocaleDateString() },
  { accessorKey: "isActive", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.isActive ? "active" : "expired"} /> },
];

const userColumns: ColumnDef<AdminUser>[] = [
  { accessorKey: "name", header: "Name", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role", cell: ({ row }) => <StatusBadge status={row.original.role} /> },
  { accessorKey: "createdAt", header: "Joined", cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString() },
];

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("general");
  const [platformName, setPlatformName] = useState("");
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const s = await apiGet<PlatformSettings>("/api/settings");
      setPlatformName(s.platformName);
      setEmailAlerts(s.emailAlertsEnabled);
      setAlertEmail(s.alertEmail);
      return s;
    },
  });

  const { data: keys = [] } = useQuery({
    queryKey: ["settings", "keys"],
    queryFn: () => apiGet<SigningKey[]>("/api/settings/keys"),
  });

  const { data: users = [] } = useQuery({
    queryKey: ["settings", "users"],
    queryFn: () => apiGet<AdminUser[]>("/api/settings/users"),
  });

  const activeKey = keys.find((k) => k.isActive);

  const tabs: { id: Tab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "keys", label: "Signing Keys" },
    { id: "notifications", label: "Notifications" },
    { id: "users", label: "Users" },
  ];

  return (
    <div>
      <PageHeader title="Settings" description="Platform configuration" />

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* General */}
      {tab === "general" && (
        <div className="max-w-xl rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">General Settings</h3>
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Platform Name</label>
            <input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Logo</label>
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                <Upload className="h-6 w-6 text-gray-400" />
              </div>
              <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Upload Logo
              </button>
            </div>
          </div>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
            Save Changes
          </button>
        </div>
      )}

      {/* Signing Keys */}
      {tab === "keys" && (
        <div>
          {activeKey && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">Active Signing Key</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Fingerprint</dt>
                  <dd className="mt-0.5 font-mono text-xs text-gray-900">{activeKey.fingerprint}</dd>
                </div>
                <div className="flex gap-8">
                  <div>
                    <dt className="text-gray-500">Created</dt>
                    <dd className="text-gray-900">{new Date(activeKey.createdAt).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Expires</dt>
                    <dd className="text-gray-900">{new Date(activeKey.expiresAt).toLocaleDateString()}</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-4 flex gap-3">
                <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
                  <RotateCcw className="h-4 w-4" />
                  Rotate Key
                </button>
                <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download className="h-4 w-4" />
                  Download Public Key
                </button>
              </div>
            </div>
          )}
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Key History</h3>
          <DataTable columns={keyColumns} data={keys} />
        </div>
      )}

      {/* Notifications */}
      {tab === "notifications" && (
        <div className="max-w-xl rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-sm font-semibold text-gray-700">Notification Settings</h3>
          <div className="mb-5">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Email alerts on deployment failure
              </span>
            </label>
          </div>
          {emailAlerts && (
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Alert Email</label>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
            Save Changes
          </button>
        </div>
      )}

      {/* Users */}
      {tab === "users" && (
        <div>
          <div className="mb-4">
            <button className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600">
              <Plus className="h-4 w-4" />
              Invite User
            </button>
          </div>
          <DataTable columns={userColumns} data={users} />
        </div>
      )}
    </div>
  );
}
