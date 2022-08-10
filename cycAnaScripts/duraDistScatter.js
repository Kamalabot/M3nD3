//Import the file from the internet and render it using d3's selection
//in the dataArea of the page

//import the file
d3.csv("TripV2@1.csv").then(data =>{
    scatterData = data.map((d) => {
        return {
          rideableType: d.rideable_type,
          member: d.member_casual == "member"? "yes" : "no",
          tripDuration: +d.tripduration / 60,
          startStn: d.start_station_name,
          endStn: d.end_station_name, 
          haversignDist : +distHaversine([d.start_lat,d.start_lng],[d.end_lat,d.end_lng])
        }
    })
    scatterPlot(scatterData)
})

function rad(x) {return x*Math.PI/180;}

function distHaversine(p1, p2) {
    var R = 6371; // earth's mean radius in km
    var dLat  = rad(p2[0] - p1[0]);
    var dLong = rad(p2[1] - p1[1]);
  
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(rad(p1[0])) * Math.cos(rad(p2[0])) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var dist = R * c;
  
    return dist.toFixed(3);
  }

function scatterPlot(tabData){

        filteredData = tabData.filter(d => d.tripDuration < 2500)
        const svg = d3.select('#scatter')
        const width = svg.attr('width')
        const height = svg.attr('height')

        const margin = {top:20, bottom:20, right:30, left:30}
        
        const xAxis = svg.append('g')
            .attr('transform',`translate(0,${height-margin.bottom})`)

        const yAxis = svg.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`)

        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.tripDuration))
            .range([margin.left, width - margin.right])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.haversignDist))
            .range([height-margin.top-margin.bottom, margin.bottom])
        
        const ride = d3.scaleOrdinal()
            .domain(["classic_bike", "electric_bike", "docked_bike"])
            .range(['blue','green','orange'])

        xAxis.call(d3.axisBottom(xScale))
        yAxis.call(d3.axisLeft(yScale))
        
        const marks = svg.selectAll('circle')
            .data(filteredData)
            .join('circle')
            .attr('cx', d => xScale(d.tripDuration))
            .attr('cy', d => yScale(d.haversignDist))
            .attr('fill',d => ride(d.rideableType))
            .attr('r', 5)
    }