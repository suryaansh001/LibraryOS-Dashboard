import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const users = [
  { id: 1, name: "Rahul Sharma", email: "rahul@readspace.pro", role: "Owner", library: "ReadSpace Pro", lastActive: "2 min ago", status: "active" },
  { id: 2, name: "Anita Desai", email: "anita@studyhub.com", role: "Owner", library: "StudyHub Bangalore", lastActive: "1 hr ago", status: "active" },
  { id: 3, name: "Sunita Devi", email: "sunita@readspace.pro", role: "Receptionist", library: "ReadSpace Pro", lastActive: "15 min ago", status: "active" },
  { id: 4, name: "Karthik Iyer", email: "karthik@quietzone.in", role: "Owner", library: "Quiet Zone Mumbai", lastActive: "3 hr ago", status: "trial" },
  { id: 5, name: "Priya Nair", email: "priya@focusden.com", role: "Owner", library: "Focus Den Chennai", lastActive: "Yesterday", status: "active" },
  { id: 6, name: "Mohan Kumar", email: "mohan@readspace.pro", role: "Staff", library: "ReadSpace Pro", lastActive: "2 days ago", status: "active" },
  { id: 7, name: "Bhavesh Shah", email: "bhavesh@silentlib.in", role: "Owner", library: "Silent Library Ahmedabad", lastActive: "1 day ago", status: "active" },
];

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <PageHeader title="Users" description={`${users.length} platform users`} actions={<Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Invite User</Button>} />
      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-8 h-8 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["User", "Role", "Library", "Last Active", "Status", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{u.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border font-medium">{u.role}</span></td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{u.library}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{u.lastActive}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  <td className="px-4 py-3"><button className="text-xs text-primary hover:underline">Edit</button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
