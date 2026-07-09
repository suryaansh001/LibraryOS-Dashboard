import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <DashboardLayout>
      <PageHeader title="Platform Settings" description="Configure global platform settings" />
      <Tabs defaultValue="general">
        <TabsList className="mb-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Platform Name</Label>
                <Input defaultValue="LibraryOS" className="h-9 max-w-sm text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Support Email</Label>
                <Input defaultValue="support@libraryos.app" className="h-9 max-w-sm text-sm" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-muted-foreground">Disable access for all non-admin users</p>
                </div>
              </div>
              <Button size="sm" className="h-8 text-xs mt-2">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Notification Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
                <div>
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Get notified when new libraries register</p>
                </div>
              </div>
              <Button size="sm" className="h-8 text-xs">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Billing Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Payment Gateway</Label>
                <Input defaultValue="Razorpay (Connected)" disabled className="h-9 max-w-sm text-sm" />
              </div>
              <Button size="sm" className="h-8 text-xs">Configure Gateway</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Security Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Session Timeout (minutes)</Label>
                <Input defaultValue="60" type="number" className="h-9 max-w-[120px] text-sm" />
              </div>
              <Button size="sm" className="h-8 text-xs">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
