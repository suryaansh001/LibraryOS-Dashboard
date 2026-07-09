import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, UserCheck, DollarSign, AlertCircle, ClipboardCheck, Building2, Plus, QrCode, Wallet, Grid3X3 } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import ActivityFeed from "@/components/ActivityFeed";
import { attendanceData, revenueData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

const quickActions = [
  { label: "Add Student", icon: Plus, href: "/students/new", color: "bg-primary hover:bg-primary/90 text-primary-foreground" },
  { label: "Scan QR", icon: QrCode, href: "/attendance", color: "bg-emerald-600 hover:bg-emerald-700 text-white" },
  { label: "Record Payment", icon: Wallet, href: "/payments", color: "bg-blue-600 hover:bg-blue-700 text-white" },
  { label: "Assign Seat", icon: Grid3X3, href: "/seats", color: "bg-amber-600 hover:bg-amber-700 text-white" },
];

export default function OwnerDashboard() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Dashboard"
        description="ReadSpace Pro · Tuesday, March 12, 2024"
        actions={
          <Link href="/students/new">
            <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Student</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard title="Today's Attendance" value="47" trend="+5 vs yesterday" trendUp icon={ClipboardCheck} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={0} />
        <StatCard title="Currently Inside" value="23" subtitle="of 80 capacity" icon={UserCheck} iconColor="text-blue-400" iconBg="bg-blue-500/10" live index={1} />
        <StatCard title="Active Students" value="312" trend="+8 this month" trendUp icon={Users} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={2} />
        <StatCard title="Monthly Revenue" value="₹4,820" trend="+₹340 vs last month" trendUp icon={DollarSign} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={3} />
        <StatCard title="Pending Fees" value="₹1,240" subtitle="8 students" icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-500/10" index={4} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-card-border rounded-xl p-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Current Occupancy</p>
          <p className="text-2xl font-bold text-foreground mb-1">23 <span className="text-sm font-normal text-muted-foreground">/ 80</span></p>
          <Progress value={28} className="h-1.5 mt-2" />
          <p className="text-xs text-muted-foreground mt-1.5">28% occupied</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {quickActions.map((a, i) => {
          const Icon = a.icon;
          return (
            <motion.div key={a.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }}>
              <Link href={a.href}>
                <button className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl font-medium text-sm transition-all active:scale-95 ${a.color}`} data-testid={`quick-action-${a.label.toLowerCase().replace(" ", "-")}`}>
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
              <CardTitle className="text-sm font-medium">Attendance — Last 12 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} domain={[0, 60]} />
                  <Tooltip {...TooltipStyle} formatter={(v: number) => [v, "Students"]} />
                  <Area type="monotone" dataKey="count" stroke="hsl(239 84% 67%)" fill="url(#aGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Revenue — Last 12 Months</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip {...TooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} />
                  <Bar dataKey="revenue" fill="hsl(239 84% 67%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0 pb-2">
              <ActivityFeed />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
