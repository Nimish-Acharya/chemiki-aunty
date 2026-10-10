import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { CHART_COLORS } from "../../config/constants";

const PIE_COLORS = [
  CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.warning,
  CHART_COLORS.success, CHART_COLORS.danger, "#64748b",
];

// Dark tooltip box so the hover label is readable on our theme.
const tooltipStyle = {
  background: "#172140", border: "1px solid #3a4a73", borderRadius: 6, color: "#e6ebf5",
};

// Bars: investigations started and findings collected per day.
export function ActivityChart({ data }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.grid} vertical={false} />
          <XAxis dataKey="day" stroke={CHART_COLORS.text} tickLine={false} />
          <YAxis stroke={CHART_COLORS.text} tickLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Legend />
          <Bar dataKey="investigations" name="Investigations" fill={CHART_COLORS.primary} radius={[3, 3, 0, 0]} />
          <Bar dataKey="findings" name="Findings" fill={CHART_COLORS.secondary} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Donut: how many entities were found in each category.
export function EntityDistributionChart({ data }) {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
