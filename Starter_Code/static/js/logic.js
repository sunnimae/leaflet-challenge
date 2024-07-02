// Creating the map object
let myMap = L.map("map", {
  center: [36.3712, -117.0552],
  zoom: 6
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(geoData).then(function(response) {
  let earthquakes = response.features;

  let marker_limit = Math.min(earthquakes.length, 1000); // Limiting to 1000 markers

  for (let i = 0; i < marker_limit; i++) {
    let coordinates = earthquakes[i].geometry.coordinates;
    let magnitude = earthquakes[i].properties.mag;
    let depth = coordinates[2];
    let place = earthquakes[i].properties.place;

    // Customize marker radius based on magnitude
    let markerRadius = Math.sqrt(Math.abs(magnitude)) * 5;

    // Customize marker color based on depth
    let markerColor = getColor(depth);

    // Create marker and add to map
    L.circleMarker([coordinates[1], coordinates[0]], {
      radius: markerRadius,
      color: "black",
      fillColor: markerColor,
      fillOpacity: 0.8,
      weight:1
    }).bindTooltip(`<strong>Location:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`).addTo(myMap);
  }


// Add legend to the map
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
  let div = L.DomUtil.create('div', 'info legend');
  let grades = [0, 5, 10, 20];
  let colors = ["#DAF7A6", "#82E0AA", "#28B463", "#239B56"]; // Colors for each depth range

  // Loop through depth ranges and generate a label with a colored square for each range
  for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' + colors[i] + '"></i> ' +
      (grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km'));
  }

  return div;
};

legend.addTo(myMap);
});

// Function to calculate marker color based on depth
function getColor(depth) {
if (depth > 20) {
  return "#239B56"; // Dark green
} else if (depth > 10) {
  return "#28B463"; // Green
} else if (depth > 5) {
  return "#82E0AA"; // Light green
} else {
  return "#DAF7A6"; // Pale green
}
}