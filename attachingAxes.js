//Source of the file
var titanicLoc = 'https://gist.githubusercontent.com/Kamalabot/e61b849cc5297aeabd51eeafdcd717e6/raw/cb1b146a58e0ef48a2a2f849c69d03177722d5cc/SpaceTitanic.csv'

aq.loadCSV(titanicLoc).then(data =>{
    //data.print(5);
    //will make the line chart with the average spend vs the age
   const dataOut = data.derive({
        totalSpend: d => d.FoodCourt + 
                    d.RoomService + 
                    d.ShoppingMall +
                    d.Spa + 
                    d.VRDeck})
        .orderby(aq.desc('totalSpend'))
        .select('Age','Name',
                    'HomePlanet','Cabin',
                    'totalSpend')
        .groupby('Age')
        .rollup({meanSpend: d => aq.mean(+d.totalSpend)})
        .orderby('meanSpend')
        .select('Age','meanSpend').objects();
    render(dataOut);
});
// learing how to position a simple axes for the charts

const render = (inData) =>{
    //create a svg element to the body
    const height = 500;
    const width = 600;
    const margin = {top:5, bottom:50, left:50,right:5}

    //ideally chart area needs to be 550 X 450 the remaining is taken 
    // the axes.

    var xVals = (d) => d.Age;
    var yVals = (d) => d.meanSpend;

    var xDomain = d3.extent(inData,xVals)
    var yDomain = d3.extent(inData,yVals)

    var chartHeight = height - margin.bottom - margin.top - 10;
    var chartWidth = width - margin.left - margin.right -10;
    //I am attaching here to the SVG without creating a g element
    var base = d3.select('body').append('svg')
        .attr('height',height)
        .attr('width',width)
        .attr('fill','green')
        .attr('transform',`translate(${margin.left},${margin.right})`)

    base.append("rect").attr('x',35)
        .attr('y',0)
        .attr('width',chartWidth)
        .attr('height',chartHeight)
    
    const xScale = d3.scaleLinear()
                .domain(xDomain)
                .range([0, chartWidth])
                .nice()
    const yScale = d3.scaleLinear()
                .domain(yDomain)
                .range([chartHeight,0])
                .nice()
    
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.format('~s'))
    //Where the axis get appended to the SVG matters 
    const xAxisG = base.append('g')
        .attr('transform',`translate(35, ${chartHeight})`)
        .attr('fill','yellow')

    const yAxisG = base.append('g')
        .attr('fill','blue')
        .attr('transform',`translate(35,0)`)

    //axis rectangles get hidden automatically

    xAxisG.append('rect').attr('x',0)
        .attr('y',0)
        .attr('width',chartWidth)
        .attr('height',25)

    yAxisG.append('rect').attr('x',0)
        .attr('y',0)
        .attr('width',25)
        .attr('height',chartHeight)

    //See how the axis are getting attached

    xAxisG.append('text').attr('y',25)
        .attr('x',chartWidth/2)
        .attr('fill','black')
        .attr('text-anchor','middle')
        .text('X-Axis Label')
    //g element doesn't constraint the elements inside it
    //rotation tranformation changes the x to y axis and y to x-axis
    yAxisG.append('text')
        .attr('transform','rotate(90)')
        .attr('x',chartHeight/2)
        .attr('y',35)
        .attr('fill','black')
        .attr('text-anchor','middle')
        .text('Y-Axis Label') 
        
    //calling the axes on to the chart

    //xAxisG.call(xAxis)
    yAxisG.call(yAxis)
}