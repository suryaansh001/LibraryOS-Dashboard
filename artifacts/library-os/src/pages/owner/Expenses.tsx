import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, TrendingUp, Receipt, Percent, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { mockExpenses } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const expenseByCategory = [
  { name: "Rent", value: 1200, color: "hsl(239 84% 67%)" },
  { name: "Staff", value: 580, color: "hsl(160 84% 39%)" },
  { name: "Electricity", value: 140, color: "hsl(38 92% 50%)" },
  { name: "Internet", value: 60, color: "hsl(280 67% 60%)" },
  { name: "Other", value: 160, color: "hsl(215 15% 55%)" },
];

const monthlyExpenses = [
  { month: "Oct", expenses: 1950 }, { month: "Nov", expenses: 2100 }, { month: "Dec", expenses: 2300 },
  { month: "Jan", expenses: 2200 }, { month: "Feb", expenses: 2050 }, { month: "Mar", expenses: 2140 },
];

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

export default function Expenses() {
  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.amount, 0);
  return (
    <DashboardLayout>
      <PageHeader title="Expenses" description="Track and manage library expenses" actions={<Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Expense</Button>} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Revenue" value="₹4,820" trend="+₹340" trendUp icon={TrendingUp} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={0} />
        <StatCard title="Expenses" value={`₹${totalExpenses.toLocaleString()}`} trend="-₹80 vs last month" trendUp icon={TrendingDown} iconColor="text-destructive" iconBg="bg-destructive/10" index={1} />
        <StatCard title="Net Profit" value="₹3,480" trend="+72% margin" trendUp icon={Receipt} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={2} />
        <StatCard title="Margin" value="72%" trend="Healthy" trendUp icon={Percent} iconColor="text-blue-400" iconBg="bg-blue-500/10" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">By Category</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {expenseByCategory.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip {...TooltipStyle} formatter={(v: number) => [`₹${v}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {expenseByCategory.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: e.color }} />
                    <span className="text-muted-foreground flex-1">{e.name}</span>
                    <span className="font-medium">₹{e.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 16%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(215 15% 55%)" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} />
                  <Tooltip {...TooltipStyle} formatter={(v: number) => [`₹${v}`, "Expenses"]} />
                  <Bar dataKey="expenses" fill="hsl(0 72% 51%)" radius={[4,4,0,0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border"><p className="text-sm font-medium">Recent Expenses</p></div>
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border bg-muted/30">
            {["ID", "Category", "Description", "Amount", "Date", "Receipt"].map((h, i) => (
              <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {mockExpenses.map((e, i) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.id}</td>
                <td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded-md bg-secondary border border-border text-secondary-foreground font-medium">{e.category}</span></td>
                <td className="px-4 py-2.5 text-sm">{e.description}</td>
                <td className="px-4 py-2.5 font-bold text-destructive">₹{e.amount}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{e.date}</td>
                <td className="px-4 py-2.5">
                  {e.receipt
                    ? <span className="text-xs text-emerald-500 font-medium">Yes</span>
                    : <span className="text-xs text-muted-foreground">No</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  );
}
