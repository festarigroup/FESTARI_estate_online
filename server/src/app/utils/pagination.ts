export function parsePaginationQuery(
  query: Record<string, unknown>,
  defaultLimit = 20,
  maxLimit = 100,
) {
  const rawLimit = Number(query.limit ?? defaultLimit);
  const rawPage = Number(query.page ?? 1);

  const limit = Math.min(
    Math.max(Number.isFinite(rawLimit) ? rawLimit : defaultLimit, 1),
    maxLimit,
  );
  const current_page = Math.max(Number.isFinite(rawPage) ? rawPage : 1, 1);
  const offset = (current_page - 1) * limit;

  return { limit, current_page, offset };
}

export function getTotalPages(total: number, limit: number) {
  return Math.ceil(Math.max(0, total) / limit);
}

export function parsePaginationParams(
  query: Record<string, unknown>,
  defaultLimit = 10,
  maxLimit = 1000,
) {
  const rawLimit = Number(query.limit ?? defaultLimit);
  const rawCurrentPage = Number(query.current_page ?? 1);

  const limit = Math.min(
    Math.max(Number.isFinite(rawLimit) ? rawLimit : defaultLimit, 1),
    maxLimit,
  );
  const current_page = Math.max(
    Number.isFinite(rawCurrentPage) ? rawCurrentPage : 1,
    1,
  );
  const offset = (current_page - 1) * limit;

  return { limit, current_page, offset };
}

export interface PaginationMetadata {
  total: number;
  pages: number;
  current_page: number;
  limit: number;
}

export function validatePaginationParams(
  current_page: number,
  limit: number,
  total: number,
): { current_page: number; limit: number } {
  const pages = getTotalPages(total, limit);

  if (current_page < 1) {
    current_page = 1;
  }

  if (current_page > pages && pages > 0) {
    current_page = pages;
  }

  return { current_page, limit };
}
