import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { FileUpload } from "@/components/ui/FileUpload";
import type { Architecture } from "@/types";

const ARCH_OPTIONS: Architecture[] = ["amd64", "i386"];

export default function PackageNewPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [architectures, setArchitectures] = useState<Architecture[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleArch = (arch: Architecture) => {
    setArchitectures((prev) =>
      prev.includes(arch) ? prev.filter((a) => a !== arch) : [...prev, arch],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("architectures", JSON.stringify(architectures));
      formData.append("version", "1.0.0");
      formData.append("architecture", architectures[0] || "amd64");
      if (file) {
        formData.append("file", file);
      }

      const token = localStorage.getItem("auth-token");
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to create package");
        setSubmitting(false);
        return;
      }

      navigate("/packages");
    } catch {
      alert("Could not reach the server");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Package" description="Create a new software package" />

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6"
      >
        {/* Name */}
        <div className="mb-5">
          <label htmlFor="pkg-name" className="mb-1.5 block text-sm font-medium text-gray-700">
            Package Name
          </label>
          <input
            id="pkg-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. core-agent"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label htmlFor="pkg-desc" className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="pkg-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the package"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Architectures */}
        <div className="mb-5">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Architectures</span>
          <div className="flex flex-wrap gap-2">
            {ARCH_OPTIONS.map((arch) => (
              <button
                key={arch}
                type="button"
                onClick={() => toggleArch(arch)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                  architectures.includes(arch)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {arch}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <span className="mb-1.5 block text-sm font-medium text-gray-700">Package File</span>
          <FileUpload onFileSelect={setFile} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/packages")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !name || architectures.length === 0}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create Package"}
          </button>
        </div>
      </form>
    </div>
  );
}
