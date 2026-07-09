import { motion } from "framer-motion";
import { RefreshCw, MapPin, QrCode, Ban, ChevronLeft, CreditCard, CalendarDays, Clock } from "lucide-react";
import { Link, useParams } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import MembershipBadge from "@/components/MembershipBadge";
import { mockStudents, mockPayments, mockAttendance } from "@/data/mockData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentProfile() {
  const params = useParams<{ id: string }>();
  const student = mockStudents.find(s => s.id === params.id) || mockStudents[0];
  const payments = mockPayments.filter(p => p.student === student.name);
  const attendance = mockAttendance.filter(a => a.student === student.name);

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
                <AvatarFallback className="text-xl bg-primary/15 text-primary font-semibold">{student.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">{student.name}</h1>
                    <p className="text-sm text-muted-foreground">{student.id}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={student.status} />
                    {student.checkedIn && <StatusBadge status="Inside" />}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <MembershipBadge type={student.membership} />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" /> Seat {student.seat}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><CalendarDays className="w-3 h-3" /> Since {student.joinDate}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> Expires {student.expiryDate}</span>
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
                  { label: "Days Present", value: "18", sub: "This month" },
                  { label: "Total Paid", value: "₹1,500", sub: "All time" },
                  { label: "Remaining", value: "12 days", sub: "Membership" },
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
                  {attendance.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm py-1.5 border-b border-border/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-foreground">{a.date} — Checked in at {a.checkIn}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{a.duration}</span>
                    </div>
                  ))}
                  {attendance.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
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
                      {(attendance.length > 0 ? attendance : mockAttendance.slice(0, 5)).map((a, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.date}</td>
                          <td className="px-4 py-2.5 text-sm font-medium">{a.checkIn}</td>
                          <td className="px-4 py-2.5 text-sm">{a.checkOut}</td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{a.duration}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
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
                      {(payments.length > 0 ? payments : mockPayments.slice(0, 4)).map((p, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.id}</td>
                          <td className="px-4 py-2.5 font-semibold text-emerald-500">₹{p.amount}</td>
                          <td className="px-4 py-2.5 text-sm text-muted-foreground">{p.method}</td>
                          <td className="px-4 py-2.5"><StatusBadge status={p.status} /></td>
                          <td className="px-4 py-2.5 text-xs text-muted-foreground">{p.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="mt-4">
              <Card>
                <CardContent className="pt-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground">Current Plan</p><p className="text-sm font-semibold mt-0.5">{student.membership}</p></div>
                    <div><p className="text-xs text-muted-foreground">Status</p><div className="mt-0.5"><MembershipBadge type={student.membership} /></div></div>
                    <div><p className="text-xs text-muted-foreground">Start Date</p><p className="text-sm font-medium mt-0.5">{student.joinDate}</p></div>
                    <div><p className="text-xs text-muted-foreground">Expiry Date</p><p className="text-sm font-medium mt-0.5">{student.expiryDate}</p></div>
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
              {[
                { label: "Renew Membership", icon: RefreshCw, color: "border-primary/30 text-primary hover:bg-primary/10" },
                { label: "Generate QR Code", icon: QrCode, color: "border-border hover:bg-muted/50" },
                { label: "Record Payment", icon: CreditCard, color: "border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10" },
                { label: "Suspend Student", icon: Ban, color: "border-destructive/30 text-destructive hover:bg-destructive/10" },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <button key={i} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${a.color}`}>
                    <Icon className="w-3.5 h-3.5" /> {a.label}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Contact Info</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{student.phone}</p>
              <p className="text-muted-foreground text-xs mt-2">Email</p>
              <p className="font-medium text-xs break-all">{student.email}</p>
              <p className="text-muted-foreground text-xs mt-2">Emergency Contact</p>
              <p className="font-medium text-xs">{student.emergencyContact}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
