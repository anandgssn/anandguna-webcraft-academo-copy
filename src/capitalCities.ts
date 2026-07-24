import L from "leaflet";

const CAPITALS: Array<[string,string,number,number]> = [
  ["Abu Dhabi","United Arab Emirates",24.467,54.367],["Abuja","Nigeria",9.067,7.483],["Accra","Ghana",5.55,-.2],["Addis Ababa","Ethiopia",9.03,38.74],["Algiers","Algeria",36.767,3.217],["Amman","Jordan",31.95,35.933],["Amsterdam","Netherlands",52.367,4.9],["Ankara","Turkey",39.52,32.52],["Antananarivo","Madagascar",-18.933,47.517],["Athens","Greece",37.97,23.72],
  ["Baghdad","Iraq",33.333,44.433],["Bangkok","Thailand",13.75,100.467],["Beijing","China",39.914,116.392],["Beirut","Lebanon",33.887,35.513],["Belgrade","Serbia",44.82,20.47],["Berlin","Germany",52.52,13.38],["Bern","Switzerland",46.95,7.45],["Bogotá","Colombia",4.598,-74.076],["Brasília","Brazil",-15.799,-47.867],["Brussels","Belgium",50.85,4.35],
  ["Bucharest","Romania",44.433,26.104],["Budapest","Hungary",47.472,19.05],["Buenos Aires","Argentina",-34.603,-58.382],["Cairo","Egypt",30.05,31.233],["Canberra","Australia",-35.308,149.124],["Caracas","Venezuela",10.5,-66.917],["Copenhagen","Denmark",55.68,12.57],["Dakar","Senegal",14.693,-17.447],["Damascus","Syria",33.513,36.292],["Dhaka","Bangladesh",23.7,90.375],
  ["Dublin","Ireland",53.348,-6.26],["Hanoi","Vietnam",21.033,105.85],["Harare","Zimbabwe",-17.864,31.03],["Havana","Cuba",23.133,-82.383],["Helsinki","Finland",60.171,24.938],["Islamabad","Pakistan",33.717,73.067],["Jakarta","Indonesia",-6.2,106.8],["Jerusalem","Israel",31.78,35.22],["Kabul","Afghanistan",34.533,69.167],["Kampala","Uganda",.314,32.581],
  ["Kathmandu","Nepal",27.7,85.333],["Khartoum","Sudan",15.633,32.533],["Kyiv","Ukraine",50.45,30.523],["Kigali","Rwanda",-1.944,30.059],["Kingston","Jamaica",18.017,-76.8],["Kinshasa","DR Congo",-4.325,15.322],["Kuala Lumpur","Malaysia",3.148,101.693],["Lima","Peru",-12.043,-77.028],["Lisbon","Portugal",38.714,-9.139],["London","United Kingdom",51.51,-.128],
  ["Madrid","Spain",40.4,-3.68],["Manila","Philippines",14.583,120.967],["Mexico City","Mexico",19.43,-99.13],["Minsk","Belarus",53.9,27.567],["Moscow","Russia",55.75,37.62],["Nairobi","Kenya",-1.283,36.817],["New Delhi","India",28.614,77.209],["Oslo","Norway",59.95,10.75],["Ottawa","Canada",45.421,-75.69],["Paris","France",48.86,2.35],
  ["Prague","Czech Republic",50.083,14.417],["Pretoria","South Africa",-25.746,28.188],["Reykjavík","Iceland",64.133,-21.933],["Riyadh","Saudi Arabia",24.633,46.717],["Rome","Italy",41.9,12.5],["Santiago","Chile",-33.45,-70.667],["Seoul","South Korea",37.567,126.978],["Singapore","Singapore",1.3,103.8],["Sofia","Bulgaria",42.7,23.333],["Stockholm","Sweden",59.329,18.069],
  ["Taipei","Taiwan",25.033,121.633],["Tehran","Iran",35.696,51.423],["Tokyo","Japan",35.69,139.692],["Tunis","Tunisia",36.8,10.183],["Vienna","Austria",48.2,16.367],["Warsaw","Poland",52.23,21.02],["Washington, D.C.","USA",38.9,-77.04],["Wellington","New Zealand",-41.289,174.777],["Windhoek","Namibia",-22.57,17.083],["Zagreb","Croatia",45.817,15.983]
  ,["Asunción","Paraguay",-25.2637,-57.5759],["Basseterre","Saint Kitts and Nevis",17.3026,-62.7177],["Belmopan","Belize",17.251,-88.759],["Bridgetown","Barbados",13.0975,-59.6167],["Castries","Saint Lucia",14.0101,-60.9875]
  ,["Georgetown","Guyana",6.8013,-58.1551],["Guatemala City","Guatemala",14.6349,-90.5069],["Kingstown","Saint Vincent and the Grenadines",13.1600,-61.2248],["Managua","Nicaragua",12.1149,-86.2362],["Montevideo","Uruguay",-34.9011,-56.1645]
  ,["Nassau","Bahamas",25.0443,-77.3504],["Panama City","Panama",8.9824,-79.5199],["Paramaribo","Suriname",5.852,-55.2038],["Port of Spain","Trinidad and Tobago",10.6549,-61.5019],["Port-au-Prince","Haiti",18.5944,-72.3074]
  ,["Quito","Ecuador",-0.1807,-78.4678],["Roseau","Dominica",15.3017,-61.3881],["Saint George's","Grenada",12.0561,-61.7488],["Saint John's","Antigua and Barbuda",17.1274,-61.8468],["San José","Costa Rica",9.9281,-84.0907]
  ,["San Salvador","El Salvador",13.6929,-89.2182],["Santo Domingo","Dominican Republic",18.4861,-69.9312],["Sucre","Bolivia",-19.0196,-65.2619],["Tegucigalpa","Honduras",14.0723,-87.1921]
  ,["Andorra la Vella","Andorra",42.5063,1.5218],["Baku","Azerbaijan",40.4093,49.8671],["Bratislava","Slovakia",48.1486,17.1077],["Chisinau","Moldova",47.0105,28.8638],["Ljubljana","Slovenia",46.0569,14.5058]
  ,["Luxembourg","Luxembourg",49.6116,6.1319],["Monaco","Monaco",43.7384,7.4246],["Nicosia","Cyprus",35.1856,33.3823],["Podgorica","Montenegro",42.4304,19.2594],["Pristina","Kosovo",42.6629,21.1655]
  ,["Riga","Latvia",56.9496,24.1052],["San Marino","San Marino",43.9424,12.4578],["Sarajevo","Bosnia and Herzegovina",43.8563,18.4131],["Skopje","North Macedonia",41.9973,21.428],["Tallinn","Estonia",59.437,24.7536]
  ,["Tbilisi","Georgia",41.7151,44.8271],["Tirana","Albania",41.3275,19.8187],["Vaduz","Liechtenstein",47.141,9.5209],["Valletta","Malta",35.8989,14.5146],["Vatican City","Vatican City",41.9029,12.4534]
  ,["Vilnius","Lithuania",54.6872,25.2797],["Yerevan","Armenia",40.1792,44.4991]
  ,["Bamako","Mali",12.6392,-8.0029],["Bangui","Central African Republic",4.3947,18.5582],["Banjul","Gambia",13.4549,-16.579],["Bissau","Guinea-Bissau",11.8817,-15.617],["Brazzaville","Republic of the Congo",-4.2634,15.2429]
  ,["Conakry","Guinea",9.6412,-13.5784],["Djibouti","Djibouti",11.5721,43.1456],["Dodoma","Tanzania",-6.163,35.7516],["Freetown","Sierra Leone",8.4657,-13.2317],["Gaborone","Botswana",-24.6282,25.9231]
  ,["Gitega","Burundi",-3.4264,29.9308],["Juba","South Sudan",4.8594,31.5713],["Libreville","Gabon",0.4162,9.4673],["Lilongwe","Malawi",-13.9626,33.7741],["Lobamba","Eswatini",-26.4465,31.2064]
  ,["Lomé","Togo",6.1256,1.2254],["Luanda","Angola",-8.839,13.2894],["Lusaka","Zambia",-15.3875,28.3228],["Malabo","Equatorial Guinea",3.7504,8.7371],["Maputo","Mozambique",-25.9692,32.5732]
  ,["Maseru","Lesotho",-29.3158,27.4869],["Mbabane","Eswatini",-26.3054,31.1367],["Mogadishu","Somalia",2.0469,45.3182],["Monrovia","Liberia",6.3156,-10.8074],["Moroni","Comoros",-11.7172,43.2473]
  ,["N'Djamena","Chad",12.1348,15.0557],["Niamey","Niger",13.5116,2.1254],["Nouakchott","Mauritania",18.0735,-15.9582],["Ouagadougou","Burkina Faso",12.3714,-1.5197],["Port Louis","Mauritius",-20.1609,57.5012]
  ,["Porto-Novo","Benin",6.4969,2.6289],["Praia","Cabo Verde",14.9331,-23.5133],["Rabat","Morocco",34.0209,-6.8416],["São Tomé","São Tomé and Príncipe",0.3365,6.7273],["Tripoli","Libya",32.8872,13.1913]
  ,["Victoria","Seychelles",-4.6191,55.4513],["Yamoussoukro","Côte d'Ivoire",6.8276,-5.2893],["Yaoundé","Cameroon",3.848,11.5021]
  ,["Ashgabat","Turkmenistan",37.9601,58.3261],["Astana","Kazakhstan",51.1694,71.4491],["Bandar Seri Begawan","Brunei",4.9031,114.9398],["Bishkek","Kyrgyzstan",42.8746,74.5698],["Dili","Timor-Leste",-8.5569,125.5603]
  ,["Doha","Qatar",25.2854,51.531],["Dushanbe","Tajikistan",38.5598,68.787],["Kuwait City","Kuwait",29.3759,47.9774],["Malé","Maldives",4.1755,73.5093],["Manama","Bahrain",26.2235,50.5876]
  ,["Muscat","Oman",23.588,58.3829],["Naypyidaw","Myanmar",19.7633,96.0785],["Phnom Penh","Cambodia",11.5564,104.9282],["Pyongyang","North Korea",39.0392,125.7625],["Ramallah","Palestine",31.9038,35.2034]
  ,["Sana'a","Yemen",15.3694,44.191],["Sri Jayawardenepura Kotte","Sri Lanka",6.8941,79.9025],["Tashkent","Uzbekistan",41.2995,69.2401],["Thimphu","Bhutan",27.4728,89.639],["Ulaanbaatar","Mongolia",47.8864,106.9057]
  ,["Vientiane","Laos",17.9757,102.6331]
  ,["Apia","Samoa",-13.8507,-171.7514],["Funafuti","Tuvalu",-8.5211,179.1983],["Honiara","Solomon Islands",-9.4456,159.9729],["Majuro","Marshall Islands",7.1164,171.1858],["Ngerulmud","Palau",7.5006,134.6242]
  ,["Nuku'alofa","Tonga",-21.1393,-175.2049],["Palikir","Federated States of Micronesia",6.9248,158.1611],["Port Moresby","Papua New Guinea",-9.4438,147.1803],["Port Vila","Vanuatu",-17.7333,168.3273],["South Tarawa","Kiribati",1.4518,173.0347]
  ,["Suva","Fiji",-18.1248,178.4501],["Yaren","Nauru",-0.5477,166.9209]
];

export function mountCapitalCities(root:HTMLElement){
  root.innerHTML='<div class="capital-cities-map" aria-label="Interactive world map of capital cities"></div>';
  const element=root.querySelector<HTMLElement>(".capital-cities-map")!,map=L.map(element,{worldCopyJump:true}).setView([20,0],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19}).addTo(map);
  CAPITALS.forEach(([city,country,lat,lng])=>{const marker=L.circleMarker([lat,lng],{radius:5,color:"#fff",weight:1,fillColor:"#d33",fillOpacity:.9}).addTo(map);marker.bindPopup(`<strong>${city}</strong>, ${country}<br><button type="button" class="capital-zoom">Zoom In</button>`);marker.on("popupopen",()=>{const button=marker.getPopup()?.getElement()?.querySelector<HTMLButtonElement>(".capital-zoom");button?.addEventListener("click",()=>map.setView([lat,lng],8),{once:true})})});
  new ResizeObserver(()=>map.invalidateSize()).observe(element);
}
