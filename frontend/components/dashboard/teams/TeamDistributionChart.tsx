"use client"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { teamDistributionsData } from "./dommyTeamDistributionsData";
import { useTheme } from "next-themes";

function TeamDistributionChart() {
  const { resolvedTheme } = useTheme()
  return (
    <ResponsiveContainer width={"100%"} height={150} >
      <PieChart  >
        <Tooltip
          wrapperClassName='rounded-md'
          contentStyle={resolvedTheme === "dark" ? { background: "#27272a" } : { background: "#e4e4e7" }}
          labelClassName='dark:text-zinc-100 text-zinc-800  '
        />
        <Pie data={teamDistributionsData} dataKey={"value"} nameKey={"name"} />

      </PieChart>
    </ResponsiveContainer>

  )
}

export default TeamDistributionChart