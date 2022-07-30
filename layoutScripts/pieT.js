//starting to build the pie chart on the layoutD3

// Create dummy data
var data = {a: 9, b: 20, c:30, d:8, e:12}

// Select the svg chart area for this layout

var pieChart = d3.select('#pie')

var width = pieChart.attr('width')
var height = pieChart.attr('height')

var radius = (300 / 2) - 40

// Create the layout, and send the data through the layout.

var scale = d3.scaleOrdinal().domain(data).range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])

var render = d3.pie()
    .value((d) => d.value)

var renderData = render(d3.entries(data))

console.log(renderData) // data is logged to the console and verified

var renderChart = pieChart.append('g')
    .attr('transform',`translate(${width/6}, ${height/2})`)

//adding chart head to g element

renderChart.append('text')
    .text('Texted Pie')
    .attr('transform','translate(-150,-110)')
    .attr('class','ctitle')

    //creating arc generator 
var arcGen = d3.arc()
                .innerRadius(0)
                .outerRadius(radius)

renderChart.selectAll('path')
    .data(renderData).enter()
    .append('path')
    .attr('d', arcGen)
    .attr('fill', d => scale(d.data.key))
    .attr('stroke','black')
    .attr('opacity', 0.7)

renderChart.selectAll('text .clabel') //The reason for seperating text using classes is clear.
    .data(renderData).join('text')
    .text((d) => `grp  ${d.data.key}`)
    .attr('transform',d => `translate(${arcGen.centroid(d)})`)
    .attr('class','clabel') //after creating the text, assign them the class attribute
    .style('text-anchor','middle')    