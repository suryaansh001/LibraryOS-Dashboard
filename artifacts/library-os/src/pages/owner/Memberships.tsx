import { useState } from "react";
import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { mockStudents } from "@/data/mockData";
import MembershipBadge from "@/components/MembershipBadge";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const memberships = mockStudents.map(s => ({
  ...s,
  remaining: s.membership === "Daily" ? "0 days" : s.membership === "Weekly" ? "3 days" : s.membership === "Monthly" ? "18 days" : "72 days",
  memberStatus: s.expiryDate < "2024-03-20" ? "Expiring" : s.status === "suspended" ? "Suspended" : s.status === "trial" ? "Trial" : "Active",
}));

export default function Memberships() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = memberships.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || m.memberStatus.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout>
      <PageHeader title="Memberships" description={`${memberships.length} total memberships`} />

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-8 h-8 text-sm" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30">
              {["Student", "Plan", "Start Date", "End Date", "Remaining", "Status", ""].map((h, i) => (
                <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((m, i) => (
                <motion.tr key={m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{m.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{m.name}</p><p className="text-xs text-muted-foreground">{m.id}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><MembershipBadge type={m.membership} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{m.joinDate}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{m.expiryDate}</td>
                  <td className="px-4 py-3 text-sm font-medium">{m.remaining}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.memberStatus} /></td>
                  <td className="px-4 py-3">
                    <Button variant="outline" size="sm" className="h-7 gap-1 text-xs text-primary border-primary/30 hover:bg-primary/10">
                      <RefreshCw className="w-3 h-3" /> Renew
                    </Button>
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
