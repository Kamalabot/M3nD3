//starting to build the histo chart on the layoutD3
import {histCol} from "./histoCol.js"
import {renderHist} from "./renderHist.js"
// Select the svg chart area for this layout

var histChart = d3.select('#histo')

var width = histChart.attr('width')
var height = histChart.attr('height')

var margin = {top: 10, right: 30, bottom: 30, left: 40}

var renderChart = histChart.append('g')
    .attr('transform',`translate(${margin.left}, ${margin.top})`)

var renderColor = histChart.append('g')
    .attr('transform',`translate(${margin.left + 350}, ${margin.top})`)

    //adding topic head. 
renderChart.append('text')
    .text('Basic Histogram')
    .attr('transform','translate(0,10)')
    .attr('class','ctitle')

renderColor.append('text')
    .text('Color Histogram')
    .attr('transform','translate(0,10)')
    .attr('class','ctitle')

window.addEventListener('load',loadData)
// Bringing the data from external source
function loadData(){
    d3.csv("ObservableData/1_OneNum.csv")
        .then(data =>{
            renderHist(data,renderChart,margin, height)
            histCol(data,renderColor,margin, height)
        })
}
