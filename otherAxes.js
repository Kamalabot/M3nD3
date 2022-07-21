import { appendBox } from './appendBox.js';
import { bars } from './bars.js';
import { squares } from './squares.js';

//loading the visual after the page is loaded
window.addEventListener('load',(e)=>{
    //console.log(e)
    //console.log('hi')
    //create a svg element mimicing the charts
    const heightCh = 350;
    const widthCh = 400;
    const marginCh = {top:25, bottom:25, left:50,right:50}

    const rectL = heightCh - marginCh.top - marginCh.bottom
    const rectB = widthCh - marginCh.right - marginCh.left

    //Select the body and append g on load
    var base = d3.select('body')
        .append('g')

    //Plan is to create multiple SVG chart areas one after the other. The base will remain the parent, while the other svg charts with axes will 
    //be acting as simple children
    var chartOne = base.append('svg')
        .attr('height',heightCh)
        .attr('width',widthCh)
        
    //appending the chart area rectangle
    // chartOne.append('rect')
    //     .attr('x',marginCh.left)
    //     .attr('y',marginCh.right)
    //     .attr('height',rectL)
    //     .attr('width',rectB)
    //     .attr('class','box')
    chartOne.call(appendBox,1,marginCh,rectL,rectB)

    var chartTwo = base.append('svg')
        .attr('height',heightCh)
        .attr('width',widthCh)
        .attr('transform','translate(20,0)')
    chartTwo.call(appendBox,2,marginCh,rectL,rectB)
    
    var chartThree = base.append('svg')
        .attr('height',heightCh)
        .attr('width',widthCh)
        .attr('transform','translate(20,0)')
    chartThree.call(appendBox,3,marginCh,rectL,rectB)
    
    var data = d3.range(5).map(i => ({
        x: widthCh * Math.random(),
        y: heightCh * Math.random(),
        s: Math.floor(9 * Math.random()),
        c: Math.floor(20 * Math.random())
      }))
    console.log(data[0])
    var chartGrid = d3.range(6).map((g,i) =>({
        chart: base.append('svg')
            .attr('id',`svg${i}`)
            .attr('height',heightCh)
            .attr('width',widthCh)
            .attr('transform','translate(20,0)')
    }));
    //need a way to reach the rectangles... 
    chartGrid.forEach((e, i) =>{
        e.chart.call(appendBox, i,marginCh,rectL,rectB)
    })

    var timeFormat = d3.utcFormat("%I %p")
    //var timeDomain = [new Date().getDate(), new Date().getDate() + 2]
    //var timeDomain = [new Date().getHours(), new Date().getHours() + 2]
    
    var timeDomain = [new Date(2022,0,1), new Date(2022,0,5)]
    
    var xTime = d3.scaleTime()
        .domain(timeDomain)
        .range([0,rectL])

    const formatMonth = d3.timeFormat("%B"),
        formatDay = d3.timeFormat("%a")

    var xTim = d3.axisBottom(xTime).ticks(5)
        .tickFormat(formatDay)

    const xTimeG = chartTwo.append('g')
        .attr('transform',`translate(${marginCh.left},${rectL + marginCh.top})`)
    
    xTimeG.call(xTim);

    var xLinear = d3.scaleLinear()
        .domain([0, 150])
        .range([0,rectL])
        .nice()
    
    var xLin = d3.axisBottom(xLinear).ticks(8)
    
    const xLinG = chartOne.append('g')
        .attr('transform',`translate(${marginCh.left},${rectL + marginCh.top})`)

    xLinG.call(xLin)
    //starting with the linear Scale and 

    var xOrdinal = d3.scaleOrdinal()
        .domain(['a','b','c','d','e','f','g'])
        .range(d3.range(0,7).map(e => 50 * e))
    // console.log(rectL)    
    // console.log(d3.range(6,1).map(e => rectL/e))
    var xOrd = d3.axisBottom(xOrdinal).ticks(6)

    const xOrdG = chartThree.append('g')
        .attr('transform',`translate(${marginCh.left},${rectL + marginCh.top})`)

    xOrdG.call(xOrd)

    //adding scaleBand() 

    var xBand = d3.scaleBand()
        .domain(["one","two","three","four"])
        .range([0, rectL])
        .paddingOuter(0.15)

    var xPand = d3.scaleBand()
        .domain(["one","two","three","four"])
        .range([0, rectL])
        .paddingInner(0.2)

    var xB = d3.axisBottom(xBand).ticks(4)
    //console.log(chartGrid[0["chart"]])
    const xBg = d3.select("#svg0").append('g')
        .attr('transform',`translate(${marginCh.left},${rectL + marginCh.top})`)
    //bars imported from outside
    bars('svg0',marginCh,xBand,rectL,rectB)
    xBg.call(xB)

    const xPad = d3.select("svg1").append('g')
        .attr('transform',`translate(${marginCh.left},${rectL + marginCh.top})`)
    //bars imported from outside
    bars('svg1',marginCh,xPand,rectL,rectB)

    squares('svg2',marginCh,'linear');
    
    squares('svg3',marginCh,'threshold');

    squares('svg4',marginCh,'quantile');

    squares('svg5',marginCh,'quantize');
})
