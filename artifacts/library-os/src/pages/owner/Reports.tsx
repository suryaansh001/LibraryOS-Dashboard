import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, ClipboardList, Users, CreditCard, Receipt, BarChart2, Loader2, TrendingUp, UserCheck, AlertCircle, Clock } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Area, AreaChart } from "recharts";
import { useApi } from "@/hooks/useApi";
import { getDashboard, type DashboardDTO } from "@/lib/api";
import { format } from "date-fns";

const reports = [
  {
    title: "Attendance Report",
    desc: "Daily and monthly attendance records for all students",
    icon: ClipboardList,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    formats: ["PDF", "CSV"],
    lastGenerated: "Today, 09:00 AM",
  },
  {
    title: "Payment Report",
    desc: "All payment transactions, pending dues and collections",
    icon: CreditCard,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    formats: ["PDF", "CSV", "Excel"],
    lastGenerated: "Yesterday",
  },
  {
    title: "Expense Report",
    desc: "Monthly expense breakdown by category",
    icon: Receipt,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    formats: ["PDF", "Excel"],
    lastGenerated: "Mar 10, 2024",
  },
  {
    title: "Student Report",
    desc: "Full student directory with membership and contact details",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    formats: ["PDF", "CSV"],
    lastGenerated: "Mar 08, 2024",
  },
  {
    title: "Membership Report",
    desc: "Active, expiring, and expired membership overview",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    formats: ["PDF", "CSV"],
    lastGenerated: "Mar 06, 2024",
  },
  {
    title: "Revenue Report",
    desc: "Monthly and quarterly revenue analysis",
    icon: BarChart2,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    formats: ["PDF", "Excel"],
    lastGenerated: "Mar 01, 2024",
  },
];

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

export default function Reports() {
  const { data: dashboard, loading } = useApi<DashboardDTO>(getDashboard);

  const revenue30d = (dashboard?.revenue30d ?? []).map(d => ({ ...d, label: format(new Date(d.date), "dd MMM") }));
  const attendance30d = (dashboard?.attendance30d ?? []).map(d => ({ ...d, label: format(new Date(d.date), "dd MMM") }));

  return (
    <DashboardLayout>
      <PageHeader title="Reports" description="Download and export library data reports" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Today's Check-ins" value={String(dashboard?.todayCheckins ?? 0)} trend={`${dashboard?.currentOccupancy ?? 0} inside now`} trendUp icon={Clock} iconColor="text-blue-400" iconBg="bg-blue-500/10" index={0} />
        <StatCard title="Monthly Revenue" value={`₹${(dashboard?.monthlyRevenue ?? 0).toLocaleString()}`} trend="This month" trendUp icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={1} />
        <StatCard title="Active Students" value={String(dashboard?.activeStudents ?? 0)} trend="Total enrolled" trendUp icon={UserCheck} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={2} />
        <StatCard title="Pending Fees" value={`₹${(dashboard?.pendingFeesAmount ?? 0).toLocaleString()}`} trend={`${dashboard?.pendingFeesCount ?? 0} due`} trendUp={false} icon={AlertCircle} iconColor="text-destructive" iconBg="bg-destructive/10" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Revenue (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenue30d}>
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                    <Tooltip {...TooltipStyle} formatter={(v: number) => [`₹${v}`, "Revenue"]} />
                    <Area type="monotone" dataKey="amount" stroke="hsl(160 84% 39%)" strokeWidth={2} fill="url(#revFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Attendance (Last 30 Days)</CardTitle></CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-[220px] text-sm text-muted-foreground"><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…</div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={attendance30d}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip {...TooltipStyle} formatter={(v: number) => [`${v}`, "Check-ins"]} />
                    <Bar dataKey="count" fill="hsl(239 84% 67%)" radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => {
          const Icon = r.icon;
          return (
            <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`bg-card border ${r.border} rounded-xl p-5 hover:shadow-md transition-all`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${r.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${r.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{r.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Select defaultValue="this-month">
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  {r.formats.map((fmt, j) => {
                    const FmtIcon = fmt === "CSV" ? FileSpreadsheet : FileText;
                    return (
                      <Button key={j} variant="outline" size="sm" className={`h-7 gap-1 text-xs flex-1 border-${r.border}`}>
                        <Download className="w-3 h-3" /> {fmt}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">Last: {r.lastGenerated}</p>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
