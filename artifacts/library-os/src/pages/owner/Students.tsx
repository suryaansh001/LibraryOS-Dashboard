import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Eye, Pencil, Ban } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import MembershipBadge from "@/components/MembershipBadge";
import { mockStudents } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Students() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");

  const filtered = mockStudents.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search) || s.seat.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchMembership = membershipFilter === "all" || s.membership === membershipFilter;
    return matchSearch && matchStatus && matchMembership;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description={`${mockStudents.length} total students`}
        actions={
          <Link href="/students/new">
            <Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Student</Button>
          </Link>
        }
      />

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, seat..." className="pl-8 h-8 text-sm" data-testid="search-students" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select value={membershipFilter} onValueChange={setMembershipFilter}>
            <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Membership" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Student", "Phone", "Seat", "Membership", "Status", "Payment", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`row-student-${s.id}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-8 h-8 flex-shrink-0"><AvatarFallback className="text-xs bg-primary/15 text-primary">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-sm">{s.phone}</td>
                  <td className="px-4 py-3"><span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{s.seat}</span></td>
                  <td className="px-4 py-3"><MembershipBadge type={s.membership} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  <td className="px-4 py-3"><StatusBadge status={s.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7" data-testid={`actions-student-${s.id}`}><MoreHorizontal className="w-3.5 h-3.5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        <Link href={`/students/${s.id}`}><DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Eye className="w-3.5 h-3.5" /> View Profile</DropdownMenuItem></Link>
                        <DropdownMenuItem className="gap-2 text-xs cursor-pointer"><Pencil className="w-3.5 h-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-xs text-destructive cursor-pointer"><Ban className="w-3.5 h-3.5" /> Suspend</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {mockStudents.length} students</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2">Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
