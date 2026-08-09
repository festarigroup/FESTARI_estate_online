import CustomError from "#app/utils/CustomError.js";

function parseScheduleTime(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value == null || value === "") return null;

  if (typeof value !== "string") {
    throw new CustomError("Invalid schedule time format.", 400);
  }

  const trimmed = value.trim();

  if (/^\d{1,2}:\d{2}(:\d{2})?$/i.test(trimmed) && !/am|pm/i.test(trimmed)) {
    return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
  }

  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    throw new CustomError("Invalid schedule time format.", 400);
  }

  let hours = parseInt(match[1]!, 10);
  const minutes = match[2]!;
  const period = match[3]!.toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${minutes}:00`;
}

function parsePickupLocation(value: unknown): [number, number] | undefined {
  if (value === undefined) return undefined;

  if (Array.isArray(value) && value.length === 2) {
    const lng = Number(value[0]);
    const lat = Number(value[1]);
    if (Number.isFinite(lng) && Number.isFinite(lat)) {
      return [lng, lat];
    }
  }

  if (typeof value === "object" && value !== null) {
    const geo = value as { coordinates?: [number, number] };
    if (Array.isArray(geo.coordinates) && geo.coordinates.length === 2) {
      const lng = Number(geo.coordinates[0]);
      const lat = Number(geo.coordinates[1]);
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        return [lng, lat];
      }
    }
  }

  throw new CustomError("Invalid pickup_location.", 400);
}

function parseScheduleDate(value: unknown): Date {
  const parsed =
    value instanceof Date ? value : new Date(String(value ?? ""));

  if (Number.isNaN(parsed.getTime())) {
    throw new CustomError("Invalid scheduled_date.", 400);
  }

  return parsed;
}

function isSameLocalDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseTimeToDate(date: Date, value: string) {
  const [rawHour, rawMinute] = value.split(":");
  const hour = Number(rawHour);
  const minute = Number(rawMinute);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    throw new CustomError("Invalid schedule time format.", 400);
  }

  const result = new Date(date);
  result.setHours(hour, minute, 0, 0);
  return result;
}

function validateScheduleDateTime(normalized: Record<string, unknown>) {
  const scheduledDate = normalized.scheduled_date as Date | undefined;
  if (!scheduledDate) return;

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  if (scheduledDate < todayStart) {
    throw new CustomError("Scheduled date cannot be in the past.", 400);
  }

  const startTime = normalized.start_time as string | undefined;
  const endTime = normalized.end_time as string | undefined;

  const sameDay = isSameLocalDate(scheduledDate, now);
  const startDateTime = startTime ? parseTimeToDate(scheduledDate, startTime) : null;
  const endDateTime = endTime ? parseTimeToDate(scheduledDate, endTime) : null;

  if (sameDay && startDateTime && startDateTime < now) {
    throw new CustomError("Start time cannot be in the past.", 400);
  }

  if (sameDay && endDateTime && endDateTime < now) {
    throw new CustomError("End time cannot be in the past.", 400);
  }

  if (startDateTime && endDateTime && endDateTime <= startDateTime) {
    throw new CustomError("End time must be after start time.", 400);
  }
}

export function normalizeScheduleInput(body: Record<string, unknown>) {
  const normalized: Record<string, unknown> = { ...body };

  if ("scheduled_date" in body && body.scheduled_date != null) {
    normalized.scheduled_date = parseScheduleDate(body.scheduled_date);
  }

  if ("estimated_price" in body && body.estimated_price != null) {
    normalized.estimated_price = Math.round(Number(body.estimated_price));
  }

  if ("start_time" in body) {
    normalized.start_time = parseScheduleTime(body.start_time);
  }

  if ("end_time" in body) {
    normalized.end_time = parseScheduleTime(body.end_time);
  }

  if ("pickup_location" in body && body.pickup_location != null) {
    normalized.pickup_location = parsePickupLocation(body.pickup_location);
  }

  validateScheduleDateTime(normalized);

  return normalized;
}
