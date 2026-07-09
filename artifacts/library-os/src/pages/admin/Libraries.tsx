import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Plus } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { mockLibraries } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLibraries() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = mockLibraries.filter(lib => {
    const matchSearch = lib.name.toLowerCase().includes(search.toLowerCase()) || lib.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || lib.status === statusFilter;
    const matchPlan = planFilter === "all" || lib.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Libraries"
        description={`${mockLibraries.length} libraries registered`}
        actions={<Button size="sm" className="gap-1.5 text-xs h-8"><Plus className="w-3.5 h-3.5" /> Add Library</Button>}
      />

      <div className="bg-card border border-card-border rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search libraries..." className="pl-8 h-8 text-sm" data-testid="search-libraries" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-sm" data-testid="filter-status"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="h-8 w-36 text-sm"><SelectValue placeholder="Plan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Starter">Starter</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Library", "Owner", "City", "Plan", "Students", "Status", "MRR", "Joined", ""].map((h, i) => (
                  <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((lib, i) => (
                <motion.tr
                  key={lib.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  data-testid={`row-library-${lib.id}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="w-7 h-7"><AvatarFallback className="text-xs bg-primary/15 text-primary">{lib.name[0]}</AvatarFallback></Avatar>
                      <span className="font-medium">{lib.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lib.owner}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lib.city}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground border border-border font-medium">{lib.plan}</span>
                  </td>
                  <td className="px-4 py-3 font-medium">{lib.students}</td>
                  <td className="px-4 py-3"><StatusBadge status={lib.status} /></td>
                  <td className="px-4 py-3 font-medium text-emerald-500">{lib.mrr}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{lib.joined}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-primary hover:underline font-medium">View</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Showing {filtered.length} of {mockLibraries.length} libraries</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs px-2" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs px-2">Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
