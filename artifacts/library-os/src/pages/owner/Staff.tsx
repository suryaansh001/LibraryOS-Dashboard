import { motion } from "framer-motion";
import { Plus, MoreHorizontal, UserCog, Phone, Mail } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { mockStaff } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const roleColor: Record<string, string> = {
  Manager: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  Receptionist: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  Security: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

export default function Staff() {
  return (
    <DashboardLayout>
      <PageHeader title="Staff" description={`${mockStaff.length} team members`} actions={<Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Staff</Button>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStaff.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-card border border-card-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary/15 text-primary text-base font-semibold">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem className="text-xs gap-2"><UserCog className="w-3.5 h-3.5" /> Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-xs gap-2 text-destructive">Deactivate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{s.name}</h3>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md border ${roleColor[s.role] ?? "bg-secondary text-secondary-foreground border-border"}`}>{s.role}</span>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {s.phone}</div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" /> {s.email}</div>
            </div>
            <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
              <StatusBadge status={s.status} />
              <span className="text-xs text-muted-foreground">Since {s.joinDate}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
