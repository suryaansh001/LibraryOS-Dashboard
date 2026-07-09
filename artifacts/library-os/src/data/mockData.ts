export type Student = {
  id: string;
  name: string;
  phone: string;
  email: string;
  photo: null;
  seat: string;
  membership: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  status: "active" | "suspended" | "trial";
  paymentStatus: "paid" | "pending" | "overdue";
  joinDate: string;
  expiryDate: string;
  emergencyContact: string;
  checkedIn?: boolean;
  checkInTime?: string;
};

export const mockStudents: Student[] = [
  { id: "LOS-2024-0001", name: "Arjun Kumar", phone: "+91 98765 43210", email: "arjun.kumar@email.com", photo: null, seat: "A-14", membership: "Monthly", status: "active", paymentStatus: "paid", joinDate: "2024-01-15", expiryDate: "2024-12-15", emergencyContact: "Sunita Kumar (+91 98765 43211)", checkedIn: true, checkInTime: "08:15 AM" },
  { id: "LOS-2024-0002", name: "Priya Sharma", phone: "+91 98765 43212", email: "priya.s@email.com", photo: null, seat: "A-15", membership: "Quarterly", status: "active", paymentStatus: "paid", joinDate: "2024-02-01", expiryDate: "2024-05-01", emergencyContact: "Rahul Sharma (+91 98765 43213)", checkedIn: true, checkInTime: "09:00 AM" },
  { id: "LOS-2024-0003", name: "Ravi Patel", phone: "+91 98765 43214", email: "ravi.p@email.com", photo: null, seat: "B-01", membership: "Monthly", status: "suspended", paymentStatus: "overdue", joinDate: "2024-01-20", expiryDate: "2024-02-20", emergencyContact: "Anita Patel (+91 98765 43215)", checkedIn: false },
  { id: "LOS-2024-0004", name: "Sneha Reddy", phone: "+91 98765 43216", email: "sneha.r@email.com", photo: null, seat: "C-10", membership: "Weekly", status: "trial", paymentStatus: "pending", joinDate: "2024-03-10", expiryDate: "2024-03-17", emergencyContact: "Rajesh Reddy (+91 98765 43217)", checkedIn: true, checkInTime: "10:30 AM" },
  { id: "LOS-2024-0005", name: "Karan Singh", phone: "+91 98765 43218", email: "karan.s@email.com", photo: null, seat: "D-05", membership: "Monthly", status: "active", paymentStatus: "paid", joinDate: "2024-02-15", expiryDate: "2024-03-15", emergencyContact: "Pooja Singh (+91 98765 43219)", checkedIn: false },
  { id: "LOS-2024-0006", name: "Divya Menon", phone: "+91 98765 43220", email: "divya.m@email.com", photo: null, seat: "B-08", membership: "Quarterly", status: "active", paymentStatus: "paid", joinDate: "2024-01-05", expiryDate: "2024-04-05", emergencyContact: "Suresh Menon (+91 98765 43221)", checkedIn: true, checkInTime: "08:45 AM" },
  { id: "LOS-2024-0007", name: "Amit Joshi", phone: "+91 98765 43222", email: "amit.j@email.com", photo: null, seat: "C-03", membership: "Monthly", status: "active", paymentStatus: "paid", joinDate: "2024-02-20", expiryDate: "2024-03-20", emergencyContact: "Meena Joshi (+91 98765 43223)", checkedIn: true, checkInTime: "09:30 AM" },
  { id: "LOS-2024-0008", name: "Nisha Gupta", phone: "+91 98765 43224", email: "nisha.g@email.com", photo: null, seat: "D-12", membership: "Daily", status: "active", paymentStatus: "paid", joinDate: "2024-03-12", expiryDate: "2024-03-12", emergencyContact: "Vijay Gupta (+91 98765 43225)", checkedIn: false },
  { id: "LOS-2024-0009", name: "Rohit Verma", phone: "+91 98765 43226", email: "rohit.v@email.com", photo: null, seat: "A-03", membership: "Monthly", status: "active", paymentStatus: "pending", joinDate: "2024-02-10", expiryDate: "2024-03-10", emergencyContact: "Sunita Verma (+91 98765 43227)", checkedIn: true, checkInTime: "11:00 AM" },
  { id: "LOS-2024-0010", name: "Kavita Nair", phone: "+91 98765 43228", email: "kavita.n@email.com", photo: null, seat: "B-15", membership: "Quarterly", status: "active", paymentStatus: "paid", joinDate: "2024-01-25", expiryDate: "2024-04-25", emergencyContact: "Rajan Nair (+91 98765 43229)", checkedIn: false },
  { id: "LOS-2024-0011", name: "Suresh Pillai", phone: "+91 98765 43230", email: "suresh.p@email.com", photo: null, seat: "C-07", membership: "Monthly", status: "suspended", paymentStatus: "overdue", joinDate: "2024-01-30", expiryDate: "2024-02-28", emergencyContact: "Latha Pillai (+91 98765 43231)", checkedIn: false },
  { id: "LOS-2024-0012", name: "Ananya Iyer", phone: "+91 98765 43232", email: "ananya.i@email.com", photo: null, seat: "A-09", membership: "Monthly", status: "active", paymentStatus: "paid", joinDate: "2024-02-05", expiryDate: "2024-03-05", emergencyContact: "Venkat Iyer (+91 98765 43233)", checkedIn: true, checkInTime: "08:00 AM" },
  { id: "LOS-2024-0013", name: "Deepak Choudhary", phone: "+91 98765 43234", email: "deepak.c@email.com", photo: null, seat: "D-01", membership: "Weekly", status: "trial", paymentStatus: "pending", joinDate: "2024-03-08", expiryDate: "2024-03-15", emergencyContact: "Rekha Choudhary (+91 98765 43235)", checkedIn: true, checkInTime: "10:00 AM" },
  { id: "LOS-2024-0014", name: "Meera Krishnan", phone: "+91 98765 43236", email: "meera.k@email.com", photo: null, seat: "B-06", membership: "Quarterly", status: "active", paymentStatus: "paid", joinDate: "2023-12-01", expiryDate: "2024-03-01", emergencyContact: "Aruna Krishnan (+91 98765 43237)", checkedIn: false },
  { id: "LOS-2024-0015", name: "Vikram Tiwari", phone: "+91 98765 43238", email: "vikram.t@email.com", photo: null, seat: "C-14", membership: "Monthly", status: "active", paymentStatus: "paid", joinDate: "2024-02-28", expiryDate: "2024-03-28", emergencyContact: "Geeta Tiwari (+91 98765 43239)", checkedIn: true, checkInTime: "07:50 AM" },
];

