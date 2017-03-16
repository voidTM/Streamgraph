/*
  Created by Sam Song
  CruzID: sasong
  CMPS161 Proj2

  The program takes in 1 csv to produce a cyclic streamgraph.
*/


// var n  number of layers: each layer is 1 object
// represented over a number of time

// var m  number of samples per layer:
// var k  number of bumps per layer


// variable to represent svg 
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    streamG = svg.append("sg");

var csvPath = "dataT.csv";

var angle = d3.scaleLinear()
    .range([0, 2* Math.PI]);

var angleT = d3.scaleTime()
    .range([0, 2*Math.PI])
    //.domain([new Date, new Date])
    //.nice(d3.timeDay);
// parses time read in to time format.
var parseT = d3.timeFormat("%Y-%m-%d %H:%M:%S").parse;
var parseT1 = d3.timeFormat('%H:%M');

var radius = d3.scaleLinear()
    //.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    .range([height*1/2, height*1/16 ]);

var z = d3.interpolateCool;

// Stack data
var n = 0; // number of layers
var m = 0; // number of samples per layer
var layerArr = [];
var layers;
var maxS = 0;
var minS = 0;
var labelColor = [];
var timeStamps = [];
//Important, each row is one "signal"
var startDay = "1-1-2000 ";
var maxT = new Date(startDay);
var minT = new Date(startDay);


function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}


// Input read

// Read in Data
var inputData; //raw data from d3.csv
var legend; // legend for each each
// first function parses data
// second function operates upon the parsed data
d3.csv("dataT.csv", function(d, i, columns) 
{
  //console.log(columns);
  for (i = 1, t = 0; i < columns.length; ++i){
    t += d[columns[i]] = +d[columns[i]];
  }
  d.total = t; 
  return d;
}, function(error, data) 
{
	//console.log(data);
	inputData = data;
	var elements = data.columns;

	m = data.length; // number of samples per layer
	n = elements.length - 1; // number of layers
	legend = data.columns.slice(1);
	angle.domain([0, m-1]); // sets the angular domain
  //angleT.format(d3.time.format("%H:%M"));

	//var stack = d3.stack().keys(d3.range(1)).offset(d3.stackOffsetWiggle)
	//angle.domain = [0, m - 1];

  var times = data.map(function(d){return d[elements[0]]});

  //presumes 24hour format
  for(var i = 0; i < times.length; i++)
  {
    //console.log(maxT)
    var t1 = new Date(startDay + times[i]);
    console.log(t1);
    var t = d3.timeParse(times[i]);
    timeStamps.push(t1);
  }

  minT = d3.min(timeStamps);

  maxT = d3.max(timeStamps);
  
  angleT.domain[minT, maxT];
  // Parse the data into stacks
  // first column is ignored as that it marks the time
  // parses each individual column as a seperate layer
	for(var i = 1; i < n+1; i++)
	{
		var row = data.map(function(d){return d[elements[i]]}); // gets all the data for a single layer
		layerArr.push(row);
	}
  var stack = d3.stack()
      .keys(d3.range(n))
      .offset(d3.stackOffsetWiggle)
      .order(d3.stackOrderInsideOut) 

  layers = stack(d3.transpose( layerArr));

  radius.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)]);

  findColorLabels(legend);
})


// calculates the area in a radial version
var areaR = d3.radialArea()
    .curve(d3.curveCardinalClosed)
    .angle(function(d, i) { return angle(i); })
    .innerRadius(function(d) { return radius(d[0]); })
    .outerRadius(function(d) { return radius(d[1]); });


// Creates 
var areaRT = d3.radialArea()
    .curve(d3.curveCardinalClosed)
    .angle(function(d, i) { return angleT(timeStamps[i]); })
    .innerRadius(function(d) {return radius(d[0]); })
    .outerRadius(function(d) { return radius(d[1]); });

// Returns a random integer between min and max
function randInt(min, max)
{
  return Math.floor(Math.random() * (max - min)) + min + 1;
}

function randColor()
{
  var color;
  // 16777215 = ffffff from decimal to hexidecimal
  color = randInt(0, 16777215);

  //convert to hexidecimal
  return '#' + color.toString(16);
}

// gives each element within the legend a color
function findColorLabels(set)
{
  setColor = [];
  for(i in set)
  {
    labelColor.push(randColor())
  }
}



// add time label to the function
// var axesLabel = 
// var 
function load()
{
	console.log("loading");
	// whats been ran
	svg.selectAll("path")
  		.data(layers) // data
  		.enter().append("path")
    		.attr("class", "layer")
    		.attr("d", areaRT)
        //.attr("d", areaRT)
    		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    		.style("fill", function(d,i) { return labelColor[i]})
};
