import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Upload, User, Copy } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createStudent, getSeats, type SeatListItemDTO } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const steps = ["Basic Information", "Membership", "Seat Assignment"];
const memberships = [
  { type: "Daily", price: "₹50/day", desc: "Single day access" },
  { type: "Weekly", price: "₹150/week", desc: "7-day pass" },
  { type: "Monthly", price: "₹500/month", desc: "30-day membership" },
  { type: "Quarterly", price: "₹1,400/quarter", desc: "90-day membership — Best value" },
];

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Enter valid phone"),
  email: z.string().email("Enter valid email"),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export default function AddStudent() {
  const [step, setStep] = useState(0);
  const [selectedMembership, setSelectedMembership] = useState("Monthly");
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">("paid");
  const [seatsList, setSeatsList] = useState<SeatListItemDTO[]>([]);
  const [seatsLoading, setSeatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdInfo, setCreatedInfo] = useState<{ name: string; email: string; password: string } | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    getSeats()
      .then((list) => { setSeatsList(list); setSeatsLoading(false); })
      .catch(() => setSeatsLoading(false));
  }, []);

  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", email: "", address: "", emergencyContact: "" } });

  const handleSubmit = async () => {
    const values = form.getValues();
    setSubmitting(true);
    try {
      const student = await createStudent({
        name: values.name,
        phone: values.phone,
        email: values.email || undefined,
        status: "active",
        seatId: selectedSeat ?? undefined,
        paymentStatus,
        customFields: {
          membership: selectedMembership,
          address: values.address,
          emergencyContact: values.emergencyContact,
        },
      });
      setCreatedInfo({
        name: student.name,
        email: student.email ?? values.email ?? `${student.id}@student.local`,
        password: student.password ?? "",
      });
    } catch (e) {
      toast({ title: "Failed to create student", description: e instanceof Error ? e.message : "An error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/students" className="text-xs text-muted-foreground hover:text-foreground">Students</Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-foreground font-medium">Add Student</span>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all", i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={cn("text-xs font-medium", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              {i < steps.length - 1 && <div className={cn("flex-1 h-px w-8", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <Form {...form}>
                <div className="bg-card border border-card-border rounded-xl p-6 space-y-4">
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Upload Photo</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                    <Button variant="outline" size="sm" className="mt-3 h-7 text-xs gap-1"><Upload className="w-3 h-3" /> Choose File</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-xs">Full Name *</FormLabel>
                        <FormControl><Input {...field} placeholder="Arjun Kumar" className="h-9 text-sm" data-testid="input-name" /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Phone Number *</FormLabel>
                        <FormControl><Input {...field} placeholder="+91 98765 43210" className="h-9 text-sm" /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Email Address *</FormLabel>
                        <FormControl><Input {...field} placeholder="student@email.com" className="h-9 text-sm" /></FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-xs">Address</FormLabel>
                        <FormControl><Textarea {...field} placeholder="Street address, city, state" className="text-sm resize-none" rows={2} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="emergencyContact" render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-xs">Emergency Contact</FormLabel>
                        <FormControl><Input {...field} placeholder="Name (Phone)" className="h-9 text-sm" /></FormControl>
                      </FormItem>
                    )} />
                  </div>
                </div>
              </Form>
            )}

            {step === 1 && (
              <div className="bg-card border border-card-border rounded-xl p-6">
                <p className="text-sm font-medium mb-4">Select Membership Plan</p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {memberships.map((m) => (
                    <button key={m.type} onClick={() => setSelectedMembership(m.type)} className={cn("p-4 rounded-xl border text-left transition-all", selectedMembership === m.type ? "border-primary bg-primary/10" : "border-border hover:border-border/80 hover:bg-muted/30")}>
                      <p className="text-sm font-semibold text-foreground">{m.type}</p>
                      <p className="text-xs font-bold text-primary mt-0.5">{m.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                    </button>
                  ))}
                </div>
                <div className="space-y-1.5 mb-4">
                  <Label className="text-xs">Payment Status</Label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setPaymentStatus("paid")} className={cn("flex-1 h-9 rounded-lg text-xs font-medium border transition-all", paymentStatus === "paid" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground hover:border-border/80")}>Paid</button>
                    <button type="button" onClick={() => setPaymentStatus("pending")} className={cn("flex-1 h-9 rounded-lg text-xs font-medium border transition-all", paymentStatus === "pending" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-border text-muted-foreground hover:border-border/80")}>Pending</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Start Date</Label>
                    <Input type="date" defaultValue="2024-03-12" className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Shift Preference</Label>
                    <select className="w-full h-9 text-sm bg-background border border-input rounded-md px-3 text-foreground">
                      <option>Morning (6AM–12PM)</option>
                      <option>Afternoon (12PM–6PM)</option>
                      <option>Evening (6PM–11PM)</option>
                      <option>Full Day</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card border border-card-border rounded-xl p-6">
                <p className="text-sm font-medium mb-2">Select a Seat</p>
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" /> Available</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" /> Occupied</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary border border-primary" /> Selected</span>
                </div>
                {seatsLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading seats...</p>
                ) : (
                  <div className="grid grid-cols-8 gap-1.5 mb-4">
                    {seatsList.map((seat) => {
                      const occupied = seat.status === "occupied";
                      return (
                        <button key={seat.id} disabled={occupied} onClick={() => setSelectedSeat(seat.id)}
                          className={cn("h-9 rounded text-xs font-mono font-medium transition-all",
                            occupied ? "bg-destructive/15 text-destructive/50 cursor-not-allowed border border-destructive/20" :
                            selectedSeat === seat.id ? "bg-primary text-primary-foreground border border-primary" :
                            "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/20"
                          )}>
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                )}
                {selectedSeat && (
                  <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 text-sm">
                    Selected: <span className="font-bold font-mono text-primary">{seatsList.find(s => s.id === selectedSeat)?.seatNumber}</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between mt-5">
          <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => step > 0 ? setStep(step - 1) : setLocation("/students")} disabled={step === 0}>
            Back
          </Button>
          <div className="flex gap-2">
            {step < 2 ? (
              <Button size="sm" className="h-8 text-xs gap-1" onClick={() => form.handleSubmit(() => setStep(step + 1))()}>
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button size="sm" className="h-8 text-xs gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Create Student
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Credentials dialog */}
      <Dialog open={createdInfo !== null} onOpenChange={(open) => { if (!open) { setCreatedInfo(null); setLocation("/students"); } }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Student Created</DialogTitle>
          </DialogHeader>
          {createdInfo && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Share these credentials with <span className="font-semibold text-foreground">{createdInfo.name}</span>:</p>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-muted-foreground">Email</span><p className="font-mono font-medium">{createdInfo.email}</p></div>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(createdInfo.email); toast({ title: "Copied" }); }} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
                </div>
                <div className="border-t border-border/50" />
                <div className="flex items-center justify-between">
                  <div><span className="text-xs text-muted-foreground">Password</span><p className="font-mono font-medium">{createdInfo.password}</p></div>
                  <button type="button" onClick={() => { navigator.clipboard.writeText(createdInfo.password); toast({ title: "Copied" }); }} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Students log in at the Student Portal with their email and this password.</p>
              <Button size="sm" className="w-full h-9 text-sm" onClick={() => { setCreatedInfo(null); setLocation("/students"); }}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