export const mockLibraries = [
  { id: "lib-001", name: "ReadSpace Pro", owner: "Rahul Sharma", city: "Delhi", plan: "Professional", students: 312, status: "active", mrr: "$49", joined: "2024-01-10" },
  { id: "lib-002", name: "StudyHub Bangalore", owner: "Anita Desai", city: "Bangalore", plan: "Enterprise", students: 540, status: "active", mrr: "$99", joined: "2023-11-05" },
  { id: "lib-003", name: "Quiet Zone Mumbai", owner: "Karthik Iyer", city: "Mumbai", plan: "Starter", students: 45, status: "trial", mrr: "$0", joined: "2024-03-01" },
  { id: "lib-004", name: "Focus Den Chennai", owner: "Priya Nair", city: "Chennai", plan: "Professional", students: 198, status: "active", mrr: "$49", joined: "2023-12-15" },
  { id: "lib-005", name: "Scholar Hub Pune", owner: "Arun Mehta", city: "Pune", plan: "Starter", students: 67, status: "active", mrr: "$19", joined: "2024-02-01" },
  { id: "lib-006", name: "KnowledgeNest Hyderabad", owner: "Deepika Rao", city: "Hyderabad", plan: "Enterprise", students: 420, status: "active", mrr: "$99", joined: "2023-10-20" },
  { id: "lib-007", name: "ReadMore Jaipur", owner: "Sanjeev Bansal", city: "Jaipur", plan: "Starter", students: 38, status: "trial", mrr: "$0", joined: "2024-03-08" },
  { id: "lib-008", name: "StudyCorner Lucknow", owner: "Neha Agarwal", city: "Lucknow", plan: "Professional", students: 156, status: "active", mrr: "$49", joined: "2024-01-25" },
  { id: "lib-009", name: "Page Turner Kolkata", owner: "Subhash Das", city: "Kolkata", plan: "Starter", students: 89, status: "active", mrr: "$19", joined: "2024-02-14" },
  { id: "lib-010", name: "Silent Library Ahmedabad", owner: "Bhavesh Shah", city: "Ahmedabad", plan: "Professional", students: 234, status: "active", mrr: "$49", joined: "2023-11-30" },
];

