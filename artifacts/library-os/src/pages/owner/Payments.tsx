import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, AlertCircle, TrendingUp, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { mockPayments } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Payments() {
  const [search, setSearch] = useState("");
  const filtered = mockPayments.filter(p =>
    p.student.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const total = mockPayments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const pending = mockPayments.filter(p => p.status === "Pending" || p.status === "Overdue").reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Payments"
        description="Track all fee collections and pending dues"
        actions={<Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Record Payment</Button>}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Collected" value={`₹${total.toLocaleString()}`} trend="+₹340 this month" trendUp icon={DollarSign} iconColor="text-emerald-400" iconBg="bg-emerald-500/10" index={0} />
        <StatCard title="Pending Dues" value={`₹${pending.toLocaleString()}`} subtitle={`${mockPayments.filter(p => p.status !== "Paid").length} students`} icon={AlertCircle} iconColor="text-amber-400" iconBg="bg-amber-500/10" index={1} />
        <StatCard title="This Week" value="₹890" trend="+12% vs last week" trendUp icon={TrendingUp} iconColor="text-indigo-400" iconBg="bg-indigo-500/10" index={2} />
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search payments..." className="pl-8 h-8 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["ID", "Student", "Amount", "Method", "Status", "Date", ""].map((h, i) => (
                <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{p.student.split(" ").map((n: string)=>n[0]).join("")}</AvatarFallback></Avatar>
                      <span className="font-medium text-sm">{p.student}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-500">₹{p.amount}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border font-medium">{p.method}</span></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary hover:underline font-medium">Receipt</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
