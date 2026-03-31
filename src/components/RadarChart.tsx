"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PerspectiveScore } from "@/types";

interface RadarChartProps {
  scores: PerspectiveScore[];
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = scores.map((s) => ({
    subject: s.name,
    score: s.score,
    fullMark: 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#475569", fontSize: 13, fontWeight: 600 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickCount={6}
        />
        <Tooltip
          formatter={(value) => [`${value}점`, "점수"]}
          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
        />
        <Radar
          name="ESG 점수"
          dataKey="score"
          stroke="#059669"
          fill="#059669"
          fillOpacity={0.25}
          strokeWidth={2}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
