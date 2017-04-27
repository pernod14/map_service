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
add_markers();

//Generate Pins
function add_markers(){
		var points = [["Sens01", 35.52886542,139.2724587, "east"],
									["Sens02", 35.42886542,139.1724587, "center"],
									["Sens03", 35.62886542,139.3724587, "west"]
		];
		var marker = [];
		var i;
		for(i = 0; i < points.length; i++){
			marker[i] = new L.Marker([points[i][1], points[i][2]],{
				sens_no: points[i][3]
			});
			marker[i].addTo(map1);
			marker[i].on('click', onClick);
		};
}

// Evnet Handler
function onClick(e){
	console.log(this.options.sens_no);
	var val_moi = ["Moist10cm", "Moist40cm", "Moist70cm"],
			val_tmp = ["Temp10cm", "Temp40cm", "Temp70cm"];
	var fn = "./js/decagon_real.csv";
	var sens_no = this.options.sens_no;
	draw_chart(val_moi, fn, sens_no, idd = "#graphZone");
	draw_chart(val_tmp, fn, sens_no, idd = "#graphZone2");
}

// Draw Line Chart
// Copying https://bl.ocks.org/d3noob/4db972df5d7efc7d611255d1cc6f3c4f
function draw_chart(val, fn, sens_no, idd){
	// set the dimensions and margins of the graph
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
			width = 470 - margin.left - margin.right,
			height = width * .5 - margin.top - margin.bottom;

	// parse the date / time
	var parseTime = d3.timeParse("%Y/%m/%d %H:%M");

	// set the ranges
	var x = d3.scaleTime().range([0, width]);
	var y = d3.scaleLinear().range([height, 0]);
	console.log(val[0]);
	// define the 1st line
	var valueline = d3.line()
		.x(function(d){return x(d.Time); })
		.y(function(d){return y(d[val[0]]); });
	// define the 2nd line
	var valueline2 = d3.line()
		.x(function(d){return x(d.Time); })
		.y(function(d){return y(d[val[1]]); });
	// defien the 3rd line
	var valueline3 = d3.line()
		.x(function(d){return x(d.Time); })
		.y(function(d){return y(d[val[2]]); });

	// append the svg object to the graphZone of the page
	// append a 'group' element to 'svg'
	// moves the 'group' element to the top left margin
	var svg = d3.select(idd).append("svg")
				.attr("width", width + margin.top + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform",
								"translate(" + margin.left + "," + margin.top + ")");
	// Get the data
	d3.csv(fn, function(error, data){
		if(error) throw error;

		// format the data
		data.forEach(function(d){
			d.Time = parseTime(d.Time);
			d[val[0]] = +d[val[0]];
			d[val[1]] = +d[val[1]];
			d[val[2]] = +d[val[2]];
		});

		// Scale the range of the data
		x.domain(d3.extent(data, function(d){return d.Time; }));
		y.domain([d3.min(data, function(d){
								return Math.min(d[val[0]], d[val[1]], d[val[2]]);}),
							d3.max(data, function(d){
								return Math.max(d[val[0]], d[val[1]], d[val[3]]);})]);
		// Add the valueline path
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.style("stroke", "blue")
			.attr("d", valueline);
		// Add the valueline2 path
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.style("stroke", "red")
			.attr("d", valueline2);
		// Add the valueline2 path
		svg.append("path")
			.data([data])
			.attr("class", "line")
			.style("stroke", "green")
			.attr("d", valueline3);

		// Add the X axis
		svg.append("g")
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x));
		// Add the Y axis
		svg.append("g").call(d3.axisLeft(y));
	});
}

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
