//everything is copied from a class example and needs to be updated
// Store our API endpoint inside queryUrl
//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson";
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
  createFeatures(data.features);
});

function chooseColor(depth){
    if (depth < 10) {
        color = "#80ff00";  //green
    }
    else if(depth < 30) {
        color = "#bfff00";  //yellow-green
    }
    else if(depth < 50) {
        color = "#ffff00";  //gold-yellow
    }
    else if(depth < 70) {
        color = "#ffbf00";  //peach
    }
    else if(depth < 90) {
        color = "#ff8000";  //orange
    }
    else {
        color = "#ff0000";  //red
    }
    return color
};

function createFeatures(eqData){
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    // function chooseColor(depth){
    //     if (depth < 10) {
    //         color = "#80ff00";  //green
    //     }
    //     else if(depth < 30) {
    //         color = "#bfff00";  //yellow-green
    //     }
    //     else if(depth < 50) {
    //         color = "#ffff00";  //gold-yellow
    //     }
    //     else if(depth < 70) {
    //         color = "#ffbf00";  //peach
    //     }
    //     else if(depth < 90) {
    //         color = "#ff8000";  //orange
    //     }
    //     else {
    //         color = "#ff0000";  //red
    //     }
    //     return color
    // };

    function styleInfo(feature) {
        return {
            fillOpacity: 0.5,
            color: chooseColor(feature.geometry.coordinates[2]),
            fillColor: chooseColor(feature.geometry.coordinates[2]),
            // Adjust radius
            radius: feature.properties.mag * 3
        }                    
        };

    var earthquakes = L.geoJson(eqData, {
        // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        // We set the style for each circleMarker using our styleInfo function.
        style: styleInfo,
        // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
        onEachFeature: function(feature, layer) {
            layer.bindPopup(
            "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
        }
        }); //.addTo(map);
    createMap(earthquakes);
};
            
            // var earthquakes = L.geoJSON(eqData, {
            //     pointToLayer: function (feature, latlng) {
            //         return L.circle(latlng, eqMarker).bindPopup("<h3>" + eqData[i].properties.place +
            //         "</h3><hr><p>" + new Date(eqData[i].properties.time) + "</p>");
            //     }
            // });
            
    
     // Sending our earthquakes layer to the createMap function



function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      0, -180
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

    // Create a legend to display information about our map
    var legend = L.control({
        position: "bottomright"
    });
    // When the layer control is added, insert a div with the class of "legend"
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        //grades = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
        grades = [-10,10,30,50,70,90],
        labels = ['<strong><h3>Earthquake Depth</h3></strong><hr>'];    
        var legend_colors = [
            "#80ff00",  //green
            "#bfff00",  //yellow-green
            "#ffff00",  //gold-yellow
            "#ffbf00",  //peach
            "#ff8000",  //orange
            "#ff0000"  //red
        ];
        div.innerHTML = labels;
        for (var i=0; i<grades.length; i++) {
            div.innerHTML +=
            "<br><i style = 'background: " + legend_colors[i] + "'></i> "
                + grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1]+"<br>" : "+")
            ;
        }
        
        return div;
    };
    // Add the info legend to the map
    legend.addTo(myMap);
  
};
