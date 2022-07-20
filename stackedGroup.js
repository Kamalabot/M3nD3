//creating the data
var n = 4, // Series here means the categories.
    m = 58; // Each Category has 58 values.
//Thinkin of extending this example to include Histograms of 
//the categories...

// The xz array has m elements, representing the x-values shared by all series.
// The yz array has n elements, representing the y-values of each of the n series.
// Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
// The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
const bumps = (m) => {
    var values = [], i, j, w, x, y, z;

    // Initialize with uniform random values in [0.1, 0.2).
    for (i = 0; i < m; ++i) {
      values[i] = 0.1 + 0.1 * Math.random();
    }
      // Add five random bumps.
    for (j = 0; j < 5; ++j) {
        x = 1 / (0.1 + Math.random());
        y = 2 * Math.random() - 0.5;
        z = 10 / (0.1 + Math.random());
        
        for (i = 0; i < m; i++) {
        w = (i / m - y) * z;
        values[i] += x * Math.exp(-w * w);
        }
    }
        // Ensure all values are positive.
    for (i = 0; i < m; ++i) {
        values[i] = Math.max(0, values[i]);
    }
    return values;
}

//console.log(bumps(m))

var xz = d3.range(m);

var yz = d3.range(n).map(() => bumps(m));
console.log(yz)
var y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz));
//console.log(y01z) //creates a stack of 4 array that hold the 58 category vals
var yMax = d3.max(yz, (y) => d3.max(y));
var y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]));
//console.log(y1Max);
//boilerplate svg code
var svg = d3.select("svg"),
    margin = {top: 40, right: 10, bottom: 20, left: 10},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand().domain(xz)
    .rangeRound([0,width])
    .padding(0.08)

var y = d3.scaleLinear().domain([0,y1Max])
    .range([height,0])

var color = d3.scaleOrdinal()
    .domain(d3.range(n))
    .range(d3.schemeTableau10)//Try color brewer here...

// console.log(color(2)) //testing the output of the scales
// console.log(x(2))
// console.log(y(2))

//starting the chart building code...

var series = g.selectAll(".series")//why use .series
    .data(y01z)
    .enter().append('g')
    .attr('fill', (d,i) => color(i))

var rect = series.selectAll("rect")
    .data(d => d)
    .enter().append('rect')
    .attr('x',(d,i) => x(i))
    .attr('y',height)
    .attr('width',x.bandwidth())
    .attr('height',0)

rect.transition()
    .delay((d,i) => i * 10)
    .attr('y', d => y(d[1]))
    .attr('height',d => y(d[0]) - y(d[1]))
g.append('g')
    .attr('class','axis axis--x')
    .attr('transform',`translate(0,${height})`)
    .call(d3.axisBottom(x)
            .tickSize(0)
            .tickPadding(6))
// g.append('g')
//     .attr('class','axis axis--y')
//     .attr('transform',`translate(10,0)`)
//     .call(d3.axisLeft(y)
//             .tickSize(0)
//             .tickPadding(6))
d3.selectAll('input').on('change', changed);

var timeout = d3.timeout(()=>{
    d3.select("input[value=\"grouped\]")
        .property("checked",true)
        .dispatch("change")
}, 2000);

function changed(){
    timeout.stop();
    if(this.value === 'grouped')transitionGrouped();
    else transitionStacked();
}

function transitionGrouped(){
    y.domain([0, yMax])

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .attr("x", function(d, i) { return x(i) + x.bandwidth() / n * this.parentNode.__data__.key; })
        .attr("width",x.bandwidth()/n)
        .transition()
        .attr("y", d => y(d[1] - d[0]))
        .attr('height', d => y(0) - y(d[1] - d[0]))
}

function transitionStacked(){
    y.domain([0, yMax])

    rect.transition()
        .duration(500)
        .delay((d, i) => i * 10)
        .attr("y", d => y(d[1]))
        .attr("height",d => y(d[0]) - y(d[1]))
        .transition()
        .attr("x", (d,i) => x(i))
        .attr('width', x.bandwidth());
}