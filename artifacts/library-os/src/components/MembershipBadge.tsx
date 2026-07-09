import { cn } from "@/lib/utils";

type MembershipType = "Daily" | "Weekly" | "Monthly" | "Quarterly" | string;

const styles: Record<string, string> = {
  Daily: "bg-gray-500/15 text-gray-400 border-gray-500/20",
  Weekly: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  Monthly: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  Quarterly: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Annual: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export default function MembershipBadge({ type }: { type: MembershipType }) {
  const style = styles[type] ?? "bg-gray-500/15 text-gray-400 border-gray-500/20";
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border", style)}>
      {type}
    </span>
  );
}