export const mockPayments = [
  { id: "PAY-001", student: "Arjun Kumar", amount: 500, method: "UPI", status: "Paid", date: "2024-03-12" },
  { id: "PAY-002", student: "Priya Sharma", amount: 1400, method: "Card", status: "Paid", date: "2024-03-10" },
  { id: "PAY-003", student: "Ravi Patel", amount: 500, method: "Cash", status: "Overdue", date: "2024-02-20" },
  { id: "PAY-004", student: "Divya Menon", amount: 1400, method: "Online", status: "Paid", date: "2024-03-08" },
  { id: "PAY-005", student: "Karan Singh", amount: 500, method: "UPI", status: "Pending", date: "2024-03-05" },
  { id: "PAY-006", student: "Amit Joshi", amount: 500, method: "Cash", status: "Paid", date: "2024-03-01" },
  { id: "PAY-007", student: "Ananya Iyer", amount: 500, method: "UPI", status: "Paid", date: "2024-02-28" },
  { id: "PAY-008", student: "Rohit Verma", amount: 500, method: "Card", status: "Pending", date: "2024-02-25" },
  { id: "PAY-009", student: "Kavita Nair", amount: 1400, method: "Online", status: "Paid", date: "2024-02-20" },
  { id: "PAY-010", student: "Vikram Tiwari", amount: 500, method: "UPI", status: "Paid", date: "2024-02-18" },
  { id: "PAY-011", student: "Meera Krishnan", amount: 1400, method: "Card", status: "Overdue", date: "2024-02-01" },
  { id: "PAY-012", student: "Sneha Reddy", amount: 150, method: "Cash", status: "Pending", date: "2024-03-10" },
];

export const mockAttendance = [
  { id: "ATT-001", student: "Arjun Kumar", studentId: "LOS-2024-0001", seat: "A-14", checkIn: "08:15 AM", checkOut: "04:30 PM", status: "Present", date: "2024-03-12", duration: "8h 15m" },
  { id: "ATT-002", student: "Priya Sharma", studentId: "LOS-2024-0002", seat: "A-15", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present", date: "2024-03-12", duration: "9h 00m" },
  { id: "ATT-003", student: "Sneha Reddy", studentId: "LOS-2024-0004", seat: "C-10", checkIn: "10:30 AM", checkOut: "-", status: "Inside", date: "2024-03-12", duration: "2h 45m" },
  { id: "ATT-004", student: "Divya Menon", studentId: "LOS-2024-0006", seat: "B-08", checkIn: "08:45 AM", checkOut: "05:15 PM", status: "Present", date: "2024-03-12", duration: "8h 30m" },
  { id: "ATT-005", student: "Amit Joshi", studentId: "LOS-2024-0007", seat: "C-03", checkIn: "09:30 AM", checkOut: "-", status: "Inside", date: "2024-03-12", duration: "3h 15m" },
  { id: "ATT-006", student: "Ananya Iyer", studentId: "LOS-2024-0012", seat: "A-09", checkIn: "08:00 AM", checkOut: "03:30 PM", status: "Present", date: "2024-03-12", duration: "7h 30m" },
  { id: "ATT-007", student: "Deepak Choudhary", studentId: "LOS-2024-0013", seat: "D-01", checkIn: "10:00 AM", checkOut: "-", status: "Inside", date: "2024-03-12", duration: "2h 45m" },
  { id: "ATT-008", student: "Vikram Tiwari", studentId: "LOS-2024-0015", seat: "C-14", checkIn: "07:50 AM", checkOut: "04:00 PM", status: "Present", date: "2024-03-12", duration: "8h 10m" },
  { id: "ATT-009", student: "Rohit Verma", studentId: "LOS-2024-0009", seat: "A-03", checkIn: "11:00 AM", checkOut: "-", status: "Inside", date: "2024-03-12", duration: "1h 45m" },
];

export const mockExpenses = [
  { id: "EXP-001", category: "Rent", description: "March Office Rent", amount: 1200, date: "2024-03-01", receipt: true },
  { id: "EXP-002", category: "Electricity", description: "February Electricity Bill", amount: 140, date: "2024-03-05", receipt: true },
  { id: "EXP-003", category: "Staff", description: "Staff Salaries - March", amount: 580, date: "2024-03-01", receipt: true },
  { id: "EXP-004", category: "Maintenance", description: "AC Servicing", amount: 85, date: "2024-03-10", receipt: false },
  { id: "EXP-005", category: "Internet", description: "Broadband Bill - March", amount: 60, date: "2024-03-03", receipt: true },
  { id: "EXP-006", category: "Supplies", description: "Stationery & Cleaning", amount: 45, date: "2024-03-08", receipt: false },
  { id: "EXP-007", category: "Other", description: "Miscellaneous", amount: 30, date: "2024-03-11", receipt: false },
];

export const mockStaff = [
  { id: "STF-001", name: "Rahul Sharma", role: "Manager", phone: "+91 98765 11001", email: "rahul.manager@readspace.com", status: "active", joinDate: "2023-01-15" },
  { id: "STF-002", name: "Sunita Devi", role: "Receptionist", phone: "+91 98765 11002", email: "sunita.r@readspace.com", status: "active", joinDate: "2023-06-01" },
  { id: "STF-003", name: "Mohan Kumar", role: "Security", phone: "+91 98765 11003", email: "mohan.s@readspace.com", status: "active", joinDate: "2023-03-10" },
  { id: "STF-004", name: "Geeta Jain", role: "Receptionist", phone: "+91 98765 11004", email: "geeta.j@readspace.com", status: "inactive", joinDate: "2023-08-20" },
];

export const revenueData = [
  { month: "Apr", revenue: 3200 },
  { month: "May", revenue: 3600 },
  { month: "Jun", revenue: 3400 },
  { month: "Jul", revenue: 4100 },
  { month: "Aug", revenue: 3900 },
  { month: "Sep", revenue: 4300 },
  { month: "Oct", revenue: 4600 },
  { month: "Nov", revenue: 4200 },
  { month: "Dec", revenue: 4800 },
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 4650 },
  { month: "Mar", revenue: 4820 },
];

