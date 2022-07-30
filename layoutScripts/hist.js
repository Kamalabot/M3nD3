//starting to build the histo chart on the layoutD3

// Bringing the data from external source
d3.csv("ObservableData/1_OneNum.csv")
    .then(data =>{
        renderHist(data)
    })

// Select the svg chart area for this layout

var histChart = d3.select('#histo')

var width = histChart.attr('width')
var height = histChart.attr('height')

var margin = {top: 10, right: 30, bottom: 30, left: 40}

var renderChart = histChart.append('g')
    .attr('transform',`translate(${margin.left}, ${margin.top})`)

//adding topic head. 
renderChart.append('text')
    .text('Basic Histogram')
    .attr('transform','translate(0,10)')
    .attr('class','ctitle')

function renderHist(inData){
    //console.log(inData)
    //create the x-axis first
    var x = d3.scaleLinear().domain([0,1000]).range([0,280])
    var xAxis = renderChart.append('g')
        .attr('transform',`translate(0,${height - margin.bottom})`)
    xAxis.call(d3.axisBottom(x))
    //create the histogram data using the layout

    var histogram = d3.histogram()
      .value((d)=> d.price)   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins
    //you need to apply the data to histogram layout
    var bins = histogram(inData);
    console.log(bins.slice(1,5))
//placing the y-axis
    var y = d3.scaleLinear().domain([0,d3.max(bins, d=>d.length)])
        .range([height,margin.left + margin.top])
    var yAxis = renderChart.append('g')
        .attr('transform',`translate(0,${-margin.bottom})`)
    yAxis.call(d3.axisLeft(y))
//bringing the histogram chart...which are just rects
    preview(bins.slice(1,4))
    var chart = renderChart.selectAll('rect')
        .data(bins)
        .enter()

    chart
        .append('rect')
        //each rect gets moved up evenly
        .attr('transform',`translate(0,${-margin.bottom})`)
        //start from the top corner of the rect
        .attr('x',d => x(d.x0))
        .attr('y',function(d) { return y(d.length)})
        .attr('width',d => x(d.x1) - x(d.x0) - 1)
        .attr('height',d => height - y(d.length))
        .style('fill',"#69b3a2")
}   

function preview(inData){
    d3.select('#histData')
        .selectAll('text')
        .data(inData)
        .enter()
        .append('text')
        .text(d => `X0 : ${d.x0}, X1: ${d.x1}, Length: ${d.length}\n\r`)
}