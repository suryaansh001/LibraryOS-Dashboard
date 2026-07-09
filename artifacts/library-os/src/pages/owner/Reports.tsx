import { motion } from "framer-motion";
import { Download, FileText, FileSpreadsheet, ClipboardList, Users, CreditCard, Receipt, BarChart2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export default function Reports() {
  return (
    <DashboardLayout>
      <PageHeader title="Reports" description="Download and export library data reports" />

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
