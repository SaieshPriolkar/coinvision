"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  label: string;
  yAxisLabel: string;
  color: string;
}

export default function GenericChart({ data, label, yAxisLabel, color }: Props) {
  return (
    <div style={{ width: "100%", height: 250, marginBottom: 24 }}>
      <h3 style={{ marginBottom: 8, fontWeight: "600", fontSize: 16 }}>{label}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => str.slice(0, 7)}
            minTickGap={20}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              fontSize: 12,
            }}
            tick={{ fontSize: 10 }}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}