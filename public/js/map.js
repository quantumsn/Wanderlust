coordinates = coordinates.split(",");
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 9, // starting zoom
});

const marker1 = document.createElement("div");
const width = 40;
const height = 40;
marker1.className = "marker";
marker1.style.backgroundImage = `url(${listingImageUrl})`;
marker1.style.width = `${width}px`;
marker1.style.height = `${height}px`;
marker1.style.backgroundSize = "100%";

// Add markers to the map.
// new mapboxgl.Marker(marker1).setLngLat(marker.geometry.coordinates).addTo(map);
new mapboxgl.Marker(marker1, { color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25, className: "my-class" }) // sets a popup on this marker
      .setLngLat(coordinates)
      .setHTML(
        `<h6>${listingLocation}</h6> <p>Exact location will be provided after booking</p>`
      )
      .setMaxWidth("300px")
  )
  .addTo(map);
