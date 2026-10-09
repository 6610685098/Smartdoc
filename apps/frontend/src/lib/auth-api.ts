import type {
  AuthResponse,
  CurrentUserResponse,
  LoginDto,
  LogoutResponse,
  RegisterDto,
} from '@smartdoc/types';

export class AuthApiError extends Error {
  statusCode: number;
  details?: string[];

  constructor(message: string, statusCode: number = 500, details?: string[]) {
    super(message);
    this.name = 'AuthApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Returns the sanitized base URL for backend API calls.
 */
function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return url.replace(/\/$/, '');
}

/**
 * Translates known backend error messages or codes into user-friendly Thai.
 */
function translateErrorMessage(msg: string): string {
  const lower = msg.toLowerCase();

  if (
    lower.includes('invalid credentials') ||
    lower.includes('unauthorized') ||
    lower.includes('wrong password') ||
    lower.includes('invalid email or password')
  ) {
    return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
  }

  if (
    lower.includes('already exists') ||
    lower.includes('already registered') ||
    lower.includes('email must be unique') ||
    lower.includes('user with this email already exists')
  ) {
    return 'อีเมลนี้ถูกลงทะเบียนใช้งานในระบบแล้ว';
  }

  if (lower.includes('email must be an email')) {
    return 'รูปแบบอีเมลไม่ถูกต้อง';
  }

  if (
    lower.includes('password must be longer') ||
    lower.includes('password length') ||
    lower.includes('password should not be empty')
  ) {
    return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
  }

  if (lower.includes('fullname') || lower.includes('name must not be empty')) {
    return 'กรุณาระบุชื่อ-นามสกุล';
  }

  if (lower.includes('user not found')) {
    return 'ไม่พบบัญชีผู้ใช้งานในระบบ';
  }

  return msg;
}

/**
 * Parses HTTP error payload from NestJS API and extracts a Thai error message.
 */
function parseErrorMessage(data: unknown, status: number): string {
  if (typeof data === 'object' && data !== null) {
    const errorObj = data as Record<string, unknown>;

    // NestJS format: { statusCode: number, message: string | string[], error?: string }
    if (errorObj.message) {
      if (Array.isArray(errorObj.message)) {
        return errorObj.message.map((m) => translateErrorMessage(String(m))).join(', ');
      }
      return translateErrorMessage(String(errorObj.message));
    }

    if (typeof errorObj.error === 'string') {
      return translateErrorMessage(errorObj.error);
    }
  }

  switch (status) {
    case 400:
      return 'ข้อมูลที่ระบุไม่ถูกต้อง กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง';
    case 401:
      return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือเซสชันหมดอายุ';
    case 403:
      return 'คุณไม่มีสิทธิ์ในการเข้าถึงส่วนนี้';
    case 404:
      return 'ไม่พบข้อมูลที่ร้องขอ';
    case 409:
      return 'อีเมลนี้ถูกใช้งานในระบบแล้ว';
    case 500:
    default:
      return 'เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่อีกครั้งภายหลัง';
  }
}

/**
 * Universal fetch wrapper for authentication endpoints.
 * Enforces credentials: 'include' (for HTTP-Only smartdoc_token cookie).
 */
async function fetchAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      const errorMessage = parseErrorMessage(data, response.status);
      throw new AuthApiError(errorMessage, response.status);
    }

    return data as T;
  } catch (error) {
    if (error instanceof AuthApiError) {
      throw error;
    }

    // Network errors, connection refused, or DNS failures
    throw new AuthApiError(
      'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตหรือสถานะเซิร์ฟเวอร์',
      0
    );
  }
}

/**
 * Register a new user in the system.
 */
export async function register(data: RegisterDto): Promise<AuthResponse> {
  return fetchAuth<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Authenticate existing user and receive HTTP-Only cookie session.
 */
export async function login(data: LoginDto): Promise<AuthResponse> {
  return fetchAuth<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Terminate user session and clear HTTP-Only cookie.
 */
export async function logout(): Promise<LogoutResponse> {
  return fetchAuth<LogoutResponse>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * Retrieve currently authenticated user profile from active session cookie.
 */
export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return fetchAuth<CurrentUserResponse>('/auth/me', {
    method: 'GET',
    cache: 'no-store',
  });
}
