export function successResponse(data: Record<string, unknown>): Record<string, unknown> {
  return { success: true, data };
}

export function errorResponse(code: string, message: string): Record<string, unknown> {
  return { success: false, error: { code, message } };
}
