// retrieve today's date/endtime date
var todaysDate = new Date().toJSON().slice(0,10)
// retrieve 30 days prior to current date
var thirtyDays = new Date(new Date().setDate(new Date().getDate() - 30)).toJSON().slice(0,10);

//api call url set-up
var baseURL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson';
var days= `&starttime=${thirtyDays}&endtime=${todaysDate}`;
var magnitude = '&minmagnitude=5'

// assemble query
var url = baseURL + days + magnitude

// retrieve date 
d3.json(url).then(function(response) {
    
})
