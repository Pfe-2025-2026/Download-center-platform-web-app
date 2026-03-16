import type {
  SoftwarePackage,
  PackageVersion,
  Client,
  Deployment,
  DeploymentClientStatus,
  LogEntry,
  DashboardStats,
  DownloadActivity,
  ClientStatusBreakdown,
  InstalledPackage,
  SigningKey,
  AdminUser,
  PlatformSettings,
} from "@/types";

/* ─── Packages ─── */
export const mockPackages: SoftwarePackage[] = [
  {
    id: "pkg-1",
    name: "core-agent",
    description: "Core monitoring agent for Linux hosts",
    architectures: ["x86_64", "arm64"],
    latestVersion: "3.4.1",
    size: "24.5 MB",
    status: "active",
    gpgFingerprint: "A1B2 C3D4 E5F6 7890 1234 5678 9ABC DEF0 1234 5678",
    gpgStatus: "valid",
    createdAt: "2025-06-10T09:00:00Z",
    updatedAt: "2026-03-10T14:22:00Z",
  },
  {
    id: "pkg-2",
    name: "telemetry-collector",
    description: "Telemetry data collector daemon",
    architectures: ["x86_64"],
    latestVersion: "2.1.0",
    size: "18.2 MB",
    status: "active",
    gpgFingerprint: "B2C3 D4E5 F678 9012 3456 789A BCDE F012 3456 789A",
    gpgStatus: "valid",
    createdAt: "2025-08-22T11:30:00Z",
    updatedAt: "2026-02-28T08:15:00Z",
  },
  {
    id: "pkg-3",
    name: "log-forwarder",
    description: "Centralized log forwarding agent",
    architectures: ["x86_64", "arm64", "armhf"],
    latestVersion: "1.8.3",
    size: "12.7 MB",
    status: "active",
    gpgFingerprint: "C3D4 E5F6 7890 1234 5678 9ABC DEF0 1234 5678 9ABC",
    gpgStatus: "valid",
    createdAt: "2025-04-15T07:45:00Z",
    updatedAt: "2026-03-05T16:00:00Z",
  },
  {
    id: "pkg-4",
    name: "patch-manager",
    description: "Automated OS patch management tool",
    architectures: ["x86_64"],
    latestVersion: "4.0.0-beta",
    size: "31.1 MB",
    status: "draft",
    gpgFingerprint: "D4E5 F678 9012 3456 789A BCDE F012 3456 789A BCDE",
    gpgStatus: "missing",
    createdAt: "2026-01-20T10:00:00Z",
    updatedAt: "2026-03-12T12:00:00Z",
  },
  {
    id: "pkg-5",
    name: "vpn-connector",
    description: "Site-to-site VPN connector daemon",
    architectures: ["x86_64", "arm64"],
    latestVersion: "2.3.5",
    size: "9.8 MB",
    status: "archived",
    gpgFingerprint: "E5F6 7890 1234 5678 9ABC DEF0 1234 5678 9ABC DEF0",
    gpgStatus: "expired",
    createdAt: "2024-11-01T06:00:00Z",
    updatedAt: "2025-12-15T18:30:00Z",
  },
];

/* ─── Versions ─── */
export const mockVersions: PackageVersion[] = [
  { id: "v-1", packageId: "pkg-1", version: "3.4.1", architecture: "x86_64", status: "stable", size: "24.5 MB", checksum: "sha256:abc123", releaseDate: "2026-03-10T14:22:00Z", isRollbackTarget: false },
  { id: "v-2", packageId: "pkg-1", version: "3.4.0", architecture: "x86_64", status: "stable", size: "24.3 MB", checksum: "sha256:def456", releaseDate: "2026-02-15T10:00:00Z", isRollbackTarget: true },
  { id: "v-3", packageId: "pkg-1", version: "3.3.0", architecture: "x86_64", status: "deprecated", size: "23.9 MB", checksum: "sha256:ghi789", releaseDate: "2025-12-01T08:00:00Z", isRollbackTarget: false },
  { id: "v-4", packageId: "pkg-1", version: "3.5.0-beta", architecture: "arm64", status: "beta", size: "25.1 MB", checksum: "sha256:jkl012", releaseDate: "2026-03-14T16:00:00Z", isRollbackTarget: false },
  { id: "v-5", packageId: "pkg-1", version: "3.4.1", architecture: "arm64", status: "stable", size: "24.8 MB", checksum: "sha256:mno345", releaseDate: "2026-03-10T14:22:00Z", isRollbackTarget: false },
];

