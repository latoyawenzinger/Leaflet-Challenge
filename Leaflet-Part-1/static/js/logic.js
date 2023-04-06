// retrieve today's date/endtime date
var todaysDate = new Date().toJSON().slice(0,10)
// retrieve 30 days prior to current date
var thirtyDays = new Date(new Date().setDate(new Date().getDate() - 30)).toJSON().slice(0,10);
console.log(`${thirtyDays} - ${todaysDate}`)

//api call url set-up
var baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
var days= `&starttime=${thirtyDays}&endtime=${todaysDate}`;
var magnitude = '&minmagnitude=2'

// assemble query
var url = baseURL + days + magnitude

// function to determine marker size using location depth
function markerSize(magnitude) {
    return magnitude * 8000;
}

function depthColor(depth) {
    if (depth >= 90) {
        return 'rgb(255,0,0)';
      } else if (depth >= 70) {
        return 'rgb(255,128,0)';
      } else if (depth  >= 50) {
        return 'rgb(255,178,102)';
      } else if (depth  >= 30) {
        return 'rgb(255,255,51)';
      } else if (depth >= 10) {
        return 'rgb(153,255,51)';
      } else {
        return 'rgb(0,255,0)';
      }
}

// function to create map
function createMap (Quakes) {
     // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});


// Create a baseMaps object to hold the streetmap layer.
var baseMaps = {
  'Street Map': streetmap
};

// Create an overlayMaps object to hold the bikeStations layer.
var overlayMaps = {
  'Earthquakes': Quakes
};

// Create the map object with options.
var myMap = L.map('map', {
  center: [40.09, -103.71],
  zoom: 5,
  layers: [streetmap, Quakes]
});

// set legend layer control position
var legend = L.control({
    position: 'bottomright'
  });
  
  // when the layer control is added, insert a div with the class of 'legend'.
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML =  `<ul>
    <li><span style='background:rgb(0,255,0);'></span>-10-10</li>
    <li><span style='background:rgb(153,255,51);'></span>10-30 </li>
    <li><span style='background:rgb(255,255,51);'></span>30-50 </li>
    <li><span style='background:rgba(255, 179, 102, 0.96);',></span>50-70</li>
    <li><span style='background:rgb(255, 119, 0);'></span>70-90</li>
    <li><span style='background:rgb(255,0,0);'></span>90+</li>
    </ul>`;
    return div;
  };
  // add the info legend to the map.
  legend.addTo(myMap);

 }

// retrieve data
d3.json(url).then(function(response) {

    console.log(url)
    
    var earthQuakes = response.features
    // create array to hold marker locations and pop-up text
    var Quakes = [];
    earthQuakes.forEach(earthQuake => Quakes.push(
        L.circle([earthQuake.geometry.coordinates[1], earthQuake.geometry.coordinates[0]], {
        stroke: true,
        weight: 0.5,
        opacity: 1,
        fillOpacity: 1,
        color: 'black',
        fillColor: depthColor(earthQuake.geometry.coordinates[2]),
        radius: markerSize(earthQuake.properties.mag)})
        .bindPopup('<h3><h3>Time: ' + new Date(earthQuake.properties.time).toLocaleString() + 
        '<h3><h3>Location: ' + earthQuake.properties.place +
        '<h3><h3>Magnitude: ' + earthQuake.properties.mag + '</h3>' +
        '<h3><h3>Depth: ' + earthQuake.geometry.coordinates[2] + '</h3>')
        ));

    
    // use funcition to auto-create map based of api data
    createMap(L.layerGroup(Quakes))      
})


