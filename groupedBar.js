//select the svg pattern

var svg = d3.select('svg');
var margin = {top: 20, right: 20, bottom: 30, left:40};
var width = svg.attr('width') - margin.right - margin.left;
var height = svg.attr('height') - margin.top - margin.bottom;
var g = svg.append('g')
  .attr("transform",`translate(${margin.left},${margin.top})`)
//2 scales are created on the x-axis. Both are scaleBand()
var x0 = d3.scaleBand().rangeRound([0,width])
    .paddingInner(0.05);

var x1 = d3.scaleBand().padding(0.05)

var y = d3.scaleLinear().rangeRound([height, 0])

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])

//bringing in the data
d3.csv("cityPopulationGrouped.csv").then((data) =>{
var keys = data.columns.slice(1);

x0.domain(data.map((d)=> d.State));
x1.domain(keys).rangeRound([0, x0.bandwidth()]);
y.domain([0, d3.max(data, (d) => d3.max(keys, (key)=> +d[key]))]).nice();
console.log(data)
var bars= g.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append('g')
    .attr('transform',(d) =>`translate(${x0(d.State)},0)`)    
var rect = bars.selectAll("rect")
  .data((d)=>keys.map((key)=>({key: key, value: +d[key]})))
  .enter().append("rect")
    .attr("x", (d)=>x1(d.key))
    .attr("y", height)
    .attr("width", x1.bandwidth())
    .attr("height", 0)
    .attr("fill", (d)=>z(d.key));
  
rect.transition()
    .delay((d, i)=> i * 10)
    .attr("y", (d)=> y(+d.value))
    .attr("height", (d) => height - y(+d.value));

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

})