/*
  Created by Sam Song
  CruzID: sasong
  CMPS161 Proj2

  The program takes in 1 file consisting of 
*/


// var n  number of layers: each layer is 1 object
// represented over a number of time

// var m  number of samples per layer:
// var k  number of bumps per layer


// variable to represent svg 
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    streamG = svg.append("sg");

var angle = d3.scaleLinear()
    .range([0, 2* Math.PI])

var radius = d3.scaleLinear()
    //.domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    .range([height*3/4, height*1/4 ]);

var z = d3.interpolateCool;

// Input read

// first function parses data
// second function operates upon the parsed data
var inputData;
d3.csv("data.csv", function(d, i, columns) 
{
  //console.log(columns);
  for (i = 1, t = 0; i < columns.length; ++i){
    t += d[columns[i]] = +d[columns[i]];
    //console.log(d[columns[i]]);
  }
  d.total = t;
  //console.log(d);
  return d;
}, function(error, data) 
{
	console.log(data);
	inputData = data;
	elements = data.columns;
	angle.domain(data.map(function(d){return d[elements[0]]})); // gets the domain for each element
	console.log(data.map(function(d){return d[elements[0]]}));
	radius.domain([0, d3.max(data, function(d) { return d.total; })]);
});

// calculates the area in a radial version
var areaR = d3.radialArea()
    .curve(d3.curveCardinalClosed)
    .angle(function(d, i) { return angle(i); })
    .innerRadius(function(d) { return radius(d[0]); })
    .outerRadius(function(d) { return radius(d[1]); });

// add time label to the function
// var axesLabel = 
// var 
function main1()
{
	// whats been ran
	svg.selectAll("path")
  		.data(layers0) // data
  		.enter().append("path")
    		.attr("class", "layer")
    		.attr("d", areaR)
    		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    		//.style("fill", function(d,i) { return color(Number(d.key.substring(1))); })

    		//.attr("d", area)
    		.attr("fill", function() { return z(Math.random()); }); // color?
    		//.attr("fill", function(){ return z(250)})
};

function main(){
	document.write(inputData);
};