/* ─── Clients ─── */
export const mockClients: Client[] = [
  { id: "cl-1", hostname: "prod-web-01", ip: "10.0.1.10", os: "Ubuntu 22.04", architecture: "x86_64", lastSeen: "2026-03-16T08:55:00Z", currentVersion: "3.4.1", status: "online" },
  { id: "cl-2", hostname: "prod-web-02", ip: "10.0.1.11", os: "Ubuntu 22.04", architecture: "x86_64", lastSeen: "2026-03-16T08:54:00Z", currentVersion: "3.4.1", status: "online" },
  { id: "cl-3", hostname: "prod-db-01", ip: "10.0.2.10", os: "Debian 12", architecture: "x86_64", lastSeen: "2026-03-16T08:50:00Z", currentVersion: "3.4.0", status: "outdated" },
  { id: "cl-4", hostname: "edge-node-01", ip: "10.0.3.5", os: "Raspberry Pi OS", architecture: "armhf", lastSeen: "2026-03-15T22:00:00Z", currentVersion: "1.8.3", status: "offline" },
  { id: "cl-5", hostname: "staging-app-01", ip: "10.0.4.20", os: "Ubuntu 24.04", architecture: "arm64", lastSeen: "2026-03-16T08:53:00Z", currentVersion: "3.5.0-beta", status: "online" },
  { id: "cl-6", hostname: "prod-worker-01", ip: "10.0.1.30", os: "Rocky Linux 9", architecture: "x86_64", lastSeen: "2026-03-16T07:10:00Z", currentVersion: "3.4.1", status: "online" },
  { id: "cl-7", hostname: "prod-worker-02", ip: "10.0.1.31", os: "Rocky Linux 9", architecture: "x86_64", lastSeen: "2026-03-14T12:00:00Z", currentVersion: "3.3.0", status: "outdated" },
  { id: "cl-8", hostname: "dev-box-01", ip: "192.168.1.100", os: "Fedora 39", architecture: "x86_64", lastSeen: "2026-03-16T08:56:00Z", currentVersion: "3.4.1", status: "online" },
];

/* ─── Deployments ─── */
export const mockDeployments: Deployment[] = [
  { id: "dep-1", packageId: "pkg-1", packageName: "core-agent", version: "3.4.1", targetCount: 6, successCount: 5, failedCount: 1, status: "failed", createdAt: "2026-03-15T10:00:00Z", completedAt: "2026-03-15T10:12:00Z" },
  { id: "dep-2", packageId: "pkg-3", packageName: "log-forwarder", version: "1.8.3", targetCount: 4, successCount: 4, failedCount: 0, status: "success", createdAt: "2026-03-14T14:30:00Z", completedAt: "2026-03-14T14:38:00Z" },
  { id: "dep-3", packageId: "pkg-2", packageName: "telemetry-collector", version: "2.1.0", targetCount: 3, successCount: 3, failedCount: 0, status: "success", createdAt: "2026-03-13T09:00:00Z", completedAt: "2026-03-13T09:05:00Z" },
  { id: "dep-4", packageId: "pkg-1", packageName: "core-agent", version: "3.5.0-beta", targetCount: 1, successCount: 1, failedCount: 0, status: "success", createdAt: "2026-03-12T16:00:00Z", completedAt: "2026-03-12T16:03:00Z" },
  { id: "dep-5", packageId: "pkg-1", packageName: "core-agent", version: "3.4.1", targetCount: 2, successCount: 0, failedCount: 0, status: "running", createdAt: "2026-03-16T08:00:00Z", completedAt: null },
  { id: "dep-6", packageId: "pkg-4", packageName: "patch-manager", version: "4.0.0-beta", targetCount: 1, successCount: 0, failedCount: 0, status: "pending", createdAt: "2026-03-16T09:00:00Z", completedAt: null },
];

/* ─── Deployment Client Statuses ─── */
export const mockDeploymentClientStatuses: DeploymentClientStatus[] = [
  { clientId: "cl-1", clientHostname: "prod-web-01", status: "success", duration: "45s", errorMessage: null },
  { clientId: "cl-2", clientHostname: "prod-web-02", status: "success", duration: "52s", errorMessage: null },
  { clientId: "cl-3", clientHostname: "prod-db-01", status: "success", duration: "38s", errorMessage: null },
  { clientId: "cl-6", clientHostname: "prod-worker-01", status: "success", duration: "41s", errorMessage: null },
  { clientId: "cl-7", clientHostname: "prod-worker-02", status: "failed", duration: "120s", errorMessage: "Dependency conflict: libssl3 >= 3.0 required" },
  { clientId: "cl-8", clientHostname: "dev-box-01", status: "success", duration: "33s", errorMessage: null },
];

/* ─── Installed Packages ─── */
export const mockInstalledPackages: InstalledPackage[] = [
  { packageId: "pkg-1", packageName: "core-agent", version: "3.4.1", installedAt: "2026-03-15T10:05:00Z" },
  { packageId: "pkg-2", packageName: "telemetry-collector", version: "2.1.0", installedAt: "2026-03-13T09:03:00Z" },
  { packageId: "pkg-3", packageName: "log-forwarder", version: "1.8.3", installedAt: "2026-03-14T14:35:00Z" },
];

