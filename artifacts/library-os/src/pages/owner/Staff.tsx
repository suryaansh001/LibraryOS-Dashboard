import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function Staff() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Staff"
        description="Manage your team members"
      />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Users className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Staff Management</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Staff user management is not available in this deployment.
            You can manage staff directly through the database.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
