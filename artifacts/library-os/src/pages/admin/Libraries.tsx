import DashboardLayout from "@/layouts/DashboardLayout";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminLibraries() {
  return (
    <DashboardLayout>
      <PageHeader title="Libraries" description="Manage all libraries" />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Shield className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">Library Management</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Library management is not available in this deployment.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
