"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "January", vintage: 150, clutch: 120, zardosi: 90 },
  { month: "February", vintage: 200, clutch: 180, zardosi: 110 },
  { month: "March", vintage: 220, clutch: 170, zardosi: 150 },
  { month: "April", vintage: 140, clutch: 90, zardosi: 120 },
  { month: "May", vintage: 190, clutch: 210, zardosi: 160 },
  { month: "June", vintage: 230, clutch: 250, zardosi: 190 },
];

const chartConfig = {
  vintage: {
    label: "Vintage",
    color: "hsl(var(--chart-1))", // A calm blue shade
  },
  clutch: {
    label: "Clutch",
    color: "hsl(var(--chart-2))", // A vibrant pink-red shade
  },
  zardosi: {
    label: "Zardosi",
    color: "hsl(var(--chart-3))", // A fresh green shade
  },
} satisfies ChartConfig;

export function TotalSalesChart() {
  return (
    <Card className="w-full lg:flex-1">
      <CardHeader>
        <CardTitle>Total Sales</CardTitle>
        <CardDescription>
          Showing total sales for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[250px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.5}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillVintage" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-vintage)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-vintage)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillClutch" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-clutch)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-clutch)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillZardosi" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-zardosi)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-zardosi)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="vintage"
              type="natural"
              fill="url(#fillVintage)"
              fillOpacity={0.4}
              stroke="var(--color-vintage)"
              stackId="a"
            />
            <Area
              dataKey="clutch"
              type="natural"
              fill="url(#fillClutch)"
              fillOpacity={0.4}
              stroke="var(--color-clutch)"
              stackId="a"
            />
            <Area
              dataKey="zardosi"
              type="natural"
              fill="url(#fillZardosi)"
              fillOpacity={0.4}
              stroke="var(--color-zardosi)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
