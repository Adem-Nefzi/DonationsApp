"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  BarChart3,
  TrendingUp,
  Users,
  Building,
  ShoppingBag,
  Calendar,
} from "lucide-react";

export default function AdminStats() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Data for the chart
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const users = [120, 150, 180, 210, 250, 300, 350, 400, 450, 500, 600, 700];
    const associations = [5, 8, 10, 12, 15, 18, 22, 25, 30, 35, 38, 42];
    const donations = [30, 45, 60, 75, 90, 110, 130, 150, 180, 210, 240, 280];

    // Chart configuration
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...users) * 1.2;
    const barWidth = chartWidth / months.length / 4;
    const barSpacing = barWidth / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle =
      theme === "dark" ? "hsl(var(--border))" : "hsl(var(--border))";
    ctx.stroke();

    // Draw grid lines
    const gridLines = 5;
    ctx.textAlign = "right";
    ctx.font = "10px sans-serif";
    ctx.fillStyle =
      theme === "dark"
        ? "hsl(var(--muted-foreground))"
        : "hsl(var(--muted-foreground))";

    for (let i = 0; i <= gridLines; i++) {
      const y = canvas.height - padding - (i * chartHeight) / gridLines;
      const value = Math.round((i * maxValue) / gridLines);

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.strokeStyle =
        theme === "dark"
          ? "hsl(var(--border) / 0.3)"
          : "hsl(var(--border) / 0.3)";
      ctx.stroke();

      ctx.fillText(value.toString(), padding - 5, y + 3);
    }

    // Draw month labels
    ctx.textAlign = "center";
    months.forEach((month, i) => {
      const x =
        padding +
        (i * chartWidth) / months.length +
        chartWidth / months.length / 2;
      ctx.fillText(month, x, canvas.height - padding + 15);
    });

    // Draw legend
    const legendX = canvas.width - padding - 150;
    const legendY = padding + 20;

    // Users legend
    ctx.fillStyle = "hsl(221.2, 83.2%, 53.3%)";
    ctx.fillRect(legendX, legendY, 15, 10);
    ctx.fillStyle =
      theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))";
    ctx.textAlign = "left";
    ctx.fillText("Users", legendX + 20, legendY + 8);

    // Associations legend
    ctx.fillStyle = "hsl(291.2, 83.2%, 53.3%)";
    ctx.fillRect(legendX, legendY + 20, 15, 10);
    ctx.fillStyle =
      theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))";
    ctx.fillText("Associations", legendX + 20, legendY + 28);

    // Donations legend
    ctx.fillStyle = "hsl(47.9, 95.8%, 53.1%)";
    ctx.fillRect(legendX, legendY + 40, 15, 10);
    ctx.fillStyle =
      theme === "dark" ? "hsl(var(--foreground))" : "hsl(var(--foreground))";
    ctx.fillText("Donations", legendX + 20, legendY + 48);

    // Draw bars
    months.forEach((_, i) => {
      const x1 = padding + (i * chartWidth) / months.length + barSpacing;
      const x2 = x1 + barWidth + barSpacing;
      const x3 = x2 + barWidth + barSpacing;

      // User bars
      const userHeight = (users[i] / maxValue) * chartHeight;
      ctx.fillStyle = "hsl(221.2, 83.2%, 53.3%)";
      ctx.fillRect(
        x1,
        canvas.height - padding - userHeight,
        barWidth,
        userHeight
      );

      // Association bars
      const associationHeight = (associations[i] / maxValue) * chartHeight;
      ctx.fillStyle = "hsl(291.2, 83.2%, 53.3%)";
      ctx.fillRect(
        x2,
        canvas.height - padding - associationHeight,
        barWidth,
        associationHeight
      );

      // Donation bars
      const donationHeight = (donations[i] / maxValue) * chartHeight;
      ctx.fillStyle = "hsl(47.9, 95.8%, 53.1%)";
      ctx.fillRect(
        x3,
        canvas.height - padding - donationHeight,
        barWidth,
        donationHeight
      );
    });
  }, [theme]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Associations
            </CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+8%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Donations
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">280</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+18%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Statistics</CardTitle>
          <CardDescription>
            User, association, and donation growth over the past year
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activity
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="font-medium">New User Registration</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  2 hours ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                <span className="font-medium">New Association Added</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  5 hours ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span className="font-medium">Donation Completed</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  8 hours ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="font-medium">Request Approved</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  12 hours ago
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="font-medium">System Update Completed</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  1 day ago
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Top Categories
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Food Security</span>
                  <span className="font-medium">32%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: "32%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Clothing</span>
                  <span className="font-medium">28%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: "28%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Healthcare</span>
                  <span className="font-medium">20%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: "20%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Education</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: "15%" }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Other</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: "5%" }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
