const margin = {top: 10, right: 30, bottom: 30, left: 50},
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#column1of3")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
var generatePlayers = () => d3.range(30).map(d => ({
        name: `Player ${ d }`,
        score: 0
        }))

var randomizeScores = (players, stdDev) => {
    players.forEach(d => d.score = Math.floor(d3.randomNormal(100, stdDev || 10)()/10))
    players.sort((a,b) => b.score - a.score)    
}

function changeData(){
    var temp = generatePlayers();
    randomizeScores(temp,50)

    document.getElementById('column2of3').innerText = neatJSON(temp.slice(0,5))

    d3.select('svg')
        .selectAll('text')
        .data(temp.slice(0,5), d => d.name)
        .join(
            enter => enter.append('text')
                .attr('dy','1.25em')
                .attr('transform', (d,i) => `translate(${10}, ${i * 25})`)
                .style('fill','green')
                .text(d => d.name)
                .selection(),
            update => update
                .style('fill','red')                
                .attr('transform',(d,i) => `translate(${50},${i * 25})`)
                .transition().duration(2000)
                .attr('transform',(d,i) => `translate(${10},${i * 25})`)
                .selection(),
            exit => exit
                .transition().duration(2500)
                .attr('transform',(d,i) => `translate(${60},${i * 37})`)
                .remove()
        )
    }

function getScript(){
    fetch('SelUpdtExit.js')
        .then(response => response.text())
        .then(data => {
  	        document.getElementById('column3of3').innerHTML = "<pre>" + data + "</pre>" 
         });
    }