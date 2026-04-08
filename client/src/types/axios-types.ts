export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  success: false;
  status: number | null;
  message: string;
  errors: [] | object;
}

export type ApiResponse<T = unknown> = ApiSuccess<T>;