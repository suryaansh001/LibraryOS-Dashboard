export const currentStudent = {
  id: "LOS-2024-0001",
  name: "Arjun Kumar",
  phone: "+91 98765 43210",
  email: "arjun.kumar@email.com",
  address: "45, Rajinder Nagar, New Delhi - 110060",
  emergencyContact: "Suresh Kumar (Father) · +91 98765 00001",
  photo: null,
  seat: "A-14",
  membership: "Monthly",
  membershipStatus: "Active",
  library: "ReadSpace Pro",
  libraryAddress: "12, Study Lane, Karol Bagh, New Delhi - 110005",
  libraryPhone: "+91 11-9876-5432",
  joinDate: "Jan 10, 2024",
  startDate: "Mar 01, 2024",
  expiryDate: "Mar 31, 2024",
  todayStudyTime: "3h 45m",
  monthlyStudyHours: "62h 30m",
  paymentStatus: "Paid",
};

export const studentAttendance = [
  { date: "Mar 12, 2024", checkIn: "09:15 AM", checkOut: "02:30 PM", duration: "5h 15m", status: "Present" },
  { date: "Mar 11, 2024", checkIn: "10:00 AM", checkOut: "04:45 PM", duration: "6h 45m", status: "Present" },
  { date: "Mar 10, 2024", checkIn: "08:30 AM", checkOut: "01:00 PM", duration: "4h 30m", status: "Present" },
  { date: "Mar 09, 2024", checkIn: "—", checkOut: "—", duration: "—", status: "Absent" },
  { date: "Mar 08, 2024", checkIn: "09:00 AM", checkOut: "06:00 PM", duration: "9h 00m", status: "Present" },
  { date: "Mar 07, 2024", checkIn: "10:30 AM", checkOut: "03:15 PM", duration: "4h 45m", status: "Present" },
  { date: "Mar 06, 2024", checkIn: "09:45 AM", checkOut: "05:30 PM", duration: "7h 45m", status: "Present" },
  { date: "Mar 05, 2024", checkIn: "—", checkOut: "—", duration: "—", status: "Absent" },
  { date: "Mar 04, 2024", checkIn: "08:00 AM", checkOut: "12:30 PM", duration: "4h 30m", status: "Present" },
  { date: "Mar 03, 2024", checkIn: "09:30 AM", checkOut: "05:00 PM", duration: "7h 30m", status: "Present" },
  { date: "Mar 02, 2024", checkIn: "10:15 AM", checkOut: "04:00 PM", duration: "5h 45m", status: "Present" },
  { date: "Mar 01, 2024", checkIn: "09:00 AM", checkOut: "03:30 PM", duration: "6h 30m", status: "Present" },
  { date: "Feb 29, 2024", checkIn: "10:00 AM", checkOut: "02:00 PM", duration: "4h 00m", status: "Present" },
  { date: "Feb 28, 2024", checkIn: "08:30 AM", checkOut: "06:30 PM", duration: "8h 00m", status: "Present" },
  { date: "Feb 27, 2024", checkIn: "—", checkOut: "—", duration: "—", status: "Absent" },
];

export const studentPayments = [
  { id: "RCP-2024-0312", date: "Mar 01, 2024", amount: 500, method: "UPI", status: "Paid", receipt: "RCP-2024-0312", plan: "Monthly" },
  { id: "RCP-2024-0218", date: "Feb 01, 2024", amount: 500, method: "Cash", status: "Paid", receipt: "RCP-2024-0218", plan: "Monthly" },
  { id: "RCP-2024-0121", date: "Jan 10, 2024", amount: 500, method: "UPI", status: "Paid", receipt: "RCP-2024-0121", plan: "Monthly" },
];

export const studentNotifications = [
  { id: 1, type: "success", title: "Membership Renewed", message: "Your monthly membership has been renewed for March 2024.", time: "2 days ago", read: false },
  { id: 2, type: "success", title: "Payment Received", message: "₹500 received via UPI on Mar 01, 2024. Receipt: RCP-2024-0312.", time: "2 days ago", read: false },
  { id: 3, type: "warning", title: "Membership Expiring Soon", message: "Your membership expires on Mar 31, 2024. Please renew to continue access.", time: "4 days ago", read: false },
  { id: 4, type: "info", title: "Attendance Corrected", message: "Your attendance for Mar 05, 2024 has been marked as Absent by the admin.", time: "1 week ago", read: true },
  { id: 5, type: "info", title: "Seat Confirmation", message: "Your seat A-14 has been confirmed for this month.", time: "2 weeks ago", read: true },
  { id: 6, type: "success", title: "Welcome to ReadSpace Pro", message: "Your account has been created. Welcome to the library family!", time: "Jan 10, 2024", read: true },
];
