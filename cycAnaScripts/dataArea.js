//Import the file from the internet and render it using d3's selection
//in the dataArea of the page

//import the file
d3.csv("TripV2@1.csv").then(data =>{
    dataAreaTable(data)
})

function dataAreaTable(tabData){
    const cols = tabData.columns;
    const fiveRows = tabData.slice(0,4);
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