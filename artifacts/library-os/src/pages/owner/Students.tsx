import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, MoreHorizontal, Eye, Ban, Loader2, Users } from "lucide-react";
import { Link } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApi } from "@/hooks/useApi";
import { listStudents, type StudentListItemDTO } from "@/lib/api";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Students() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: students, loading, error } = useApi<StudentListItemDTO[]>(
    () => listStudents({ search: search || undefined, status: statusFilter !== "all" ? statusFilter : undefined, limit: 50 }),
    [search, statusFilter, page]
  );

  const filtered = (students ?? []).filter(s => {
    if (membershipFilter !== "all" && s.membershipType?.toLowerCase() !== membershipFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Students"
        description={loading ? "Loading…" : `${filtered.length} students`}
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
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or phone…"
              className="pl-8 h-8 text-sm"
              data-testid="search-students"
            />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="h-8 w-32 text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={membershipFilter} onValueChange={setMembershipFilter}>
            <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Membership" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading students…</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-destructive font-medium">Failed to load students</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">No students found</p>
            <Link href="/students/new">
              <Button variant="outline" size="sm" className="mt-3 gap-1.5 text-xs">
                <Plus className="w-3.5 h-3.5" /> Add first student
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Student", "Phone", "Seat", "Membership", "Status", ""].map((h, i) => (
                    <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    data-testid={`row-student-${s.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs bg-primary/15 text-primary">{getInitials(s.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{s.id.slice(0, 8)}…</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-sm">{s.phone}</td>
                    <td className="px-4 py-3">
                      {s.seatNumber
                        ? <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{s.seatNumber}</span>
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      {s.membershipStatus
                        ? <StatusBadge status={s.membershipStatus} />
                        : <span className="text-xs text-muted-foreground">—</span>
                      }
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7" data-testid={`actions-student-${s.id}`}>
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <Link href={`/students/${s.id}`}>
                            <DropdownMenuItem className="gap-2 text-xs cursor-pointer">
                              <Eye className="w-3.5 h-3.5" /> View Profile
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="gap-2 text-xs text-destructive cursor-pointer">
                            <Ban className="w-3.5 h-3.5" /> Suspend
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>{loading ? "…" : `Showing ${filtered.length} students`}</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled={filtered.length < 50} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
