// Require leaflet.heat plugin
// http://day-journal.com/blog/leaflet-027-%E3%83%92%E3%83%BC%E3%83%88%E3%83%9E%E3%83%83%E3%83%97/

var mapTiles = L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 22
	});
// mapboxgl.accessToken = 'pk.eyJ1IjoicGVybm9kMTQiLCJhIjoiY2owdnU2bGJnMDA0ZTJ3cWk0c2pwZmZuciJ9.JzziXsub9lijkthfcCO6eQ';
// var map = new mapboxgl.Map({
// 	center: [139.2724587, 35.52886542],
// 	zoom: 18,
// 	container: 'map',
// 	style: 'mapbox://styles/mapbox/dark-v9'
// });

// Set filePath and col Number
var MapCL = hmapGenerator("./js/dataCL.csv");
var MapDD = hmapGenerator("./js/dataDD.csv");
var MapK = hmapGenerator("./js/dataK.csv");

// Generator of Heatmaap
function hmapGenerator(fp){
	return L.heatLayer(csv2Array(fp),
			{
			radius : 12,
			// color of heatmap
			gradient: {
						 0.7: 'blue',
						 0.8: 'green',
						 0.9: 'yellow',
						 1.0: 'red'
				 }
	  });
};

var map1 = L.map('map1', {
		center: [35.52886542,139.2724587],
		zoom: 18,
		layers: [mapTiles, MapCL, MapDD, MapK],
});

var baseMaps = {
    "baseMap": mapTiles
};
var overlayMaps = {
    "CL": MapCL,
		"DD": MapDD,
		"K": MapK,
};
L.control.layers(baseMaps, overlayMaps).addTo(map1);

// Read CSV and Convert to array
function csv2Array(filePath) {
	var csvData = new Array();
	var req = new XMLHttpRequest();
	req.open("GET", filePath, false);
	req.send(null);

	var lines = req.responseText.split("\n");
	for (var i = 0; i < lines.length; ++i) {
		var cells = lines[i].split(",");
		if( cells.length != 1 ) {
			// Cast as Number
			cells = cells.map(function(element){return parseFloat(element);});
			csvData.push(cells);
		}
	}
	return csvData;
}