/* ─── Logs ─── */
export const mockLogs: LogEntry[] = [
  { id: "log-1", timestamp: "2026-03-16T08:56:00Z", level: "info", clientHostname: "prod-web-01", packageName: "core-agent", message: "Package updated to 3.4.1 successfully" },
  { id: "log-2", timestamp: "2026-03-16T08:55:30Z", level: "info", clientHostname: "prod-web-02", packageName: "core-agent", message: "Package updated to 3.4.1 successfully" },
  { id: "log-3", timestamp: "2026-03-16T08:54:00Z", level: "error", clientHostname: "prod-worker-02", packageName: "core-agent", message: "Dependency conflict: libssl3 >= 3.0 required. Installation aborted." },
  { id: "log-4", timestamp: "2026-03-16T07:30:00Z", level: "warn", clientHostname: "edge-node-01", packageName: "log-forwarder", message: "Client offline — scheduled deployment deferred" },
  { id: "log-5", timestamp: "2026-03-15T22:00:00Z", level: "info", clientHostname: "staging-app-01", packageName: "core-agent", message: "Beta 3.5.0-beta installed for testing" },
  { id: "log-6", timestamp: "2026-03-15T18:00:00Z", level: "warn", clientHostname: "prod-db-01", packageName: "core-agent", message: "Client running outdated version 3.4.0" },
  { id: "log-7", timestamp: "2026-03-15T14:00:00Z", level: "info", clientHostname: "prod-worker-01", packageName: "telemetry-collector", message: "Health check passed" },
  { id: "log-8", timestamp: "2026-03-15T10:12:00Z", level: "error", clientHostname: "prod-worker-02", packageName: "core-agent", message: "Deployment dep-1 failed on this client" },
  { id: "log-9", timestamp: "2026-03-14T14:38:00Z", level: "info", clientHostname: "prod-web-01", packageName: "log-forwarder", message: "Deployment dep-2 completed successfully" },
  { id: "log-10", timestamp: "2026-03-14T09:00:00Z", level: "info", clientHostname: "dev-box-01", packageName: "core-agent", message: "Manual package install triggered by admin" },
  { id: "log-11", timestamp: "2026-03-13T20:00:00Z", level: "error", clientHostname: "edge-node-01", packageName: "log-forwarder", message: "Disk space low — update deferred" },
  { id: "log-12", timestamp: "2026-03-13T09:05:00Z", level: "info", clientHostname: "prod-web-01", packageName: "telemetry-collector", message: "Deployment dep-3 completed successfully" },
];

/* ─── Dashboard ─── */
export const mockDashboardStats: DashboardStats = {
  totalPackages: 5,
  totalClients: 8,
  activeDeployments: 2,
  failedDeployments: 1,
};

export const mockDownloadActivity: DownloadActivity[] = [
  { date: "2026-03-10", downloads: 42 },
  { date: "2026-03-11", downloads: 38 },
  { date: "2026-03-12", downloads: 55 },
  { date: "2026-03-13", downloads: 61 },
  { date: "2026-03-14", downloads: 47 },
  { date: "2026-03-15", downloads: 73 },
  { date: "2026-03-16", downloads: 29 },
];

export const mockClientStatusBreakdown: ClientStatusBreakdown[] = [
  { status: "online", count: 5 },
  { status: "offline", count: 1 },
  { status: "outdated", count: 2 },
];

/* ─── Settings ─── */
export const mockSigningKeys: SigningKey[] = [
  { id: "key-1", fingerprint: "A1B2 C3D4 E5F6 7890 1234 5678 9ABC DEF0 1234 5678", createdAt: "2025-01-15T09:00:00Z", expiresAt: "2027-01-15T09:00:00Z", isActive: true },
  { id: "key-2", fingerprint: "F0E1 D2C3 B4A5 9687 0123 4567 89AB CDEF 0123 4567", createdAt: "2024-01-10T09:00:00Z", expiresAt: "2026-01-10T09:00:00Z", isActive: false },
];

export const mockAdminUsers: AdminUser[] = [
  { id: "usr-1", name: "Admin", email: "admin@downloadcenter.local", role: "admin", createdAt: "2024-06-01T08:00:00Z" },
  { id: "usr-2", name: "Jane Ops", email: "jane.ops@downloadcenter.local", role: "admin", createdAt: "2025-02-20T10:00:00Z" },
  { id: "usr-3", name: "Read Only", email: "viewer@downloadcenter.local", role: "viewer", createdAt: "2025-09-10T14:00:00Z" },
];

export const mockPlatformSettings: PlatformSettings = {
  platformName: "Download Center",
  logoUrl: "",
  emailAlertsEnabled: true,
  alertEmail: "ops-alerts@downloadcenter.local",
};
