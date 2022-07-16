//Lets bring the data in as seperate divs
d3.csv('Lynx_trapped.csv').then((d)=>{
    printD(d);
    printS(d.slice(0, 10));
    makeTable(d.slice(0,10));
})

function printD(data){
    //console.log(data)
    d3.select("body")
        .selectAll("div.trouble")
        .data(data.slice(0,10))
        .enter()
        .append("div")
        .attr("class","trouble")
        .html(d => d.Year)
}
//How about bring the text onto the svg element?
function printS(data){
    d3.select('svg')
        .selectAll('text')
        .data(data)
        .join('text')
        .text(d => `In ${d.Year} ${d.lynx_trapped} were trapped`)
        .attr('x',25)
        .attr('y', (d, i) => i * 20)
}

function makeTable(data){
    var myTable = d3.select('body')
        .append('div')
        .attr('class','tbl')
        .append('table')
        .selectAll('tr')
        .data(data)
        .enter()
        .append('tr')
        
    myTable.append('td')
        .text(d => d.Year)
    // myTable.selectAll('tr')
    //     .data(data)
        
    myTable.append('td')
        .text(d => d.lynx_trapped)
}
//How about populating a table?


var main = d3.select('svg')
var height = main.attr("height");
var width = main.attr("width");

// main.append('p')
//     .html(`${height + width}`)

//simple append and show, easy.
d3.select('body')
    .append('p')
    .text(`${height + width}`)

//doing the same at the click of the button, and it works
var clik = d3.select('button')
    .on('click',show)

function show(){
    d3.select('body')
        .append('p')
        .text(`${height + width}`)   
}