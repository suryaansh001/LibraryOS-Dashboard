export type Role = "owner" | "staff" | "receptionist" | "student";

export interface ApiSuccessResponse<TData> {
  success: true;
  data: TData;
  meta?: unknown;
  message?: string;
  requestId: string;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface LibraryDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  capacity: number;
  openingTime: string;
  closingTime: string;
  timezone: string;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

export interface AuthSessionDTO {
  accessToken: string;
  user: UserDTO;
  library: LibraryDTO;
}

export interface DashboardDTO {
  currentOccupancy: number;
  capacity: number;
  todayCheckins: number;
  monthlyRevenue: number;
  pendingFeesCount: number;
  pendingFeesAmount: number;
  activeStudents: number;
  revenue30d: Array<{ date: string; amount: number }>;
  attendance30d: Array<{ date: string; count: number }>;
  recentActivity: Array<{ action: string; entityType: string; createdAt: string }>;
  partialFailures: string[];
}

export interface StudentListItemDTO {
  id: string;
  name: string;
  phone: string;
  status: string;
  seatNumber: string | null;
  membershipType: string | null;
  membershipStatus: string | null;
}

export interface StudentResponseDTO extends StudentListItemDTO {
  email: string | null;
  photoUrl: string | null;
  membershipEndDate: string | null;
  hoursRemaining: number | null;
  customFields: Record<string, unknown>;
  createdAt: string;
  password?: string;
}

export interface StudentIdCardDTO {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  photoUrl: string | null;
  libraryName: string;
  qrToken: string;
  seatNumber: string | null;
  membershipType: string | null;
  membershipEndDate: string | null;
}

export interface AttendanceSessionDTO {
  id: string;
  studentId: string;
  studentName: string;
  seatNumber: string | null;
  checkInAt: string;
  checkOutAt: string | null;
  durationMinutes: number | null;
  checkInMethod: "qr" | "manual";
  checkOutMethod: "qr" | "manual" | "auto" | "forgot" | null;
  isManualCorrection: boolean;
}

export interface PaymentListItemDTO {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  method: string;
  status: string;
  paymentDate: string;
}

export type MembershipStatus = "active" | "suspended" | "expired" | "cancelled";
export type MembershipType = "monthly" | "hourly";

export interface MembershipListItemDTO {
  id: string;
  studentId: string;
  planName: string | null;
  type: MembershipType;
  status: MembershipStatus;
  startDate: string;
  endDate: string | null;
  hoursRemaining: number | null;
  isCurrent: boolean;
}

export type ExpenseCategory =
  | "rent"
  | "electricity"
  | "internet"
  | "salary"
  | "maintenance"
  | "supplies"
  | "marketing"
  | "miscellaneous"
  | "other";

export interface ExpenseListItemDTO {
  id: string;
  category: ExpenseCategory;
  amount: number;
  description: string | null;
  expenseDate: string;
}

export type SeatType = "fixed" | "flexible";
export type SeatStatus = "available" | "occupied" | "maintenance";

export interface SeatListItemDTO {
  id: string;
  seatNumber: string;
  section: string | null;
  type: SeatType;
  status: SeatStatus;
}

export interface SeatLiveDTO {
  seatNumber: string;
  status: SeatStatus;
}

export interface OccupancyActiveSessionDTO {
  sessionId: string;
  studentId: string;
  studentName: string;
  seatNumber: string | null;
  checkInAt: string;
  membershipType: string;
}

export interface OccupancyDTO {
  currentCount: number;
  capacity: number;
  availableFlexible: number;
  seats: SeatLiveDTO[];
  activeSessions: OccupancyActiveSessionDTO[];
}

export interface AttendanceLiveDTO {
  currentCount: number;
  capacity: number;
  availableFlexible: number;
}

export interface CheckInResponseDTO {
  sessionId: string;
  studentName: string;
  seatNumber: string | null;
  membershipType: string;
  checkInAt: string;
  currentOccupancy: number;
}

export interface CreateStudentBody {
  name: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  status?: "active" | "suspended" | "expired" | "inactive";
  seatId?: string;
  password?: string;
  paymentStatus?: "paid" | "pending";
  customFields?: Record<string, unknown>;
  notes?: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "/api/v1").replace(/\/+$/, "");
const ACCESS_TOKEN_KEY = "library-os-access-token";

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setStoredAccessToken(token: string | null): void {
  if (token === null || token.length === 0) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function buildUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `${API_BASE_URL}${path}`;
  }

