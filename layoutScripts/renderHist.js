
const renderHist = (inData, renderChart,margin, height) =>{
    //console.log(inData)
    //create the x-axis first
    console.log('I am executing plain')
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

    const tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
    
    const showToolTip = function(event, d){
            console.log(d)
            tooltip
                .transition()
                .duration(100)
                .style("opacity",1)
            tooltip
                .html(`Range: ${d.x0} - ${d.x1}`)
                .style('left',(event.x)/2 - 100 + "px")
                .style('top',(event.y)/2+ "px")
            }
        
    const hideToolTip = function(event,d){
        console.log(d)
            tooltip
                .transition()
                .duration(100)
                .style("opacity",0)
            }

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
        .on('mouseover',showToolTip)
        .on('mouseleave',hideToolTip)
}   

function preview(inData){
    d3.select('#histData')
        .selectAll('text')
        .data(inData)
        .enter()
        .append('text')
        .text(d => `X0 : ${d.x0}, X1: ${d.x1}, Length: ${d.length}\n\r`)
}

export {renderHist}