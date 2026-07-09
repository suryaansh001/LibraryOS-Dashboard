import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, Calendar, Percent } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { adminRevenueData } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

const recentTransactions = [
  { library: "StudyHub Bangalore", plan: "Enterprise", amount: "$99", date: "Mar 12, 2024", method: "Card" },
  { library: "ReadSpace Pro", plan: "Professional", amount: "$49", date: "Mar 10, 2024", method: "Bank" },
  { library: "Focus Den Chennai", plan: "Professional", amount: "$49", date: "Mar 08, 2024", method: "Card" },
  { library: "Scholar Hub Pune", plan: "Starter", amount: "$19", date: "Mar 07, 2024", method: "Card" },
  { library: "KnowledgeNest Hyderabad", plan: "Enterprise", amount: "$99", date: "Mar 05, 2024", method: "Bank" },
];

export default function AdminRevenue() {
  return (
    <DashboardLayout>
      <PageHeader title="Revenue" description="Platform-wide financial overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Revenue" value="$142,300" icon={DollarSign} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={0} />
        <StatCard title="This Month" value="$18,420" trend="+8.3%" trendUp icon={TrendingUp} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={1} />
        <StatCard title="Last Month" value="$17,010" icon={Calendar} iconColor="text-blue-400" iconBg="bg-blue-500/10" index={2} />
        <StatCard title="YoY Growth" value="+34%" trend="vs last year" trendUp icon={Percent} iconColor="text-purple-400" iconBg="bg-purple-500/10" index={3} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={adminRevenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(239 84% 67%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(239 84% 67%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip {...TooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(239 84% 67%)" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="h-full">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Recent Transactions</CardTitle></CardHeader>
            <div className="divide-y divide-border/50">
              {recentTransactions.map((t, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate max-w-[140px]">{t.library}</p>
                    <p className="text-sm font-bold text-emerald-500">{t.amount}</p>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-muted-foreground">{t.plan} · {t.method}</p>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
