// Require leaflet.heat plugin
// http://day-journal.com/blog/leaflet-027-%E3%83%92%E3%83%BC%E3%83%88%E3%83%9E%E3%83%83%E3%83%97/
var mapTiles = L.tileLayer(
	'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	{
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		maxZoom: 18
	});

var map = L.map('map', {
	center: [35.8529, 139.4122],
	zoom: 14,
	layers: [mapTiles],
});

var heat = L.heatLayer([
    [35.8559, 139.4122, 20],
    [35.8529, 139.4121, 20],
    [35.8529, 139.4120, 10],
    [35.8528, 139.4122, 50],
    [35.8528, 139.4121, 40],
    [35.8528, 139.4120, 10],
    [35.8517, 139.4122, 10],
    [35.8517, 139.4121, 10],
    [35.8507, 139.4120, 10],
  ],{
    radius: 10
  }).addTo(map);


// Read CSV and Convert to array
function getCSV(){
    var req = new XMLHttpRequest();
    req.open("GET", "./js/sample.csv", true);
    //req.send(null);

    req.onload = function(){
	     convertCSVtoArray(req.responseText);
    }
}

function convertCSVtoArray(str){
    var result = [];
    var tmp = str.split("\n");

    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
    console.log(result[1][2]); // 300yen
}
