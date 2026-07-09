import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Building2, TrendingUp, CreditCard, FlaskConical } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatCard from "@/components/StatCard";
import PageHeader from "@/components/PageHeader";
import { adminRevenueData, newLibrariesData, subscriptionGrowthData, mockLibraries } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";

const pendingRenewals = [
  { library: "ReadSpace Pro", plan: "Professional", renewal: "Mar 20, 2024", amount: "$49" },
  { library: "StudyHub Bangalore", plan: "Enterprise", renewal: "Mar 22, 2024", amount: "$99" },
  { library: "Scholar Hub Pune", plan: "Starter", renewal: "Mar 25, 2024", amount: "$19" },
  { library: "Focus Den Chennai", plan: "Professional", renewal: "Mar 28, 2024", amount: "$49" },
];

const CustomTooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
  itemStyle: { color: "hsl(215 15% 55%)" },
};

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <PageHeader title="Platform Overview" description="Real-time metrics across all libraries" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Libraries" value="247" trend="+12 this month" trendUp icon={Building2} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={0} />
        <StatCard title="Monthly Revenue" value="$18,420" trend="+8.3% vs last month" trendUp icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={1} />
        <StatCard title="Active Subscriptions" value="189" trend="+15% this quarter" trendUp icon={CreditCard} iconColor="text-blue-400" iconBg="bg-blue-500/10" index={2} />
        <StatCard title="Trial Libraries" value="23" trend="-2 this week" trendUp={false} icon={FlaskConical} iconColor="text-amber-400" iconBg="bg-amber-500/10" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={adminRevenueData}>
                  <defs>
                    <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip {...CustomTooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(239 84% 67%)" fill="url(#rGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">New Libraries</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={newLibrariesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip {...CustomTooltipStyle} formatter={(v: number) => [v, "Libraries"]} />
                  <Bar dataKey="count" fill="hsl(239 84% 67%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Subscription Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={subscriptionGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                <Tooltip {...CustomTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Line type="monotone" dataKey="active" stroke="hsl(239 84% 67%)" strokeWidth={2} dot={false} name="Active" />
                <Line type="monotone" dataKey="trial" stroke="hsl(38 92% 50%)" strokeWidth={2} dot={false} name="Trial" />
                <Line type="monotone" dataKey="cancelled" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={false} name="Cancelled" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Latest Libraries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Library</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2 hidden sm:table-cell">Plan</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Status</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">MRR</th>
                  </tr></thead>
                  <tbody>
                    {mockLibraries.slice(0, 6).map((lib) => (
                      <tr key={lib.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <div>
                            <p className="font-medium text-sm">{lib.name}</p>
                            <p className="text-xs text-muted-foreground">{lib.owner} · {lib.city}</p>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell text-sm text-muted-foreground">{lib.plan}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={lib.status} /></td>
                        <td className="px-4 py-2.5 text-right font-medium text-sm">{lib.mrr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending Renewals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">Library</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2 hidden sm:table-cell">Renewal</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Amount</th>
                    <th className="text-right text-xs font-medium text-muted-foreground px-4 py-2">Action</th>
                  </tr></thead>
                  <tbody>
                    {pendingRenewals.map((r, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5">
                          <p className="font-medium text-sm">{r.library}</p>
                          <p className="text-xs text-muted-foreground">{r.plan}</p>
                        </td>
                        <td className="px-4 py-2.5 hidden sm:table-cell text-xs text-muted-foreground">{r.renewal}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-sm">{r.amount}</td>
                        <td className="px-4 py-2.5 text-right">
                          <button className="text-xs text-primary hover:underline font-medium">Remind</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
