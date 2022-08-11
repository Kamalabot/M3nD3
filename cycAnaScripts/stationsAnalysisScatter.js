//Write some function to work on the data

//Calculating the distance between the stations
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


//Building the Drop Down function
function buildDropDown(divId, listData, forId, attrName, labelName,rawData) {
    //Build the start station dropdown
    const dropStrt = d3.select(`#${divId}`)
      .append('label')
      .attr('for',forId)
      .text(labelName)
  
    const startStnDd = dropStrt.append('select')
      .attr('name',attrName)
      .attr('class','w-50')
      .attr('id',forId)
      //placing the event listener here leads to entire list selected
      .on('change',function(e, d){
        if (this.id == "startStn"){
          var start = this.value;
          scatterPlot(rawData,start,undefined);
        }else{
          var end = this.value;
          scatterPlot(rawData,undefined,end)
        }
      }) 
    startStnDd.selectAll('option')
      .data(listData)
      .join('option')
      .attr('value', d => d)
      .text(d =>d)

  }

//Function to return the filtered data  

//import the file
d3.csv("TripV2@1.csv").then((data) => {
  scatterData = data.map((d) => {
    return {
      rideableType: d.rideable_type,
      member: d.member_casual == "member" ? "yes" : "no",
      tripDuration: +d.tripduration / 60,
      startStn: d.start_station_name,
      endStn: d.end_station_name,
      haversignDist: +distHaversine(
        [d.start_lat, d.start_lng],
        [d.end_lat, d.end_lng]
      ),
    };
  });
  startStationSet = new Set(scatterData.map((d) => d.startStn))
  startStations = [...startStationSet].sort();
  endStationSet = new Set(scatterData.map((d) => d.endStn))
  endStations = [...endStationSet].sort();
  buildDropDown("drop", startStations,'startStn','startStations','Start Stations', scatterData);
  buildDropDown("drop", endStations,'endStn','endStations','Ending Stations',scatterData);
});

const svg = d3.select("#scatter");
const width = svg.attr("width");
const height = svg.attr("height");

const margin = { top: 20, bottom: 20, right: 30, left: 30 };

const xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`);

const yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xScale = d3
    .scaleLinear()
    .range([margin.left, width - margin.right]);

const yScale = d3
    .scaleLinear()
    .range([height - margin.top - margin.bottom, margin.bottom]);

const ride = d3
    .scaleOrdinal()
    .domain(["classic_bike", "electric_bike", "docked_bike"])
    .range(["blue", "green", "orange"]);


function scatterPlot(tabData, startStation, endStation) {
  if (startStation == undefined){
  filteredData = tabData.filter((d) => d.endStn === endStation);
  } else if (endStation == undefined){
  filteredData = tabData.filter((d) => d.startStn === startStation);
  }
  
  //Domain is attached seperately and called.
  xScale.domain(d3.extent(filteredData, (d) => d.tripDuration))
  yScale.domain(d3.extent(filteredData, (d) => d.haversignDist))

  xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
  yAxis.transition().duration(1000).call(d3.axisLeft(yScale));

  var toolTip = d3
    .select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "ba ph4 pv2 mb2 dib br3 bw2 f6 bg-light-blue");
  var mouseOver = function (d) {
    console.log(d3.mouse(this));
    toolTip
      .html(
        `Trip Duration: ${d.tripDuration}<br>
                    Haversign Distance: ${d.haversignDist}<br>
                    Ride Type:${d.rideableType}`
      )
      .transition()
      .duration(1000)
      .style("opacity", 1);
  };
  var mouseOut = function (d) {
    toolTip.transition().duration(1000).style("opacity", 0);
    d3.select(this).style("opacity", 0.7);
  };
  const marks = svg
    .selectAll("circle")
    .data(filteredData)
    .join(
      enter => enter.append('circle')
        .attr("cx", (d) => xScale(d.tripDuration))
        .attr("cy", (d) => yScale(d.haversignDist))
        .attr("fill", (d) => ride(d.rideableType))
        .attr("r", 5)
        .style("opacity", 0.7)
        .on("mouseover", mouseOver)
        .on("mouseleave", mouseOut),
      update => update
        .attr('opacity',0.3)
        .transition().duration(2500)
        .attr('opacity',0.9),
      exit => exit
        .transition().duration(2500)
        .attr('transform',(d,i)=> `translate(${d.tripDuration + 25}
            ${d.haversignDist + 50})`)
        .remove()
    )
}

