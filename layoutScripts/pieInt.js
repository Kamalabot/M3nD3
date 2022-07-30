//starting to build the pie chart on the layoutD3

// Create dummy data
var data1 = {a: 9, b: 20, c:30, d:8, e:12}
var data2 = {a: 9, b: 20, c:30, d:8, e:12, f:15, g:6}

// Select the svg chart area for this layout

var pieChart = d3.select('#pie')

var width = pieChart.attr('width')
var height = pieChart.attr('height')

var radius = (300 / 2) - 40

// Create the layout, and send the data through the layout.

var scale = d3.scaleOrdinal().domain(data1).range(d3.schemeSet2)

var render = d3.pie()
    .value((d) => d.value)

var renderData1 = render(d3.entries(data1))
var renderData2 = render(d3.entries(data2))
//showing how the data is entering the pie chart
d3.select('#pieData')
    .append('h3')
    .text('Data created by Pie arc Generator')
    .append('pre')
    .text(JSON.stringify(renderData1))

//console.log(renderData1) // data is logged to the console and verified

var renderChart = pieChart.append('g')
    .attr('transform',`translate(${width * 0.8}, ${height/2})`)

    //adding chart head to g element
renderChart.append('text')
    .text('Interactive Pie')
    .attr('transform','translate(-150,-110)')
    .attr('class','ctitle')

function update(inData){
    var u = renderChart.selectAll('path')
        .data(inData)
    u
        .enter()
        .append('path')
        .merge(u)
        .attr('d', d3.arc()
            .innerRadius(0)
            .outerRadius(radius))
        .transition()
        .duration(10000)
        .attr('fill', (d) => scale(d.data.key))
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 1)
    u
        .exit()
        .remove()
}
update(renderData1)