import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/context/ThemeContext";
import { RoleProvider, useRole } from "@/context/RoleContext";

import RolePicker from "@/pages/RolePicker";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
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
import ReceptionistAddStudent from "@/pages/receptionist/AddStudent";

import StudentLogin from "@/pages/student/Login";
import StudentDashboard from "@/pages/student/Dashboard";
import StudentAttendance from "@/pages/student/Attendance";
import StudentMembership from "@/pages/student/Membership";
import StudentPayments from "@/pages/student/Payments";
import StudentIdCard from "@/pages/student/IdCard";
import StudentNotifications from "@/pages/student/Notifications";
import StudentProfilePage from "@/pages/student/Profile";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

/** Guards routes that require authentication. Redirects to /login if no session. */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useRole();
  if (!session) {
    return <Redirect to="/login" />;
  }
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={RolePicker} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard"><ProtectedRoute><AdminDashboard /></ProtectedRoute></Route>
      <Route path="/admin/libraries"><ProtectedRoute><AdminLibraries /></ProtectedRoute></Route>
      <Route path="/admin/subscriptions"><ProtectedRoute><AdminSubscriptions /></ProtectedRoute></Route>
      <Route path="/admin/revenue"><ProtectedRoute><AdminRevenue /></ProtectedRoute></Route>
      <Route path="/admin/users"><ProtectedRoute><AdminUsers /></ProtectedRoute></Route>
      <Route path="/admin/plans"><ProtectedRoute><AdminPlans /></ProtectedRoute></Route>
      <Route path="/admin/settings"><ProtectedRoute><AdminSettings /></ProtectedRoute></Route>

      {/* Owner Routes */}
      <Route path="/dashboard"><ProtectedRoute><OwnerDashboard /></ProtectedRoute></Route>
      <Route path="/students"><ProtectedRoute><OwnerStudents /></ProtectedRoute></Route>
      <Route path="/students/new"><ProtectedRoute><AddStudent /></ProtectedRoute></Route>
      <Route path="/students/:id"><ProtectedRoute><StudentProfile /></ProtectedRoute></Route>
      <Route path="/attendance"><ProtectedRoute><Attendance /></ProtectedRoute></Route>
      <Route path="/occupancy"><ProtectedRoute><Occupancy /></ProtectedRoute></Route>
      <Route path="/seats"><ProtectedRoute><Seats /></ProtectedRoute></Route>
      <Route path="/memberships"><ProtectedRoute><Memberships /></ProtectedRoute></Route>
      <Route path="/payments"><ProtectedRoute><Payments /></ProtectedRoute></Route>
      <Route path="/expenses"><ProtectedRoute><Expenses /></ProtectedRoute></Route>
      <Route path="/reports"><ProtectedRoute><Reports /></ProtectedRoute></Route>
      <Route path="/staff"><ProtectedRoute><Staff /></ProtectedRoute></Route>
      <Route path="/settings"><ProtectedRoute><OwnerSettings /></ProtectedRoute></Route>

      {/* Receptionist Routes */}
      <Route path="/receptionist/dashboard"><ProtectedRoute><ReceptionistDashboard /></ProtectedRoute></Route>
      <Route path="/receptionist/scan"><ProtectedRoute><ReceptionistScanner /></ProtectedRoute></Route>
      <Route path="/receptionist/search"><ProtectedRoute><ReceptionistSearch /></ProtectedRoute></Route>
      <Route path="/receptionist/students/new"><ProtectedRoute><ReceptionistAddStudent /></ProtectedRoute></Route>

      {/* Student Routes */}
      <Route path="/student/login" component={StudentLogin} />
      <Route path="/student/dashboard"><ProtectedRoute><StudentDashboard /></ProtectedRoute></Route>
      <Route path="/student/attendance"><ProtectedRoute><StudentAttendance /></ProtectedRoute></Route>
      <Route path="/student/membership"><ProtectedRoute><StudentMembership /></ProtectedRoute></Route>
      <Route path="/student/payments"><ProtectedRoute><StudentPayments /></ProtectedRoute></Route>
      <Route path="/student/id-card"><ProtectedRoute><StudentIdCard /></ProtectedRoute></Route>
      <Route path="/student/notifications"><ProtectedRoute><StudentNotifications /></ProtectedRoute></Route>
      <Route path="/student/profile"><ProtectedRoute><StudentProfilePage /></ProtectedRoute></Route>

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
