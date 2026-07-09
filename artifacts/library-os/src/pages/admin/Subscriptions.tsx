import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { mockLibraries } from "@/data/mockData";
import { motion } from "framer-motion";

const subs = mockLibraries.map((lib, i) => ({
  ...lib,
  billing: i % 2 === 0 ? "Monthly" : "Annual",
  start: "Jan 10, 2024",
  nextRenewal: `Mar ${15 + i * 2}, 2024`,
  amount: lib.plan === "Enterprise" ? "$99" : lib.plan === "Professional" ? "$49" : "$19",
}));

export default function AdminSubscriptions() {
  return (
    <DashboardLayout>
      <PageHeader title="Subscriptions" description={`${subs.length} total subscriptions`} />
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Library", "Plan", "Billing", "Start Date", "Next Renewal", "Amount", "Status", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((sub, i) => (
                <motion.tr key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{sub.name}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border font-medium">{sub.plan}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{sub.billing}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{sub.start}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{sub.nextRenewal}</td>
                  <td className="px-4 py-3 font-medium text-emerald-500">{sub.amount}</td>
                  <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-primary hover:underline">Manage</button>
                      <button className="text-xs text-destructive hover:underline">Cancel</button>
                    </div>
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
