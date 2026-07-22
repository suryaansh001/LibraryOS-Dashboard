import { useState } from "react";
import { motion } from "framer-motion";
import { Search, DollarSign, AlertCircle, TrendingUp, Plus, Loader2, Receipt } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useApi } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { listPayments, searchStudents, createPayment, type PaymentListItemDTO, type StudentListItemDTO } from "@/lib/api";
import { format } from "date-fns";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function RecordPaymentDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentListItemDTO | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"cash" | "upi" | "card" | "online">("cash");
  const [status, setStatus] = useState<"paid" | "pending">("paid");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: studentResults } = useApi<StudentListItemDTO[]>(
    () => (studentQuery.length > 1 ? searchStudents(studentQuery) : Promise.resolve([])),
    [studentQuery],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount) return;
    setSubmitting(true);
    try {
      await createPayment({
        studentId: selectedStudent.id,
        amount: Number(amount),
        method,
        status,
        paymentDate: new Date().toISOString().slice(0, 10),
      });
      toast({ title: "Payment recorded", description: `₹${amount} for ${selectedStudent.name}` });
      setOpen(false);
      setSelectedStudent(null);
      setStudentQuery("");
      setAmount("");
      onSuccess();
    } catch (err) {
      toast({ title: "Failed to record payment", description: err instanceof Error ? err.message : "An error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Record Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Student</Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between bg-muted/30 rounded-lg px-3 py-2">
                <span className="text-sm font-medium">{selectedStudent.name}</span>
                <button type="button" onClick={() => setSelectedStudent(null)} className="text-xs text-destructive hover:underline">Change</button>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Input value={studentQuery} onChange={e => setStudentQuery(e.target.value)} placeholder="Search by name or phone…" className="h-9 text-sm" />
                {studentResults && studentResults.length > 0 && (
                  <div className="border border-border rounded-lg max-h-40 overflow-y-auto">
                    {studentResults.map(s => (
                      <button key={s.id} type="button" onClick={() => { setSelectedStudent(s); setStudentQuery(""); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0">
                        {s.name} <span className="text-muted-foreground">({s.phone})</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Amount (₹)</Label>
            <Input type="number" min="1" step="1" value={amount} onChange={e => setAmount(e.target.value)} placeholder="500" className="h-9 text-sm" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Method</Label>
              <select value={method} onChange={e => setMethod(e.target.value as typeof method)} className="w-full h-9 text-sm bg-background border border-input rounded-md px-3 text-foreground" required>
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <select value={status} onChange={e => setStatus(e.target.value as typeof status)} className="w-full h-9 text-sm bg-background border border-input rounded-md px-3 text-foreground" required>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full h-9 text-sm gap-1.5" disabled={submitting || !selectedStudent || !amount}>
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null} Record Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Payments() {
  const [search, setSearch] = useState("");
  const { data: payments, loading, error, refetch } = useApi<PaymentListItemDTO[]>(listPayments);

  const filtered = (payments ?? []).filter(p =>
    p.studentName.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const total = (payments ?? [])
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const pending = (payments ?? [])
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <DashboardLayout>
      <PageHeader
        title="Payments"
        description="Track all fee collections and pending dues"
        actions={<RecordPaymentDialog onSuccess={refetch} />}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Collected"
          value={loading ? "—" : `₹${total.toLocaleString("en-IN")}`}
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          index={0}
        />
        <StatCard
          title="Pending Dues"
          value={loading ? "—" : `₹${pending.toLocaleString("en-IN")}`}
          subtitle={payments ? `${payments.filter(p => p.status === "pending").length} students` : undefined}
          icon={AlertCircle}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
          index={1}
        />
        <StatCard
          title="Total Payments"
          value={loading ? "—" : String(payments?.length ?? 0)}
          icon={TrendingUp}
          iconColor="text-indigo-400"
          iconBg="bg-indigo-500/10"
          index={2}
        />
      </div>

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search payments…"
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading payments…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-destructive">Failed to load payments</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Receipt className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No payments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["ID", "Student", "Amount", "Method", "Status", "Date", ""].map((h, i) => (
                    <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}…</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-7 h-7">
                          <AvatarFallback className="text-xs bg-primary/15 text-primary">{getInitials(p.studentName)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{p.studentName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-500">₹{Number(p.amount).toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border font-medium capitalize">{p.method}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {format(new Date(p.paymentDate), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs text-primary hover:underline font-medium">Receipt</button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
