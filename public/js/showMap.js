

mapboxgl.accessToken = token;
let c=camp
let loc;
//console.log(c.geometry);
if(c.geometry){
    loc=c.geometry.coordinates
}else{
    loc=[139.749466,35.686958]
}
const map = new mapboxgl.Map({
container: 'map', // container ID
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/streets-v12', // style URL
center: loc, // starting position [lng, lat]
zoom: 13 // starting zoom
});


const marker1 = new mapboxgl.Marker()
.setLngLat(loc)
.setPopup(
    new mapboxgl.Popup({offset:5})
    .setHTML(`<strong>${c.title}</strong><p>${c.location}</p>`)

)
.addTo(map);

map.addControl(new mapboxgl.NavigationControl());