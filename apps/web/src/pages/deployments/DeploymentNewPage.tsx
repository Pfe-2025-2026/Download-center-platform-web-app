import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { apiGet } from "@/services/api";
import type { SoftwarePackage, PackageVersion, Client } from "@/types";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

export default function DeploymentNewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [selectedVersion, setSelectedVersion] = useState<string>("");
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { data: packages = [] } = useQuery({
    queryKey: ["packages"],
    queryFn: () => apiGet<SoftwarePackage[]>("/api/packages"),
  });

  const { data: versions = [] } = useQuery({
    queryKey: ["packages", selectedPackageId, "versions"],
    queryFn: () => apiGet<PackageVersion[]>(`/api/packages/${selectedPackageId}/versions`),
    enabled: !!selectedPackageId,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: () => apiGet<Client[]>("/api/clients"),
  });

  const toggleClient = (id: string) => {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const canNext = () => {
    if (step === 1) return !!selectedPackageId;
    if (step === 2) return !!selectedVersion;
    if (step === 3) return selectedClients.length > 0;
    return true;
  };

  const handleDeploy = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: selectedPackageId,
          version: selectedVersion,
          clientIds: selectedClients,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to create deployment");
        setSubmitting(false);
        return;
      }
      navigate("/deployments");
    } catch {
      alert("Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  };

  const stepLabels = ["Select Package", "Select Version", "Select Clients", "Confirm"];

  return (
    <div>
      <PageHeader title="New Deployment" description="Deploy a package to clients" />

      {/* Stepper */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {stepLabels.map((label, i) => {
          const s = (i + 1) as Step;
          const isActive = step === s;
          const isDone = step > s;
          return (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                  isDone
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : s}
              </div>
              <span className={cn("hidden text-sm sm:inline", isActive ? "font-medium text-gray-900" : "text-gray-500")}>
                {label}
              </span>
              {i < 3 && <ChevronRight className="h-4 w-4 text-gray-300" />}
            </div>
          );
        })}
      </div>

      <div className="mx-auto max-w-3xl rounded-lg border border-gray-200 bg-white p-6">
        {/* Step 1: Select Package */}
        {step === 1 && (
          <div className="space-y-2">
            <h3 className="mb-3 font-semibold text-gray-900">Select Package</h3>
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackageId(pkg.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors",
                  selectedPackageId === pkg.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-gray-200 text-gray-700 hover:border-gray-300",
                )}
              >
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-xs text-gray-500">{pkg.description}</p>
                </div>
                <span className="text-xs text-gray-400">v{pkg.latestVersion}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select Version */}
        {step === 2 && (
          <div className="space-y-2">
            <h3 className="mb-3 font-semibold text-gray-900">Select Version</h3>
            {versions
              .filter((v) => v.status !== "deprecated")
              .map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVersion(v.version)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm transition-colors",
                    selectedVersion === v.version
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-gray-200 text-gray-700 hover:border-gray-300",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{v.version}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{v.architecture}</span>
                  </div>
                  <span className={cn("text-xs", v.status === "stable" ? "text-green-600" : "text-amber-600")}>
                    {v.status}
                  </span>
                </button>
              ))}
          </div>
        )}

        {/* Step 3: Select Clients */}
        {step === 3 && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Select Target Clients</h3>
              <button
                onClick={() =>
                  setSelectedClients(
                    selectedClients.length === clients.length ? [] : clients.map((c) => c.id),
                  )
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                {selectedClients.length === clients.length ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="space-y-2">
              {clients.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 text-sm transition-colors",
                    selectedClients.includes(c.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(c.id)}
                    onChange={() => toggleClient(c.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{c.hostname}</p>
                    <p className="text-xs text-gray-500">{c.ip} · {c.os} · {c.architecture}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">Confirm Deployment</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Package</dt>
                <dd className="font-medium text-gray-900">
                  {packages.find((p) => p.id === selectedPackageId)?.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Version</dt>
                <dd className="font-medium text-gray-900">{selectedVersion}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Target Clients</dt>
                <dd className="font-medium text-gray-900">{selectedClients.length} clients</dd>
              </div>
            </dl>
            <div className="mt-4 rounded-md bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Targets:</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {clients
                  .filter((c) => selectedClients.includes(c.id))
                  .map((c) => (
                    <span key={c.id} className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                      {c.hostname}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
          <button
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            disabled={step === 1}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))}
              disabled={!canNext()}
              className="flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleDeploy}
              disabled={submitting}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Deploying…" : "Trigger Deployment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
