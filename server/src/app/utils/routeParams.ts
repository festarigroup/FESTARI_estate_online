import CustomError from "#app/utils/CustomError.js";

/** Express 5 may type `req.params` values as `string | string[] | undefined`. */
export function requiredRouteParam(
  value: string | string[] | undefined,
  name = "id"
): string {
  const v =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value[0]
        : undefined;
  if (!v) {
    throw new CustomError(`Missing route parameter: ${name}`, 400);
  }
  return v;
}
