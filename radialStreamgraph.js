
var n = 20, // number of layers
    m = 200, // number of samples per layer
    k = 10; // number of bumps per layer

// nShifts the baseline so as to minimize the weighted wiggle of layers. This offset is recommended for streamgraphs in 
// conjunction with the inside-out order. See Stacked Graphs—Geometry & Aesthetics by Bryon & Wattenberg for more information.
// stackkeys(d3.range(n)) presumably produces a key for each element within the range
var stack = d3.stack().keys(d3.range(n)).offset(d3.stackOffsetWiggle),
    layers0 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers1 = stack(d3.transpose(d3.range(n).map(function() { return bumps(m, k); }))),
    layers = layers0.concat(layers1);


var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");
    

var angle = d3.scaleLinear()
    .range([0, 2* Math.PI])
    .domain([0, m - 1]);

var x = d3.scaleLinear()
    .domain([0, m - 1])
    .range([0, width]);

var radius = d3.scaleLinear()
    .domain([d3.min(layers, stackMin), d3.max(layers, stackMax)])
    .range([height*1/2, height * 1/16]);

var z = d3.interpolateCool;

var areaR = d3.radialArea()
    .curve(d3.curveCardinalClosed)
    .angle(function(d, i) { return angle(i); })
    .innerRadius(function(d) { return radius(d[0]); })
    .outerRadius(function(d) { return radius(d[1]); });


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


function stackMax(layer) {
  return d3.max(layer, function(d) { return d[1]; });
}

function stackMin(layer) {
  return d3.min(layer, function(d) { return d[0]; });
}

function transition() {
  var t;
  d3.selectAll("path")
    .data((t = layers1, layers1 = layers0, layers0 = t)) // transision function switches layers
    .transition()
      .duration(500)
      .attr("d", areaR);
}

// Inspired by Lee Byron’s test data generator.
function bumps(n, m) {
  var a = [], i;
  for (i = 0; i < n; ++i) a[i] = 0;
  for (i = 0; i < m; ++i) bump(a, n);
  return a;
}

function bump(a, n) {
  var x = 1 / (0.1 + Math.random()),
      y = 2 * Math.random() - 0.5,
      z = 10 / (0.1 + Math.random());
  for (var i = 0; i < n; i++) {
    var w = (i / n - y) * z;
    a[i] += x * Math.exp(-w * w);
  }
}
