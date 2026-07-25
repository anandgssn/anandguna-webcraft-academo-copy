export type GeoPoint = { lat: number; lng: number };

const DEGREES_TO_RADIANS = Math.PI / 180;
const GEODESIC_SEGMENTS = 100;

export function formatCoordinate(point: GeoPoint) {
  return `(${point.lat.toFixed(2)}°, ${point.lng.toFixed(2)}°)`;
}

export function calculateBearing(origin: GeoPoint, destination: GeoPoint) {
  const originLatitude = origin.lat * DEGREES_TO_RADIANS;
  const destinationLatitude = destination.lat * DEGREES_TO_RADIANS;
  const longitudeDifference = (destination.lng - origin.lng) * DEGREES_TO_RADIANS;
  const y = Math.sin(longitudeDifference) * Math.cos(destinationLatitude);
  const x = Math.cos(originLatitude) * Math.sin(destinationLatitude)
    - Math.sin(originLatitude) * Math.cos(destinationLatitude) * Math.cos(longitudeDifference);
  return Math.atan2(y, x) / DEGREES_TO_RADIANS;
}

function toCartesian(point: GeoPoint) {
  const latitude = point.lat * DEGREES_TO_RADIANS;
  const longitude = point.lng * DEGREES_TO_RADIANS;
  return [
    Math.cos(latitude) * Math.cos(longitude),
    Math.cos(latitude) * Math.sin(longitude),
    Math.sin(latitude)
  ];
}

export function calculateGreatCircle(origin: GeoPoint, destination: GeoPoint) {
  const start = toCartesian(origin);
  const end = toCartesian(destination);
  const dotProduct = start.reduce((sum, coordinate, index) => sum + coordinate * end[index], 0);
  const angle = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
  const angleSine = Math.sin(angle);

  if (Math.abs(angleSine) < Number.EPSILON) {
    return [[origin.lat, origin.lng], [destination.lat, destination.lng]] as Array<[number, number]>;
  }

  return Array.from({ length: GEODESIC_SEGMENTS + 1 }, (_, index) => {
    const progress = index / GEODESIC_SEGMENTS;
    const startWeight = Math.sin((1 - progress) * angle) / angleSine;
    const endWeight = Math.sin(progress * angle) / angleSine;
    const point = start.map((coordinate, coordinateIndex) => (
      coordinate * startWeight + end[coordinateIndex] * endWeight
    ));
    const latitude = Math.atan2(point[2], Math.hypot(point[0], point[1])) / DEGREES_TO_RADIANS;
    const longitude = Math.atan2(point[1], point[0]) / DEGREES_TO_RADIANS;
    return [latitude, longitude] as [number, number];
  });
}
