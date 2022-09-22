//bringing in the data
d3.csv("./ObservableData/companyManagement.csv").then(res =>{
    visualBoard(res) //Calling the Network graph visualisation subroutine
})

d3.csv("./ObservableData/companyMarketData.csv").then(res =>{
    visualMarket(res) //Calling the market Analysis subroutine
})

//Network Graph subroutine
function visualBoard(inBoundData){
    const inBound = inBoundData.filter(d => d.name != "") //filtering data without any leaders
    console.log(inBound.length)
    const rollUpName = d3.rollups(inBound, g => g.length, d => d.name)
        .sort((a,b) => d3.descending(a[1],b[1]))
    //Subroutine centers around the executives, who are on the board of companies
    //Which Companies?
    const orgs = [... new Set(inBound.map(d => d.company))];
    //Who?
    const executives = [... new Set(inBound.map(d => d.name))];
    //How many companies?
    const orgsCount = orgs.length;
    //How many execs?
    const execsCount = executives.length;
    //const heading = document.getElementById("heading");
    //heading.textContent = `${orgsCount} organisation lead by ${execsCount} leaders`;
    //console.log(rollUpName.filter(d => d[1] > 3))
    const interesting = rollUpName.filter(d => d[1] > 3)
    const topExecs = [... new Set(interesting.map(d => d.name))];
    //Who is on many boards? 
    const nameScale = d3.scaleOrdinal()
        .domain(topExecs)
        .range(d3.schemePaired)
        
    const onBoardScale = d3.scaleSqrt()
        .domain(d3.extent(interesting.map(d => d[1])))
        .range([21,84])

    const chartArea = d3.select('#chart');

    const margin = {top:20, bottom:20, right:20, left:20}

    const width = chartArea.attr('width');

    const height = chartArea.attr('height');

    const visWidth = width - margin.left - margin.right;

    const visHeight = height - margin.bottom - margin.top;

    //console.log(visHeight, visWidth)

    var simulation = d3.forceSimulation(interesting)
        .force('charge', d3.forceManyBody().strength(5))
        .force('center', d3.forceCenter(visWidth / 2, visWidth / 2))
        .force('collision',d3.forceCollide().radius(d => onBoardScale(d[1])))
        .on('tick', ticked);

        function ticked() {
            var u = d3.select('svg')
            .selectAll('circle')
            .data(interesting)
            .join('circle')
            .attr('r', (d) => onBoardScale(d[1]))
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y)
            .attr('fill',(d) => nameScale(d[0]))
            .on('mouseover',interact)
            .on('mouseleave',retract)

            function interact(event,d,index){
                localData = d3.select('svg')
                localData.append('text')
                    .attr('x', 5)
                    .attr('y', 20)
                    .attr('class','f4')
                    .attr('id','tip')
                    .text(`${d[0]} is on board of ${d[1]} organisation[s]`)       
            }
            function retract(d){
                data = d3.select('#tip')
                data.remove()
            }

            const text = d3.select('svg')
                .selectAll("text")
                .data(interesting)
                .join('text')
                .text("text")
                .attr( "x", d=>d.x ).attr( "y", d=>d.y+4 )
                .attr( "text-anchor", "middle" )
                .attr( "font-size", 10 )
                .text( d=>d[0] );
            }
}

//Market Analysis subroutine
function visualMarket(inBound){
    console.log(inBound)
}