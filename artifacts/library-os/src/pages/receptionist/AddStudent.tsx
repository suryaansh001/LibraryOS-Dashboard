import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import ReceptionistLayout from "@/layouts/ReceptionistLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createStudent, getSeats, type SeatListItemDTO } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Check, User, Upload, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Enter valid phone"),
  email: z.string().email("Enter valid email").optional().or(z.literal("")),
});

export default function ReceptionistAddStudent() {
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

  const form = useForm({ resolver: zodResolver(schema), defaultValues: { name: "", phone: "", email: "" } });

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
    <ReceptionistLayout>
      <div className="max-w-lg mx-auto space-y-4">
        <h1 className="text-lg font-bold text-foreground">Add Student</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">Upload Photo</p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
                <Button variant="outline" size="sm" className="mt-2 h-7 text-xs gap-1" type="button"><Upload className="w-3 h-3" /> Choose File</Button>
              </div>

              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">Full Name *</FormLabel>
                  <FormControl><Input {...field} placeholder="Arjun Kumar" className="h-9 text-sm" /></FormControl>
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
                  <FormLabel className="text-xs">Email Address</FormLabel>
                  <FormControl><Input {...field} placeholder="student@email.com" className="h-9 text-sm" /></FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )} />
            </div>

            <div className="bg-card border border-card-border rounded-xl p-5">
              <Label className="text-xs font-medium mb-3 block">Payment</Label>
              <div className="flex gap-2 mb-4">
                <button type="button" onClick={() => setPaymentStatus("paid")} className={cn("flex-1 h-9 rounded-lg text-xs font-medium border transition-all", paymentStatus === "paid" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground hover:border-border/80")}>Paid</button>
                <button type="button" onClick={() => setPaymentStatus("pending")} className={cn("flex-1 h-9 rounded-lg text-xs font-medium border transition-all", paymentStatus === "pending" ? "border-amber-500 bg-amber-500/10 text-amber-500" : "border-border text-muted-foreground hover:border-border/80")}>Pending</button>
              </div>
              <Label className="text-xs font-medium mb-3 block">Select a Seat</Label>
              <div className="flex items-center gap-4 mb-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-destructive/20 border border-destructive/40" /> Occupied</span>
              </div>
              {seatsLoading ? (
                <p className="text-sm text-muted-foreground text-center py-6">Loading seats...</p>
              ) : (
                <div className="grid grid-cols-8 gap-1.5">
                  {seatsList.map((seat) => {
                    const occupied = seat.status === "occupied";
                    return (
                      <button key={seat.id} type="button" disabled={occupied} onClick={() => setSelectedSeat(seat.id)}
                        className={cn("h-8 rounded text-xs font-mono font-medium transition-all",
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
                <p className="text-xs text-muted-foreground mt-2">Selected: {seatsList.find(s => s.id === selectedSeat)?.seatNumber}</p>
              )}
            </div>

            <Button type="submit" className="w-full h-10 text-sm gap-2" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Create Student
            </Button>
          </form>
        </Form>
      </div>

      <Dialog open={createdInfo !== null} onOpenChange={(open) => { if (!open) { setCreatedInfo(null); setLocation("/receptionist/search"); } }}>
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
              <Button size="sm" className="w-full h-9 text-sm" onClick={() => { setCreatedInfo(null); setLocation("/receptionist/search"); }}>Done</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ReceptionistLayout>
  );
}
