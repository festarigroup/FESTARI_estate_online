const EARTH_RADIUS_METERS = 6_371_000;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function getDistanceMeters(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((EARTH_RADIUS_METERS * c).toFixed(2));
}

export function getBearingDegrees(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);
  const diffLong = toRadians(toLng - fromLng);

  const y = Math.sin(diffLong) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(diffLong);

  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

export function clampLatitude(lat: number): boolean {
  return lat >= -90 && lat <= 90;
}

export function clampLongitude(lng: number): boolean {
  return lng >= -180 && lng <= 180;
}

export function isValidRadius(radius: number): boolean {
  return Number.isFinite(radius) && radius > 0 && radius <= 100000;
}