  return `${API_BASE_URL}/${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");

  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccessResponse<T> | { message?: string; error?: string; detail?: string; title?: string } | null;

  if (!response.ok) {
    if (response.status === 401 && !path.includes("/auth/login") && !path.includes("/auth/register")) {
      try {
        const saved = localStorage.getItem("library-os-session");
        const session = saved ? JSON.parse(saved) as { user?: { role?: string } } : null;
        localStorage.removeItem("library-os-session");
        setStoredAccessToken(null);
        if (session?.user?.role) {
          window.location.href = `/${session.user.role}/login`;
        } else {
          window.location.href = "/";
        }
      } catch {
        localStorage.removeItem("library-os-session");
        setStoredAccessToken(null);
        window.location.href = "/";
      }
      throw new Error("Session expired. Redirecting to login...");
    }
    const message = payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
      ? payload.message
      : payload && typeof payload === "object" && "detail" in payload && typeof payload.detail === "string"
        ? payload.detail
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (!payload || typeof payload !== "object" || !("data" in payload)) {
    throw new Error("Invalid API response");
  }

  return payload.data as T;
}

export async function register(body: {
  name: string;
  email: string;
  password: string;
  libraryName: string;
  librarySlug: string;
  phone?: string;
}): Promise<AuthSessionDTO> {
  return request<AuthSessionDTO>("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function login(body: { email: string; password: string; librarySlug: string }): Promise<AuthSessionDTO> {
  return request<AuthSessionDTO>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMe(): Promise<{ user: UserDTO; library: LibraryDTO }> {
  return request<{ user: UserDTO; library: LibraryDTO }>("/auth/me");
}

export async function getDashboard(): Promise<DashboardDTO> {
  return request<DashboardDTO>("/dashboard");
}

export async function listStudents(params?: Record<string, string | number | undefined>): Promise<StudentListItemDTO[]> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "") continue;
    searchParams.set(key, String(value));
  }

  const query = searchParams.toString();
  return request<StudentListItemDTO[]>(`/students${query ? `?${query}` : ""}`);
}

export async function getStudentMe(): Promise<StudentResponseDTO> {
  return request<StudentResponseDTO>("/students/me");
}

export async function getStudentMePayments(): Promise<PaymentListItemDTO[]> {
  return request<PaymentListItemDTO[]>("/students/me/payments");
}

export async function getStudentMeAttendance(): Promise<AttendanceSessionDTO[]> {
  return request<AttendanceSessionDTO[]>("/students/me/history");
}

export async function getStudentMeIdCard(): Promise<StudentIdCardDTO> {
  return request<StudentIdCardDTO>("/students/me/id-card");
}

export async function listPayments(): Promise<PaymentListItemDTO[]> {
  // Backend returns paginated: { success, data: [...], meta }
  // Our request() unwraps to data, but for paginated routes data IS the array
  return request<PaymentListItemDTO[]>("/payments?limit=100");
}

export async function listAttendance(params?: Record<string, string | number | undefined>): Promise<AttendanceSessionDTO[]> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined || value === "") continue;
    searchParams.set(key, String(value));
  }
  if (!searchParams.has("limit")) searchParams.set("limit", "100");

  const query = searchParams.toString();
  return request<AttendanceSessionDTO[]>(`/attendance${query ? `?${query}` : ""}`);
}

export async function getAttendanceLive(): Promise<AttendanceLiveDTO> {
  return request<AttendanceLiveDTO>("/attendance/live");
}

export async function getMemberships(): Promise<MembershipListItemDTO[]> {
  return request<MembershipListItemDTO[]>("/memberships?limit=100");
}

export async function getExpenses(): Promise<ExpenseListItemDTO[]> {
  return request<ExpenseListItemDTO[]>("/expenses?limit=100");
}

export interface CreatePaymentBody {
  studentId: string;
  amount: number;
  method: "cash" | "upi" | "card" | "online";
  status?: "paid" | "pending" | "refunded";
  referenceNumber?: string;
  paymentDate: string;
  dueDate?: string;
  notes?: string;
}

export interface CreateExpenseBody {
  category: ExpenseCategory;
  amount: number;
  description?: string;
  expenseDate: string;
  receiptUrl?: string | null;
}

export async function createPayment(body: CreatePaymentBody): Promise<PaymentListItemDTO> {
  return request<PaymentListItemDTO>("/payments", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function createExpense(body: CreateExpenseBody): Promise<ExpenseListItemDTO> {
  return request<ExpenseListItemDTO>("/expenses", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getSeats(): Promise<SeatListItemDTO[]> {
  return request<SeatListItemDTO[]>("/seats?limit=100");
}

export async function getSeatsLive(): Promise<{ currentCount: number; capacity: number; availableFlexible: number; seats: SeatLiveDTO[] }> {
  return request("/seats/live");
}

export async function getOccupancy(): Promise<OccupancyDTO> {
  return request<OccupancyDTO>("/occupancy/live");
}

export async function getStudentById(id: string): Promise<StudentResponseDTO> {
  return request<StudentResponseDTO>(`/students/${id}`);
}

export async function getStudentPayments(id: string): Promise<PaymentListItemDTO[]> {
  return request<PaymentListItemDTO[]>(`/students/${id}/payments?limit=100`);
}

export async function getStudentHistory(id: string): Promise<AttendanceSessionDTO[]> {
  return request<AttendanceSessionDTO[]>(`/students/${id}/history?limit=100`);
}

export async function getStudentIdCard(id: string): Promise<StudentIdCardDTO> {
  return request<StudentIdCardDTO>(`/students/${id}/id-card`);
}

export async function searchStudents(query: string): Promise<StudentListItemDTO[]> {
  const searchParams = new URLSearchParams();
  if (query) searchParams.set("search", query);
  searchParams.set("limit", "50");
  const qs = searchParams.toString();
  return request<StudentListItemDTO[]>(`/students${qs ? `?${qs}` : ""}`);
}

export async function createStudent(body: CreateStudentBody): Promise<StudentResponseDTO> {
  return request<StudentResponseDTO>("/students", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateStudentStatus(
  id: string,
  status: "active" | "suspended" | "expired" | "inactive"
): Promise<StudentResponseDTO> {
  return request<StudentResponseDTO>(`/students/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function qrCheckIn(qrToken: string): Promise<CheckInResponseDTO> {
  return request<CheckInResponseDTO>("/attendance/qr-checkin", {
    method: "POST",
    body: JSON.stringify({ qrToken }),
  });
}

export async function qrCheckOut(qrToken: string): Promise<AttendanceSessionDTO> {
  return request<AttendanceSessionDTO>("/attendance/qr-checkout", {
    method: "POST",
    body: JSON.stringify({ qrToken }),
  });
}

export async function manualCheckIn(studentId: string): Promise<AttendanceSessionDTO> {
  return request<AttendanceSessionDTO>("/attendance/manual-checkin", {
    method: "POST",
    body: JSON.stringify({ studentId }),
  });
}

export async function manualCheckOut(studentId: string): Promise<AttendanceSessionDTO> {
  return request<AttendanceSessionDTO>("/attendance/manual-checkout", {
    method: "POST",
    body: JSON.stringify({ studentId }),
  });
}

export async function logout(): Promise<void> {
  try {
    await request<void>("/auth/logout", { method: "POST" });
  } catch {
    // Ignore logout errors — always clear local state
  } finally {
    setStoredAccessToken(null);
  }
}
