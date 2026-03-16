/* ─── Auth ─── */
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/* ─── Packages ─── */
export type Architecture = "x86_64" | "arm64" | "armhf";
export type PackageStatus = "active" | "draft" | "archived";
export type VersionStatus = "stable" | "beta" | "deprecated";

export interface SoftwarePackage {
  id: string;
  name: string;
  description: string;
  architectures: Architecture[];
  latestVersion: string;
  size: string;
  status: PackageStatus;
  gpgFingerprint: string;
  gpgStatus: "valid" | "expired" | "missing";
  createdAt: string;
  updatedAt: string;
}

export interface PackageVersion {
  id: string;
  packageId: string;
  version: string;
  architecture: Architecture;
  status: VersionStatus;
  size: string;
  checksum: string;
  releaseDate: string;
  isRollbackTarget: boolean;
}

/* ─── Clients ─── */
export type ClientStatus = "online" | "offline" | "outdated";

export interface Client {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  architecture: Architecture;
  lastSeen: string;
  currentVersion: string;
  status: ClientStatus;
}

export interface InstalledPackage {
  packageId: string;
  packageName: string;
  version: string;
  installedAt: string;
}

/* ─── Deployments ─── */
export type DeploymentStatus = "pending" | "running" | "success" | "failed";
export type ClientDeploymentStatus = "pending" | "downloading" | "installing" | "success" | "failed";

export interface Deployment {
  id: string;
  packageId: string;
  packageName: string;
  version: string;
  targetCount: number;
  successCount: number;
  failedCount: number;
  status: DeploymentStatus;
  createdAt: string;
  completedAt: string | null;
}

export interface DeploymentClientStatus {
  clientId: string;
  clientHostname: string;
  status: ClientDeploymentStatus;
  duration: string | null;
  errorMessage: string | null;
}

/* ─── Logs ─── */
export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  clientHostname: string;
  packageName: string;
  message: string;
}

/* ─── Settings ─── */
export interface SigningKey {
  id: string;
  fingerprint: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "viewer";
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  logoUrl: string;
  emailAlertsEnabled: boolean;
  alertEmail: string;
}

/* ─── Dashboard ─── */
export interface DashboardStats {
  totalPackages: number;
  totalClients: number;
  activeDeployments: number;
  failedDeployments: number;
}

export interface DownloadActivity {
  date: string;
  downloads: number;
}

export interface ClientStatusBreakdown {
  status: ClientStatus;
  count: number;
}
