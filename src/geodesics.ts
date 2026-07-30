import L, { type LatLng, type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
// Fix Leaflet default icon URLs in Vite bundler — without this, marker-icon.png 404s
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  calculateBearing,
  calculateGreatCircle,
  formatCoordinate
} from "./geodesicMath";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
});

const START: LatLngExpression = [39.64, -115.49];
const END: LatLngExpression = [-22.69, 52.98];
function renderReadout(label: string, name: string) {
  return `<div class="geodesics-readout"><label>${label}</label><output data-${name}></output></div>`;
}

export function mountGeodesics(root: HTMLElement) {
  root.innerHTML = `
    <div class="geodesics-layout">
      <div class="geodesics-map" aria-label="Map comparing a projected straight line and a great-circle geodesic"></div>
      <div class="geodesics-controls">
        ${renderReadout("Origin", "origin")}
        ${renderReadout("Destination", "destination")}
        ${renderReadout("Heading", "heading")}
      </div>
    </div>`;

  const mapElement = root.querySelector<HTMLElement>(".geodesics-map")!;
  const map = L.map(mapElement).setView([25.8, -35.69], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const originMarker = L.marker(START, { draggable: true, title: "Origin" }).addTo(map);
  const destinationMarker = L.marker(END, { draggable: true, title: "Destination" }).addTo(map);
  const projectedLine = L.polyline([START, END], { color: "#f00", weight: 3 }).addTo(map);
  const geodesicLine = L.polyline(
    calculateGreatCircle(originMarker.getLatLng(), destinationMarker.getLatLng()),
    { color: "#c09", weight: 3 }
  ).addTo(map);

  function setReadout(name: string, value: string) {
    root.querySelector<HTMLOutputElement>(`[data-${name}]`)!.value = value;
  }

  function update() {
    const origin: LatLng = originMarker.getLatLng();
    const destination: LatLng = destinationMarker.getLatLng();
    projectedLine.setLatLngs([origin, destination]);
    geodesicLine.setLatLngs(calculateGreatCircle(origin, destination));
    setReadout("origin", formatCoordinate(origin));
    setReadout("destination", formatCoordinate(destination));
    setReadout("heading", `${calculateBearing(origin, destination).toFixed(2)}°`);
  }

  originMarker.on("drag", update);
  destinationMarker.on("drag", update);
  new ResizeObserver(() => map.invalidateSize()).observe(mapElement);
  update();
}
