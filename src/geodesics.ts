import L, { type LatLng } from "leaflet";

const START: [number, number] = [39.64, -115.49];
const END: [number, number] = [-22.69, 52.98];

export function mountGeodesics(root: HTMLElement) {
  root.innerHTML = `<div class="geodesics-layout"><div class="geodesics-map" aria-label="Map comparing a projected straight line and a great-circle geodesic"></div><div class="geodesics-controls">${readout("Origin","origin")}${readout("Destination","destination")}${readout("Heading","heading")}</div></div>`;
  const mapElement=root.querySelector<HTMLElement>(".geodesics-map")!;
  const map=L.map(mapElement).setView([25.8,-35.69],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  const marker1=L.marker(START,{draggable:true,title:"Origin"}).addTo(map),marker2=L.marker(END,{draggable:true,title:"Destination"}).addTo(map);
  const projected=L.polyline([START,END],{color:"#f00",weight:3}).addTo(map);
  const geodesic=L.polyline(greatCircle(marker1.getLatLng(),marker2.getLatLng()),{color:"#c09",weight:3}).addTo(map);
  function update(){const a=marker1.getLatLng(),b=marker2.getLatLng();projected.setLatLngs([a,b]);geodesic.setLatLngs(greatCircle(a,b));set("origin",coordinate(a));set("destination",coordinate(b));set("heading",`${bearing(a,b).toFixed(2)}°`)}
  function set(name:string,value:string){root.querySelector<HTMLOutputElement>(`[data-${name}]`)!.value=value}
  marker1.on("drag",update);marker2.on("drag",update);new ResizeObserver(()=>map.invalidateSize()).observe(mapElement);update();
}
function readout(label:string,name:string){return `<div class="geodesics-readout"><label>${label}</label><output data-${name}></output></div>`}
function coordinate(point:LatLng){return `(${point.lat.toFixed(2)}°, ${point.lng.toFixed(2)}°)`}
function bearing(a:LatLng,b:LatLng){const r=Math.PI/180,p1=a.lat*r,p2=b.lat*r,d=(b.lng-a.lng)*r;return Math.atan2(Math.sin(d)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(d))*180/Math.PI}
function greatCircle(a:LatLng,b:LatLng){const r=Math.PI/180,v=(p:LatLng)=>{const lat=p.lat*r,lng=p.lng*r;return [Math.cos(lat)*Math.cos(lng),Math.cos(lat)*Math.sin(lng),Math.sin(lat)]};const x=v(a),y=v(b),omega=Math.acos(Math.max(-1,Math.min(1,x[0]*y[0]+x[1]*y[1]+x[2]*y[2]))),sin=Math.sin(omega);return Array.from({length:101},(_,i)=>{const t=i/100,s1=Math.sin((1-t)*omega)/sin,s2=Math.sin(t*omega)/sin,X=x.map((n,j)=>n*s1+y[j]*s2),lat=Math.atan2(X[2],Math.hypot(X[0],X[1]))/r,lng=Math.atan2(X[1],X[0])/r;return [lat,lng] as [number,number]})}
