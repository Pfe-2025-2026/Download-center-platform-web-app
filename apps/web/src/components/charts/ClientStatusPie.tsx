import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ClientStatusBreakdown } from "@/types";

const COLORS: Record<string, string> = {
  online: "#22c55e",
  offline: "#ef4444",
  outdated: "#eab308",
};

interface ClientStatusPieProps {
  data: ClientStatusBreakdown[];
}

export function ClientStatusPie({ data }: ClientStatusPieProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">Client Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={COLORS[entry.status] ?? "#9ca3af"} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "13px" }} />
          <Legend
            formatter={(value: string) => <span className="text-xs capitalize text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
