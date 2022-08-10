//Import the file from the internet and render it using d3's selection
//in the dataArea of the page

//import the file
d3.csv("TripV2@1.csv").then(data =>{
    console.log(data.slice(0,5))
    dataAreaTable(data)
})
/*
<table class="f6 w-100 mw8 center" cellspacing="0">
    <tbody class="lh-copy">
            <tr>
                <td class="pv3 pr3 bb b--black-20">Hassan Johnson</td>
                <td class="pv3 pr3 bb b--black-20">@hassan</td>
                <td class="pv3 pr3 bb b--black-20">hassan@companywithalongdomain.co</td>
                <td class="pv3 pr3 bb b--black-20">14419232532474</td>
            </tr>
        </tbody>
(14) ['ride_id', 'rideable_type', 'started_at', 'ended_at', 'start_station_name', 'start_station_id', 'end_station_name', 'end_station_id', 'start_lat', 'start_lng', 'end_lat', 'end_lng', 'member_casual', 'tripduration'

*/


function dataAreaTable(tabData){
    const cols = tabData.columns;
    const fiveRows = tabData.slice(0,5);
    console.log(cols)
    const text = d3.select("#dataArea");
    const tableHead = text.append('table')
        .attr('class',"f6 w-100 mw8 center")
        .attr('cellspacing',"0")
    const headVals = tableHead
        .append('thead')
        .append('tr')
        .selectAll('th')
        .data(cols)
        .join('th')
        .attr('class',"fw6 bb b--black-20 tl pb3 pr3 bg-white")
        .text(d => d)

    for (let feat of cols){
        var featCol = fiveRows.map(d => d[feat])
        console.log(featCol)
        tableHead
            .selectAll('tr')
            .data(featCol)
            .join('tr')
            .append('td')
            .attr('class',"pv3 pr3 bb b--black-20")
            .text(d => d)
    }
}