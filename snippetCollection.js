//circle of circles with different colors ref https://bl.ocks.org/mbostock/846688
var g = svg.selectAll("g")
    .data(d3.range(0, 360, 2))
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + d + ")"; });

var circle = g.selectAll("circle")
    .data(d3.range(10))
  .enter().append("circle")
    .attr("cx", d3.scale.linear().domain([0, 9]).range([180, 240]))
    .attr("r", 4.5)
    .attr("fill", d3.scale.linear().domain([0, 9]).range(["brown", "steelblue"]))
    .attr("stroke", "black");


// Generate a log-normal distribution with a median of 30 minutes https://bl.ocks.org/mbostock/3048166
var values = d3.range(1000).map(d3.random.logNormal(Math.log(30), .4));

// Generate a histogram using twenty uniformly-spaced bins.
var data = d3.layout.histogram()
    .bins(x.ticks(20))
    (values);

var formatCount = d3.format(",.0f"),
formatTime = d3.time.format("%H:%M"),
formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

//the values are converted into the data format of bins using the layout
var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })