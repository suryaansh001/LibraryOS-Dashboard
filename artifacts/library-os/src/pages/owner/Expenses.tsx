import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingDown, TrendingUp, Receipt, Percent, Plus, Loader2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { getExpenses, createExpense, type ExpenseListItemDTO, type ExpenseCategory } from "@/lib/api";
import { format } from "date-fns";

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: "rent", label: "Rent" },
  { value: "electricity", label: "Electricity" },
  { value: "internet", label: "Internet" },
  { value: "salary", label: "Salary" },
  { value: "maintenance", label: "Maintenance" },
  { value: "miscellaneous", label: "Miscellaneous" },
  { value: "supplies", label: "Supplies" },
  { value: "marketing", label: "Marketing" },
  { value: "other", label: "Other" },
];

const CATEGORY_COLORS: Record<string, string> = {
  rent: "hsl(239 84% 67%)",
  salary: "hsl(160 84% 39%)",
  electricity: "hsl(38 92% 50%)",
  internet: "hsl(280 67% 60%)",
  maintenance: "hsl(0 72% 51%)",
  miscellaneous: "hsl(215 15% 55%)",
  supplies: "hsl(199 89% 48%)",
  marketing: "hsl(330 81% 60%)",
  other: "hsl(215 15% 55%)",
};

const TooltipStyle = {
  contentStyle: { background: "hsl(222 42% 10%)", border: "1px solid hsl(220 30% 16%)", borderRadius: 8, fontSize: 12 },
  labelStyle: { color: "hsl(215 20% 90%)" },
};

function buildCategoryData(expenses: ExpenseListItemDTO[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.category, (map.get(e.category) ?? 0) + e.amount);
  }
  return Array.from(map.entries()).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: CATEGORY_COLORS[name] ?? CATEGORY_COLORS.other,
  }));
}

function buildMonthlyData(expenses: ExpenseListItemDTO[]) {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const key = format(new Date(e.expenseDate), "MMM");
    map.set(key, (map.get(key) ?? 0) + e.amount);
  }
  return Array.from(map.entries()).map(([month, expenses]) => ({ month, expenses }));
}

function AddExpenseDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>("rent");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setSubmitting(true);
    try {
      await createExpense({
        category,
        amount: Number(amount),
        description: description || undefined,
        expenseDate: new Date().toISOString().slice(0, 10),
      });
      toast({ title: "Expense added", description: `₹${amount} for ${category}` });
      setOpen(false);
      setAmount("");
      setDescription("");
      onSuccess();
    } catch (err) {
      toast({ title: "Failed to add expense", description: err instanceof Error ? err.message : "An error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Expense</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)} className="w-full h-9 text-sm bg-background border border-input rounded-md px-3 text-foreground" required>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Amount (₹)</Label>
            <Input type="number" min="1" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" className="h-9 text-sm" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Monthly rent payment" className="h-9 text-sm" />
          </div>
          <Button type="submit" className="w-full h-9 text-sm gap-1.5" disabled={submitting || !amount}>
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Add Expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Expenses() {
  const { data: expenses, loading, refetch } = useApi<ExpenseListItemDTO[]>(getExpenses);
  const list = expenses ?? [];
  const totalExpenses = list.reduce((sum, e) => sum + e.amount, 0);
  const expenseByCategory = buildCategoryData(list);
  const monthlyExpenses = buildMonthlyData(list);

  return (
    <DashboardLayout>
      <PageHeader title="Expenses" description="Track and manage library expenses" actions={<AddExpenseDialog onSuccess={() => refetch()} />} />

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
                {expenseByCategory.length === 0 && <p className="text-xs text-muted-foreground">No expenses recorded</p>}
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
              {monthlyExpenses.length === 0 && <p className="text-xs text-muted-foreground text-center">No expenses recorded</p>}
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
            {loading && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">Loading expenses…</td></tr>
            )}
            {!loading && list.map((e, i) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.id}</td>
                <td className="px-4 py-2.5"><span className="text-xs px-2 py-0.5 rounded-md bg-secondary border border-border text-secondary-foreground font-medium capitalize">{e.category}</span></td>
                <td className="px-4 py-2.5 text-sm">{e.description ?? "—"}</td>
                <td className="px-4 py-2.5 font-bold text-destructive">₹{e.amount}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{format(new Date(e.expenseDate), "dd MMM yyyy")}</td>
                <td className="px-4 py-2.5">
                  <span className="text-xs text-muted-foreground">—</span>
                </td>
              </tr>
            ))}
            {!loading && list.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">No expenses found</td></tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  );
}
