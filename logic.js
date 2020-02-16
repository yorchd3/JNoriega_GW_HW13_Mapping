// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function do_OnEachFeature(feature, obj) {
    obj.bindPopup("<h1>" + feature.properties.mag + "<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    
    // console.log(feature.geometry.coordinates);
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: do_OnEachFeature,
    style: geojsonMarkerOptions,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    }
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}


// JORGE BEG Loop through the cities array and create one marker for each city object
function geojsonMarkerOptions(feature) {
  return {
  fillOpacity: 0.75,
  color: "white",
  fillColor: getColor(feature.properties.mag),
  // Setting our circle's radius equal to the output of our markerSize function
  // This will make our marker's size proportionate to its population
  radius: markerSize(feature.properties.mag)*3
  };
}

// Define a getColor function that will give each magnitude a different color
function getColor(magnitude) {
  switch (true) {
    case magnitude > 4:
      return "red";
    case magnitude > 3:
      return "orange";
    case magnitude > 1:
      return "blue";
    };
}

// Define a markerSize function that will give each city a different radius based on its population
function markerSize(magnitude) {
  return magnitude;
}
// jorge end


function createMap(earthquakes) {

  // Define streetmap and pirate layers
  var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });

  var pirate = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Pirate": pirate
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      9.9305, -84.0786

    ],
    zoom: 2.5,
    layers: [pirate, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
