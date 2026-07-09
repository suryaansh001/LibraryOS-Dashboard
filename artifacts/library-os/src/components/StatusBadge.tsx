import { cn } from "@/lib/utils";

type StatusType = "active" | "suspended" | "trial" | "paid" | "pending" | "overdue" | "Active" | "Paid" | "Pending" | "Overdue" | "Expired" | "Expiring" | string;

const styles: Record<string, string> = {
  active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  Active: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  Paid: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  trial: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Trial: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Expiring: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  suspended: "bg-destructive/15 text-destructive border-destructive/20",
  Suspended: "bg-destructive/15 text-destructive border-destructive/20",
  overdue: "bg-destructive/15 text-destructive border-destructive/20",
  Overdue: "bg-destructive/15 text-destructive border-destructive/20",
  Expired: "bg-destructive/15 text-destructive border-destructive/20",
  Inside: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20",
  Present: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

const labels: Record<string, string> = {
  active: "Active",
  suspended: "Suspended",
  trial: "Trial",
  paid: "Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export default function StatusBadge({ status }: { status: StatusType }) {
  const style = styles[status] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20";
  const label = labels[status] ?? status;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border capitalize", style)}>
      {label}
    </span>
  );
}
