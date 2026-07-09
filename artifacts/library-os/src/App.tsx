import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { RoleProvider } from "@/context/RoleContext";

import RolePicker from "@/pages/RolePicker";
import Login from "@/pages/auth/Login";
import ForgotPassword from "@/pages/auth/ForgotPassword";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminLibraries from "@/pages/admin/Libraries";
import AdminSubscriptions from "@/pages/admin/Subscriptions";
import AdminRevenue from "@/pages/admin/Revenue";
import AdminUsers from "@/pages/admin/Users";
import AdminPlans from "@/pages/admin/Plans";
import AdminSettings from "@/pages/admin/Settings";

import OwnerDashboard from "@/pages/owner/Dashboard";
import OwnerStudents from "@/pages/owner/Students";
import AddStudent from "@/pages/owner/AddStudent";
import StudentProfile from "@/pages/owner/StudentProfile";
import Attendance from "@/pages/owner/Attendance";
import Occupancy from "@/pages/owner/Occupancy";
import Seats from "@/pages/owner/Seats";
import Memberships from "@/pages/owner/Memberships";
import Payments from "@/pages/owner/Payments";
import Expenses from "@/pages/owner/Expenses";
import Reports from "@/pages/owner/Reports";
import Staff from "@/pages/owner/Staff";
import OwnerSettings from "@/pages/owner/Settings";

import ReceptionistDashboard from "@/pages/receptionist/Dashboard";
import ReceptionistScanner from "@/pages/receptionist/Scanner";
import ReceptionistSearch from "@/pages/receptionist/Search";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={RolePicker} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/libraries" component={AdminLibraries} />
      <Route path="/admin/subscriptions" component={AdminSubscriptions} />
      <Route path="/admin/revenue" component={AdminRevenue} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/plans" component={AdminPlans} />
      <Route path="/admin/settings" component={AdminSettings} />

      {/* Owner Routes */}
      <Route path="/dashboard" component={OwnerDashboard} />
      <Route path="/students" component={OwnerStudents} />
      <Route path="/students/new" component={AddStudent} />
      <Route path="/students/:id" component={StudentProfile} />
      <Route path="/attendance" component={Attendance} />
      <Route path="/occupancy" component={Occupancy} />
      <Route path="/seats" component={Seats} />
      <Route path="/memberships" component={Memberships} />
      <Route path="/payments" component={Payments} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/reports" component={Reports} />
      <Route path="/staff" component={Staff} />
      <Route path="/settings" component={OwnerSettings} />

      {/* Receptionist Routes */}
      <Route path="/receptionist/dashboard" component={ReceptionistDashboard} />
      <Route path="/receptionist/scan" component={ReceptionistScanner} />
      <Route path="/receptionist/search" component={ReceptionistSearch} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="library-os-theme">
      <QueryClientProvider client={queryClient}>
        <RoleProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </RoleProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
