import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Users, UserCheck, DollarSign, AlertCircle,
  ClipboardCheck, Plus, QrCode, Wallet, Grid3X3, Loader2
} from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import ActivityFeed from "@/components/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useApi } from "@/hooks/useApi";
import { getDashboard, type DashboardDTO } from "@/lib/api";
import { useRole } from "@/context/RoleContext";
import { format } from "date-fns";

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

const quickActions = [
  { label: "Add Student", icon: Plus, href: "/students/new", color: "bg-primary hover:bg-primary/90 text-primary-foreground" },
  { label: "Scan QR", icon: QrCode, href: "/attendance", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  { label: "Record Payment", icon: Wallet, href: "/payments", color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { label: "Manage Seats", icon: Grid3X3, href: "/seats", color: "bg-amber-600 hover:bg-amber-700 text-white" },
];

function formatRevenue(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function ChartSkeleton() {
  return (
    <div className="h-[180px] flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
    </div>
  );
}

export default function OwnerDashboard() {
  const { session } = useRole();
  const { data, loading } = useApi<DashboardDTO>(getDashboard);

  const today = format(new Date(), "EEEE, MMMM d, yyyy");
  const libraryName = session?.library?.name ?? "Your Library";

  const occupancyPct = data
    ? Math.round((data.currentOccupancy / Math.max(data.capacity, 1)) * 100)
    : 0;

  // Normalise attendance chart data: backend returns { date, count }
  const attendanceChartData = (data?.attendance30d ?? []).map((d) => ({
    day: format(new Date(d.date), "MMM d"),
    count: d.count,
  }));

  // Normalise revenue chart data: backend returns { date, amount }
  const revenueChartData = (data?.revenue30d ?? []).map((d) => ({
    month: format(new Date(d.date), "MMM d"),
    revenue: d.amount,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description={`${libraryName} · ${today}`}
        actions={
          <>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${data ? "text-emerald-500" : loading ? "text-muted-foreground" : "text-destructive"}`}>
              <span>{data ? "🟢" : loading ? "⏳" : "🔴"}</span>
              <span>{data ? "Live" : loading ? "Loading…" : "Offline"}</span>
            </div>
            <Link href="/students/new">
              <Button size="sm" className="gap-1.5 text-xs h-8">
                <Plus className="w-3.5 h-3.5" /> Add Student
              </Button>
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Today's Check-ins"
          value={loading ? "—" : String(data?.todayCheckins ?? 0)}
          icon={ClipboardCheck}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          index={0}
        />
        <StatCard
          title="Currently Inside"
          value={loading ? "—" : String(data?.currentOccupancy ?? 0)}
          subtitle={`of ${data?.capacity ?? "—"} capacity`}
          icon={UserCheck}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          live
          index={1}
        />
        <StatCard
          title="Active Students"
          value={loading ? "—" : String(data?.activeStudents ?? 0)}
          icon={Users}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          index={2}
        />
        <StatCard
          title="Monthly Revenue"
          value={loading ? "—" : formatRevenue(data?.monthlyRevenue ?? 0)}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          index={3}
        />
        <StatCard
          title="Pending Fees"
          value={loading ? "—" : formatRevenue(data?.pendingFeesAmount ?? 0)}
          subtitle={data ? `${data.pendingFeesCount} student${data.pendingFeesCount !== 1 ? "s" : ""}` : undefined}
          icon={AlertCircle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          index={4}
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card border border-card-border rounded-xl p-5"
        >
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Current Occupancy
          </p>
          <p className="text-2xl font-bold text-foreground mb-1">
            {loading ? "—" : data?.currentOccupancy ?? 0}{" "}
            <span className="text-sm font-normal text-muted-foreground">/ {data?.capacity ?? "—"}</span>
          </p>
          <Progress value={occupancyPct} className="h-1.5 mt-2" />
          <p className="text-xs text-muted-foreground mt-1.5">{occupancyPct}% occupied</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }}>
              <Link href={a.href}>
                <button
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-medium text-sm transition-all active:scale-95 ${a.color}`}
                  data-testid={`quick-action-${a.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="w-4 h-4" /> {a.label}
                </button>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Attendance — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <ChartSkeleton /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={attendanceChartData}>
                    <defs>
                      <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip {...TooltipStyle} formatter={(v: number) => [v, "Students"]} />
                    <Area type="monotone" dataKey="count" stroke="hsl(239 84% 67%)" fill="url(#aGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue — Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <ChartSkeleton /> : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                    <Tooltip {...TooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                    <Bar dataKey="revenue" fill="hsl(239 84% 67%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <ActivityFeed items={data?.recentActivity ?? []} loading={loading} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}