export const attendanceData = [
  { day: "Mar 1", count: 38 }, { day: "Mar 2", count: 42 }, { day: "Mar 3", count: 35 },
  { day: "Mar 4", count: 44 }, { day: "Mar 5", count: 47 }, { day: "Mar 6", count: 50 },
  { day: "Mar 7", count: 41 }, { day: "Mar 8", count: 39 }, { day: "Mar 9", count: 43 },
  { day: "Mar 10", count: 46 }, { day: "Mar 11", count: 48 }, { day: "Mar 12", count: 47 },
];

export const adminRevenueData = [
  { month: "Apr", revenue: 11200 }, { month: "May", revenue: 12400 }, { month: "Jun", revenue: 12800 },
  { month: "Jul", revenue: 13600 }, { month: "Aug", revenue: 13200 }, { month: "Sep", revenue: 14100 },
  { month: "Oct", revenue: 14800 }, { month: "Nov", revenue: 15200 }, { month: "Dec", revenue: 15800 },
  { month: "Jan", revenue: 16400 }, { month: "Feb", revenue: 17200 }, { month: "Mar", revenue: 18420 },
];

export const newLibrariesData = [
  { month: "Apr", count: 12 }, { month: "May", count: 15 }, { month: "Jun", count: 18 },
  { month: "Jul", count: 14 }, { month: "Aug", count: 21 }, { month: "Sep", count: 19 },
  { month: "Oct", count: 24 }, { month: "Nov", count: 22 }, { month: "Dec", count: 27 },
  { month: "Jan", count: 25 }, { month: "Feb", count: 29 }, { month: "Mar", count: 32 },
];

export const subscriptionGrowthData = [
  { month: "Apr", active: 140, trial: 18, cancelled: 8 },
  { month: "May", active: 153, trial: 20, cancelled: 6 },
  { month: "Jun", active: 158, trial: 22, cancelled: 9 },
  { month: "Jul", active: 163, trial: 19, cancelled: 5 },
  { month: "Aug", active: 170, trial: 21, cancelled: 7 },
  { month: "Sep", active: 174, trial: 24, cancelled: 6 },
  { month: "Oct", active: 180, trial: 26, cancelled: 8 },
  { month: "Nov", active: 183, trial: 23, cancelled: 5 },
  { month: "Dec", active: 186, trial: 25, cancelled: 6 },
  { month: "Jan", active: 188, trial: 24, cancelled: 7 },
  { month: "Feb", active: 189, trial: 22, cancelled: 5 },
  { month: "Mar", active: 189, trial: 23, cancelled: 4 },
];

export const activityFeed = [
  { id: 1, text: "Arjun Kumar checked in", detail: "Seat A-14 · 2 min ago", type: "checkin" },
  { id: 2, text: "Payment received", detail: "Priya Sharma · ₹1,400 · 5 min ago", type: "payment" },
  { id: 3, text: "Deepak Choudhary checked in", detail: "Seat D-01 · 12 min ago", type: "checkin" },
  { id: 4, text: "New student registered", detail: "Vikram Tiwari · Seat C-14 · 25 min ago", type: "student" },
  { id: 5, text: "Membership renewed", detail: "Kavita Nair · Quarterly · 1 hr ago", type: "renewal" },
  { id: 6, text: "Ananya Iyer checked out", detail: "Seat A-09 · Duration 7h 30m · 2 hr ago", type: "checkout" },
  { id: 7, text: "Seat B-03 marked maintenance", detail: "Admin action · 3 hr ago", type: "maintenance" },
  { id: 8, text: "Payment reminder sent", detail: "Ravi Patel · ₹500 overdue · 4 hr ago", type: "reminder" },
];
