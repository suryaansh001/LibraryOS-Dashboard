import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, MapPin, QrCode, Ban, ChevronLeft, CreditCard, CalendarDays, Clock, Loader2 } from "lucide-react";
import { Link, useParams } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import MembershipBadge from "@/components/MembershipBadge";
import QrCodeSvg from "@/components/QrCodeSvg";
import { getStudentById, getStudentPayments, getStudentHistory, getStudentIdCard, updateStudentStatus, type StudentResponseDTO, type PaymentListItemDTO, type AttendanceSessionDTO, type StudentIdCardDTO } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m.toString().padStart(2, "0")}m` : `${m}m`;
}

function getEmergencyContact(student: StudentResponseDTO) {
  const cf = student.customFields as Record<string, unknown> | undefined;
  const v = cf?.emergencyContact;
  return typeof v === "string" && v.length > 0 ? v : "—";
}

export default function StudentProfile() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data: student, loading, error, refetch: refetchStudent } = useApi<StudentResponseDTO>(() => getStudentById(id), [id]);
  const { data: payments, refetch: refetchPayments } = useApi<PaymentListItemDTO[]>(() => getStudentPayments(id), [id]);
  const { data: attendance, refetch: refetchHistory } = useApi<AttendanceSessionDTO[]>(() => getStudentHistory(id), [id]);
  const { data: idCard, refetch: refetchIdCard } = useApi<StudentIdCardDTO>(() => getStudentIdCard(id), [id]);

  const [toggling, setToggling] = useState(false);

  const handleToggleStatus = async () => {
    if (!student) return;
    const next = student.status === "active" ? "suspended" : "active";
    setToggling(true);
    try {
      await updateStudentStatus(id, next);
      await Promise.all([refetchStudent(), refetchPayments(), refetchHistory(), refetchIdCard()]);
    } catch (e) {
      console.error(e);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading student…
        </div>
      </DashboardLayout>
    );
  }

  if (error || !student) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-sm text-muted-foreground">{error ?? "Student not found"}</div>
      </DashboardLayout>
    );
  }

  const totalPaid = (payments ?? []).reduce((sum, p) => sum + p.amount, 0);
  const isActive = student.status === "active";

  const quickActions = [
    { label: "Renew Membership", icon: RefreshCw, color: "border-primary/30 text-primary hover:bg-primary/10" },
    { label: "Generate QR Code", icon: QrCode, color: "border-border hover:bg-muted/50" },
    { label: "Record Payment", icon: CreditCard, color: "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center gap-2">
        <Link href="/students">
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="w-3.5 h-3.5" /> Students
          </Button>
        </Link>
        <span className="text-muted-foreground text-xs">/</span>
        <span className="text-xs text-foreground font-medium">{student.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Main */}
        <div className="lg:col-span-3 space-y-5">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-card-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="text-xl bg-primary/15 text-primary font-semibold">{getInitials(student.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
                    <p className="text-sm text-muted-foreground">{student.id}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={student.status} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  {student.membershipType && <MembershipBadge type={student.membershipType} />}
                  {student.seatNumber && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> Seat {student.seatNumber}</span>}
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="w-3 h-3" /> Since {format(new Date(student.createdAt), "dd MMM yyyy")}</span>
                  {student.membershipEndDate && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> Expires {format(new Date(student.membershipEndDate), "dd MMM yyyy")}</span>}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Days Present", value: String((attendance ?? []).length), sub: "Sessions" },
                  { label: "Total Paid", value: `₹${totalPaid.toLocaleString()}`, sub: "All time" },
                  { label: "Remaining", value: student.hoursRemaining != null ? `${student.hoursRemaining} ${student.membershipType?.toLowerCase() === "hourly" ? "hrs" : "days"}` : "—", sub: "Membership" },
                ].map((s, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4 pb-4">
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {(attendance ?? []).slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-foreground">{format(new Date(a.checkInAt), "dd MMM yyyy")} — Checked in at {format(new Date(a.checkInAt), "hh:mm a")}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{a.durationMinutes != null ? formatDuration(a.durationMinutes) : "—"}</span>
                    </div>
                  ))}
                  {(attendance ?? []).length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/30">
                      {["Date", "Check In", "Check Out", "Duration", "Status"].map((h, i) => (
                        <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {(attendance ?? []).map((a, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{format(new Date(a.checkInAt), "dd MMM yyyy")}</td>
                          <td className="px-4 py-2.5 text-sm font-medium">{format(new Date(a.checkInAt), "hh:mm a")}</td>
                          <td className="px-4 py-2.5 text-sm">{a.checkOutAt ? format(new Date(a.checkOutAt), "hh:mm a") : "—"}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.durationMinutes != null ? formatDuration(a.durationMinutes) : "—"}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={a.checkOutAt ? "Completed" : "Present"} /></td>
                        </tr>
                      ))}
                      {(attendance ?? []).length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No attendance records</td></tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-border bg-muted/30">
                      {["ID", "Amount", "Method", "Status", "Date"].map((h, i) => (
                        <th key={i} className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {(payments ?? []).map((p, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                          <td className="px-4 py-2.5 font-semibold text-emerald-500">₹{p.amount}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground capitalize">{p.method}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{format(new Date(p.paymentDate), "dd MMM yyyy")}</td>
                        </tr>
                      ))}
                      {(payments ?? []).length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">No payments recorded</td></tr>
                      )}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="mt-4">
              <Card>
                <CardContent className="pt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground">Current Plan</p><p className="text-sm font-semibold mt-0.5">{student.membershipType ?? "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground">Status</p><div className="mt-0.5">{student.membershipType ? <MembershipBadge type={student.membershipType} /> : "—"}</div></div>
                    <div><p className="text-xs text-muted-foreground">Start Date</p><p className="text-sm font-medium mt-0.5">{format(new Date(student.createdAt), "dd MMM yyyy")}</p></div>
                    <div><p className="text-xs text-muted-foreground">Expiry Date</p><p className="text-sm font-medium mt-0.5">{student.membershipEndDate ? format(new Date(student.membershipEndDate), "dd MMM yyyy") : "—"}</p></div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((a, i) => {
                const Icon = a.icon;
                return (
                  <button key={i} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${a.color}`}>
                    <Icon className="w-3.5 h-3.5" /> {a.label}
                  </button>
                );
              })}
              <button
                onClick={handleToggleStatus}
                disabled={toggling}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-60 ${isActive ? "border-destructive/30 text-destructive hover:bg-destructive/10" : "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"}`}
              >
                {toggling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                {isActive ? "Suspend Student" : "Reactivate Student"}
              </button>
            </CardContent>
          </Card>

          {idCard && (
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm font-medium flex items-center gap-1.5"><QrCode className="w-3.5 h-3.5" /> ID Card</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-3 flex items-center gap-3">
                  <QrCodeSvg data={idCard.qrToken} size={72} className="rounded" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{idCard.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{idCard.libraryName}</p>
                    {idCard.seatNumber && <p className="text-xs text-muted-foreground">Seat {idCard.seatNumber}</p>}
                  </div>
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-xs text-muted-foreground">Membership</span><span className="text-xs font-medium">{idCard.membershipType ?? "—"}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-muted-foreground">Expires</span><span className="text-xs font-medium">{idCard.membershipEndDate ? format(new Date(idCard.membershipEndDate), "dd MMM yyyy") : "—"}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-muted-foreground">Phone</span><span className="text-xs font-medium">{idCard.phone}</span></div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Contact Info</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{student.phone}</p>
              <p className="text-muted-foreground text-xs mt-2">Email</p>
              <p className="font-medium text-xs break-all">{student.email ?? "—"}</p>
              <p className="text-muted-foreground text-xs mt-2">Emergency Contact</p>
              <p className="font-medium text-xs">{getEmergencyContact(student)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
