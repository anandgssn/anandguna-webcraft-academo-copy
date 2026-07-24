import L, { type LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

const DIRECTIONS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const DEFAULT_ORIGIN: [number, number] = [51.508056, -0.128056];
const DEFAULT_TARGET: [number, number] = [51.509722, -0.126389];

export function mountAzimuthCalculator(root: HTMLElement) {
  root.innerHTML = `
    <div class="azimuth-layout">
      <div class="azimuth-map" aria-label="Interactive map with draggable location and target markers"></div>
      <div class="azimuth-controls">
        <div class="azimuth-readout"><label>Azimuth</label><output data-azimuth></output></div>
        <div class="azimuth-readout"><label>Direction</label><output data-direction></output></div>
        <button type="button" data-current-location>Set marker to you current location</button>
        <p class="azimuth-status" aria-live="polite"></p>
      </div>
    </div>`;

  const mapElement = root.querySelector<HTMLElement>(".azimuth-map")!;
  const azimuthOutput = root.querySelector<HTMLOutputElement>("[data-azimuth]")!;
  const directionOutput = root.querySelector<HTMLOutputElement>("[data-direction]")!;
  const status = root.querySelector<HTMLElement>(".azimuth-status")!;
  const map = L.map(mapElement, { zoomControl: true }).setView(DEFAULT_ORIGIN, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const originIcon = L.divIcon({
    className: "azimuth-leaflet-origin",
    html: '<span aria-hidden="true"></span>',
    iconSize: [24, 36],
    iconAnchor: [12, 36]
  });
  const starIcon = L.divIcon({
    className: "azimuth-leaflet-star",
    html: '<span aria-hidden="true">&#9733;</span>',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  const origin = L.marker(DEFAULT_ORIGIN, { draggable: true, icon: originIcon, title: "Your location" }).addTo(map);
  const target = L.marker(DEFAULT_TARGET, { draggable: true, icon: starIcon, title: "Target direction" }).addTo(map);
  const line = L.polyline([origin.getLatLng(), target.getLatLng()], { color: "#f00", weight: 3 }).addTo(map);

  function update() {
    const start = origin.getLatLng();
    const end = target.getLatLng();
    line.setLatLngs([start, end]);
    const angle = bearing(start, end);
    azimuthOutput.value = `${Math.round(angle)}°`;
    directionOutput.value = DIRECTIONS[Math.floor((angle + 11.25) / 22.5) % 16];
  }

  origin.on("drag", update);
  target.on("drag", update);
  root.querySelector<HTMLButtonElement>("[data-current-location]")!.addEventListener("click", () => {
    if (!navigator.geolocation) {
      status.textContent = "Geolocation is not supported by your browser.";
      return;
    }
    status.textContent = "Locating...";
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const position = L.latLng(coords.latitude, coords.longitude);
      origin.setLatLng(position);
      target.setLatLng([coords.latitude + 0.001, coords.longitude + 0.001]);
      map.setView(position, 15);
      status.textContent = "Current location set as the map origin.";
      update();
    }, () => { status.textContent = "Your location could not be accessed."; });
  });

  new ResizeObserver(() => map.invalidateSize()).observe(mapElement);
  update();
}

function bearing(start: LatLng, end: LatLng) {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const latitude1 = toRadians(start.lat);
  const latitude2 = toRadians(end.lat);
  const longitudeDelta = toRadians(end.lng - start.lng);
  const y = Math.sin(longitudeDelta) * Math.cos(latitude2);
  const x = Math.cos(latitude1) * Math.sin(latitude2) - Math.sin(latitude1) * Math.cos(latitude2) * Math.cos(longitudeDelta);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
