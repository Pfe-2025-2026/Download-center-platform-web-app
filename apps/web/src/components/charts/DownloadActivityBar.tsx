import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DownloadActivity } from "@/types";

interface DownloadActivityBarProps {
  data: DownloadActivity[];
}

export function DownloadActivityBar({ data }: DownloadActivityBarProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Download Activity (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={(v: string) => new Date(v).toLocaleDateString("en-US", { weekday: "short" })}
            tick={{ fontSize: 12, fill: "#6b7280" }}
          />
          <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
          <Tooltip
            labelFormatter={(v: string) => new Date(v).toLocaleDateString()}
            contentStyle={{ borderRadius: "8px", fontSize: "13px" }}
          />
          <Bar dataKey="downloads" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
