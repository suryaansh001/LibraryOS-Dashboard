import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogIn, LogOut, Loader2, CheckCircle2, Plus } from "lucide-react";
import { Link } from "wouter";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import MembershipBadge from "@/components/MembershipBadge";
import StatusBadge from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { searchStudents, manualCheckIn, manualCheckOut, type StudentListItemDTO } from "@/lib/api";

export default function ReceptionistSearch() {
  const [query, setQuery] = useState("");
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: results, loading, error } = useApi<StudentListItemDTO[]>(
    () => (query.length > 1 ? searchStudents(query) : Promise.resolve([])),
    [query]
  );

  const toggle = async (student: StudentListItemDTO) => {
    const isIn = checkedIn.has(student.id);
    setBusy(student.id);
    setActionError(null);
    setFeedback(null);
    try {
      if (isIn) {
        await manualCheckOut(student.id);
        setCheckedIn(prev => {
          const next = new Set(prev);
          next.delete(student.id);
          return next;
        });
        setFeedback(`${student.name} checked out`);
      } else {
        await manualCheckIn(student.id);
        setCheckedIn(prev => new Set(prev).add(student.id));
        setFeedback(`${student.name} checked in`);
      }
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <ReceptionistLayout>
      <div className="max-w-lg mx-auto space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground mb-1">Search Student</h1>
            <p className="text-sm text-muted-foreground">Search by name, phone, seat or ID</p>
          </div>
          <Link href="/receptionist/students/new">
            <Button size="sm" className="gap-1.5 text-xs h-8 flex-shrink-0">
              <Plus className="w-3.5 h-3.5" /> Add Student
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="pl-11 h-12 text-base"
            data-testid="search-input"
            autoFocus
          />
        </div>

        {actionError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" data-testid="action-error">
            {actionError}
          </div>
        )}
        {feedback && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-sm text-emerald-500" data-testid="action-feedback">
            <CheckCircle2 className="w-4 h-4" /> {feedback}
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
            </motion.div>
          )}
          {!loading && (results?.length ?? 0) > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="space-y-2">
              {results!.map((s, i) => {
                const isIn = checkedIn.has(s.id);
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="bg-card border border-card-border rounded-xl p-4 flex items-center gap-4">
                    <Avatar className="w-11 h-11 flex-shrink-0">
                      <AvatarFallback className="bg-primary/15 text-primary font-semibold">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.id} · Seat {s.seatNumber ?? "—"}</p>
                      <div className="flex gap-2 mt-1.5">
                        <MembershipBadge type={s.membershipType ?? "—"} />
                        <StatusBadge status={s.status} />
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggle(s)}
                      disabled={busy === s.id}
                      className={`flex-shrink-0 h-9 gap-1.5 text-xs font-semibold ${isIn ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}
                      data-testid={`btn-checkin-${s.id}`}
                    >
                      {busy === s.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : isIn ? <><LogOut className="w-3.5 h-3.5" /> Check Out</> : <><LogIn className="w-3.5 h-3.5" /> Check In</>}
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {!loading && !error && query.length > 1 && (results?.length ?? 0) === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No students found for "{query}"</p>
          </motion.div>
        )}

        {query.length === 0 && (
          <div className="text-center py-12 text-muted-foreground/40">
            <Search className="w-12 h-12 mx-auto mb-3" />
            <p className="text-sm">Start typing to search</p>
          </div>
        )}
      </div>
    </ReceptionistLayout>
  );
}
