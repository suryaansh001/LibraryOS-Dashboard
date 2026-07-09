import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const customFields = [
  { name: "Father's Name", type: "text", required: true },
  { name: "Date of Birth", type: "date", required: false },
  { name: "Course/Exam Preparing", type: "text", required: false },
];

export default function OwnerSettings() {
  const [notifications, setNotifications] = useState(true);
  const [autoRenewal, setAutoRenewal] = useState(false);

  return (
    <DashboardLayout>
      <PageHeader title="Settings" description="Manage your library configuration" />

      <Tabs defaultValue="library">
        <TabsList className="mb-5 flex-wrap h-auto gap-1">
          <TabsTrigger value="library">Library Info</TabsTrigger>
          <TabsTrigger value="fields">Custom Fields</TabsTrigger>
          <TabsTrigger value="plans">Membership Plans</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Library Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Logo */}
              <div>
                <Label className="text-sm mb-2 block">Library Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/15 border border-border flex items-center justify-center text-xl font-bold text-primary">R</div>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs"><Upload className="w-3.5 h-3.5" /> Upload Logo</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Library Name</Label><Input defaultValue="ReadSpace Pro" className="h-9 text-sm" /></div>
                <div className="col-span-2 space-y-1.5"><Label className="text-xs">Address</Label><Textarea defaultValue="12, Study Lane, Karol Bagh, New Delhi - 110005" className="text-sm resize-none" rows={2} /></div>
                <div className="space-y-1.5"><Label className="text-xs">City</Label><Input defaultValue="New Delhi" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Total Capacity (Seats)</Label><Input defaultValue="80" type="number" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Opening Time</Label><Input defaultValue="06:00" type="time" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Closing Time</Label><Input defaultValue="23:00" type="time" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Hourly Rate (₹)</Label><Input defaultValue="15" type="number" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Phone Number</Label><Input defaultValue="+91 98765 00000" className="h-9 text-sm" /></div>
              </div>
              <Button size="sm" className="h-8 text-xs">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Custom Student Fields</CardTitle>
              <Button size="sm" className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add Field</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {customFields.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{f.type} · {f.required ? "Required" : "Optional"}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={f.required} />
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Notification Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "SMS Notifications", desc: "Send SMS alerts for check-ins and payments", state: notifications, setState: setNotifications },
                { label: "Auto-renewal Reminders", desc: "Remind students 3 days before membership expires", state: autoRenewal, setState: setAutoRenewal },
              ].map((n, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Switch checked={n.state} onCheckedChange={n.setState} />
                  <div>
                    <p className="text-sm font-medium">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                </div>
              ))}
              <Button size="sm" className="h-8 text-xs mt-2">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Owner Profile</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label className="text-xs">Full Name</Label><Input defaultValue="Rahul Sharma" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Email</Label><Input defaultValue="rahul@readspace.pro" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">New Password</Label><Input type="password" placeholder="••••••••" className="h-9 text-sm" /></div>
                <div className="space-y-1.5"><Label className="text-xs">Confirm Password</Label><Input type="password" placeholder="••••••••" className="h-9 text-sm" /></div>
              </div>
              <Button size="sm" className="h-8 text-xs">Update Profile</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Membership Plans</CardTitle>
              <Button size="sm" className="h-7 gap-1 text-xs"><Plus className="w-3 h-3" /> Add Plan</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { name: "Daily", price: "₹50", duration: "1 day" },
                  { name: "Weekly", price: "₹150", duration: "7 days" },
                  { name: "Monthly", price: "₹500", duration: "30 days" },
                  { name: "Quarterly", price: "₹1,400", duration: "90 days" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                    <div className="flex-1"><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.duration}</p></div>
                    <p className="text-sm font-bold text-primary">{p.price}</p>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
