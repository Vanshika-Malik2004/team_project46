"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { formatDate } from "date-fns";

// Define types for our data
interface ProgressStep {
  severity: string;
  imgUrl: string;
  createdAt: string;
  id: string;
}

interface ChartDataPoint {
  date: string;
  severity: number;
  originalSeverity: string;
}

// Mapping severity values to numbers for chart display
const severityToValue: Record<string, number> = {
  Mild: 1,
  Moderate: 2,
  Severe: 3,
  Critical: 4,
  Extreme: 5,
};

// Custom tooltip implementation to avoid typing issues
const CustomTooltip = ({
  active,
  payload,
  date,
}: TooltipProps<number, string> & { date: string }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="mb-1 text-sm font-medium">
          {formatDate(new Date(date), "MM/dd/yyyy")}
        </div>
        <div className="flex items-center gap-1 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--color-severity)" }}
          />
          <span className="font-medium">Severity:</span>
          <span>{data.originalSeverity}</span>
        </div>
      </div>
    );
  }
  return null;
};

interface SeverityChartProps {
  progressData: ProgressStep[];
}

export function SeverityChart({ progressData }: SeverityChartProps) {
  if (!progressData || progressData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Severity Progression</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-80 items-center justify-center">
            <p className="text-muted-foreground">No severity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform the data for the chart
  const chartData = progressData.map((item) => ({
    date: item.createdAt,
    severity: severityToValue[item.severity] || 0,
    originalSeverity: +item.severity.split("/")[0],
  }));

  // Sort data by date
  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log({
    chartData,
  });

  const chartConfig = {
    severity: {
      label: "Severity",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Progression</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 20,
              }}
            >
              <CartesianGrid vertical={false} />
              {/* <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatDate(new Date(value), "MM/dd")}
              /> */}
              <Tooltip content={<CustomTooltip date={chartData[0].date} />} />
              <Line
                dataKey="originalSeverity"
                name="Severity"
                type="natural"
                stroke="var(--color-severity)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
