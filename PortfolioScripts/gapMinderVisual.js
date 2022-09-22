//bringing in the data
d3.json("./ObservableData/gapminder.json").then(res =>{
    visualGapMinder(res) //Calling the Network graph visualisation subroutine

})

var slider = document.getElementById("myRange");

slider.oninput = function() {
    output.innerHTML = this.value;
  }

var output = document.getElementById("output");
output.innerHTML = slider.value; // Display the default slider value

//Network Graph subroutine
function visualGapMinder(inBoundData,year){
    const gapminder = inBoundData;
    console.log(gapminder.filter(d => d.year == +slider.value))
    //Setting up the chart
    const svg = d3.select('#chart');

    const margin = {top:20, bottom:40, right:20, left:40}

    const width = svg.attr('width');

    const height = svg.attr('height');

    const visWidth = width - margin.left - margin.right;

    const visHeight = height - margin.bottom - margin.top;
    //Getting the scales ready
    const xPopScale = d3.scaleLinear() // Let me start with Linear scale 
        .domain([0,d3.max(gapminder, d => d.pop)])
        .range([0,visWidth])

    const xExpectScale = d3.scaleLinear()
        .domain(d3.extent(gapminder,d => d.life_expect))
        .range([0,visWidth])
        
    const yFerScale = d3.scaleLinear()
        .domain([0,d3.max(gapminder, d => d.fertility)])
        .range([visHeight,0])

    const coutryColor = d3.scaleOrdinal()
        .domain([... new Set(gapminder.map(d => d.country))])
        .range(d3.schemeCategory10, d3.schemePastel2)

    const sizeLifeSqrt = d3.scaleSqrt()
        .domain(d3.extent(gapminder,d => d.life_expect))
        .range([3,30])

    const sizePopSqrt = d3.scaleSqrt()
        .domain(d3.extent(gapminder, d => d.pop))
        .range([5,50])
    //Building the Chart

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)
  
    const title = svg.append('g').attr('transform',`translate(50,20)`)
      .append('text')
      .text('Gap Minder data : Fertility Rate Vs Life Expectancy')
      .attr('stroke','black')
    
    const xAxis = svg.append('g').attr('transform',`translate(${margin.left},${margin.top+visHeight})`)
      .call(d3.axisBottom(xExpectScale))
  
    xAxis.append('text')
      .attr('transform',`translate(250,30)`)
      .text('Life Expectancy =>')
      .attr('fill','black')
      .attr('font-size',20)
  
    const yAxis = svg.append('g').attr('transform',`translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(yFerScale))
  
    yAxis.append('text')
      .attr('transform',`translate(-25,350) rotate(-90)`)
      .text('Fertility Rate =>')
      .attr('fill','black')
      .attr('font-size',20)
    const shape = g.selectAll('g')
      .data(gapminder.filter(d => d.year == +output.innerHTML))
      .join('g')
      .attr('transform',d =>`translate(${xExpectScale(d.life_expect)},${yFerScale(d.fertility)})`)
  
    const bubbles = shape.append('circle')
      .attr('r',d => sizePopSqrt(d.pop))
      .attr('fill', d => coutryColor(d.country))
      .attr('opacity', 0.5)
      .attr('stroke', d => coutryColor(d.country))
      .attr('stroke-width',3)
    const text = svg  
      .append('text')
      .attr('transform',`translate(50,50)`)
      .attr('id','tipper')
      .attr('visibility','hidden')
      
  
    function showTip(event,d) {
      d3.select('#tipper')
        .transition()
        .delay(1000)
        .attr('visibility','visible')
        .text(`${d.country} has Population of ${d.pop}`)
    }
    function hideTip(event,d){
      d3.select('#tipper')
        .transition()
        .delay(1000)
        .attr('visibility','hidden')
    }
    
    shape
      .on('mouseover',showTip)
      .on('mouseout',hideTip)

}