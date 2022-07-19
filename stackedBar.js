//select the svg pattern

var svg = d3.select('svg');
var margin = {top: 20, right: 20, bottom: 30, left:40};
var width = svg.attr('width') - margin.right - margin.left;
var height = svg.attr('height') - margin.top - margin.bottom;
g = svg.append('g')
    .attr("transform",`translate(${margin.left},${margin.top})`)
//scales are fully created except the domain.
var x = d3.scaleBand().rangeRound([0,width])
    .paddingInner(0.05).align(0.1);

var y = d3.scaleLinear().rangeRound([height, 0])

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

function wrangle(d, i, columns){
    //console.log(d) //this is the entire row
    //console.log(i) // index of the row
    //console.log(columns) // columns headers are already seperated 
    for (i = 1, t = 0; i < columns.length; ++i){
        d[columns[i]] = +d[columns[i]] //converting the cell vals to numbers
        t += d[columns[i]]
        d.total = t
    }
    return d
}    
//bringing in the data
d3.csv("cityPopulation.csv", wrangle).then((data) =>{
    var keys = data.columns.slice(1)
    data.sort((a,b) => b.total - a.total)
    x.domain(data.map((d) => d.State))
    y.domain([0, d3.max(data, d=> d.total)]).nice()
    z.domain(keys);
    console.log(d3.stack().keys(keys)(data))//look at what d3.stack does
    //console.log(data.map((d) => d.State))
    var staky = g.append("g").selectAll('g')
        .data(d3.stack().keys(keys)(data)) //this makes it ready for stacking
        .enter().append('g')
        .attr('fill',d => z(d.key)) //here comes the colors. Can you guess how the DOM will look?
    staky.selectAll('rect')
        .data((d) => d)
        .join('rect')
        .attr('x',(d) => x(d.data.State))
        .attr('y',(d) => y(d[1]))
        .attr('height', (d) => y(d[0]) - y(d[1]))
        .attr('width',x.bandwidth());
    console.log(y(y.ticks().pop())) //y.ticks().pop() will resolve to 40,000,000
    g.append('g').attr('class','axis')
        .call(d3.axisLeft(y).ticks(null,"s"))
        .append('text').attr('x',2)
        .attr('y',y(y.ticks().pop()) + 0.5) //what this does?
        .attr('dy','0.32em')
        .attr('fill','#0F1')
        .attr('font-weight','bold')
        .attr('text-anchor','start')
        .text('Population')
    console.log(keys.slice().reverse())    
    var legend = g.append('g').attr('font-family','sans-serif')
        .attr("font-size",10)
        .attr('text-anchor','end')
        .selectAll('g')
        .data(keys.reverse())
        .enter().append('g')
        .attr('transform',(d,i) => `translate(0,${i * 25})`)

    legend.append('rect')
        .attr('x',width - 19)
        .attr('width',19)
        .attr('height',19)
        .attr('fill',z)

    legend.append('text')
        .attr('x',width - 24)
        .attr('y',9.5)
        .attr('dy','0.32em')
        .text(d => d)
})