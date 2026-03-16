import { Navigate, type RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";

// Lazy imports for code splitting
import LoginPage from "@/pages/auth/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import PackagesListPage from "@/pages/packages/PackagesListPage";
import PackageNewPage from "@/pages/packages/PackageNewPage";
import PackageDetailPage from "@/pages/packages/PackageDetailPage";
import PackageVersionsPage from "@/pages/packages/PackageVersionsPage";
import ClientsListPage from "@/pages/clients/ClientsListPage";
import ClientDetailPage from "@/pages/clients/ClientDetailPage";
import DeploymentsListPage from "@/pages/deployments/DeploymentsListPage";
import DeploymentNewPage from "@/pages/deployments/DeploymentNewPage";
import DeploymentDetailPage from "@/pages/deployments/DeploymentDetailPage";
import LogsPage from "@/pages/logs/LogsPage";
import SettingsPage from "@/pages/settings/SettingsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "packages", element: <PackagesListPage /> },
      { path: "packages/new", element: <PackageNewPage /> },
      { path: "packages/:id", element: <PackageDetailPage /> },
      { path: "packages/:id/versions", element: <PackageVersionsPage /> },
      { path: "clients", element: <ClientsListPage /> },
      { path: "clients/:id", element: <ClientDetailPage /> },
      { path: "deployments", element: <DeploymentsListPage /> },
      { path: "deployments/new", element: <DeploymentNewPage /> },
      { path: "deployments/:id", element: <DeploymentDetailPage /> },
      { path: "logs", element: <LogsPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
];
