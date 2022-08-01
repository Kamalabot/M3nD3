const histCol = (inData, renderColor,margin, height) => {
    //console.log(inData)
    //create the x-axis first
    console.log('I am executing color')
    var x = d3.scaleLinear().domain([0,1000]).range([0,280])
    var xAxis = renderColor.append('g')
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
    console.log(y(768))
    var yAxis = renderColor.append('g')
        .attr('transform',`translate(0,${-margin.bottom})`)
    yAxis.call(d3.axisLeft(y))

    var chart = renderColor.selectAll("rect")
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
        .style('fill',d => d.x0<140 ? "orange" : "#69b3a2")
}

export {histCol}