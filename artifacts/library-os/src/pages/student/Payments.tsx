import { motion } from "framer-motion";
import { Download, AlertCircle, CheckCircle2, CreditCard, Wallet } from "lucide-react";
import StudentLayout from "@/layouts/StudentLayout";
import { useApi } from "@/hooks/useApi";
import { getStudentMePayments } from "@/lib/api";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const fmtDate = (d: string) => format(new Date(d), "dd MMM yyyy");

export default function StudentPayments() {
  const { data, loading, error } = useApi(getStudentMePayments);
  const payments = data ?? [];

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-muted-foreground">Loading…</div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64 text-sm text-destructive">{error}</div>
      </StudentLayout>
    );
  }

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const hasPending = payments.some((p) => p.status.toLowerCase() !== "paid");

  return (
    <StudentLayout>
      <div className="mb-5">
        <h1 className="text-xl font-bold text-foreground">Payments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your fee history and payment status</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Paid", value: `₹${total.toLocaleString()}`, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Latest Payment", value: payments.length ? `₹${payments[0].amount}` : "₹0", icon: Wallet, color: "text-sky-400", bg: "bg-sky-500/10 border-sky-500/20" },
          { label: "Current Status", value: hasPending ? "Pending" : "Clear", icon: CreditCard, color: hasPending ? "text-amber-400" : "text-emerald-500", bg: hasPending ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className={`bg-card border ${s.bg} rounded-xl p-4`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending fees banner */}
      {hasPending ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-4 flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-400">Pending Payment</p>
            <p className="text-xs text-muted-foreground mt-0.5">You have a pending payment. Please pay at the reception counter or online (coming soon).</p>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-500">All Dues Cleared</p>
            <p className="text-xs text-muted-foreground">No pending fees.</p>
          </div>
        </motion.div>
      )}

      {/* Payment history */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card border border-card-border rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Payment History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Date", "Amount", "Method", "Status", "Receipt"].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No payments yet</td>
                </tr>
              ) : (
                payments.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{fmtDate(p.paymentDate)}</td>
                    <td className="px-4 py-3 font-bold text-emerald-500 text-sm">₹{p.amount}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-secondary border border-border text-secondary-foreground font-medium capitalize">{p.method}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-md border", p.status.toLowerCase() === "paid" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border-amber-500/20")}>{p.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors">
                        <Download className="w-3 h-3" /> Receipt
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pay online CTA */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-card border border-card-border rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold">Pay Online</h3>
            <p className="text-xs text-muted-foreground mt-1">Online payments via Razorpay will be available soon. You can currently pay in cash or UPI at the reception counter.</p>
          </div>
          <Button disabled className="flex-shrink-0 h-9 text-xs gap-2 opacity-60 cursor-not-allowed bg-sky-600">
            <CreditCard className="w-3.5 h-3.5" /> Pay Online (Coming Soon)
          </Button>
        </div>
      </motion.div>
    </StudentLayout>
  );
}
