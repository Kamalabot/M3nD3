//Lets bring the data in as seperate divs
d3.csv('Lynx_trapped.csv').then((d)=>{
    printD(d.slice(0,25));
})

function printD(data){
    //console.log(data)
    main.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d ,i) => i * 10)
        .attr("cy", d => height - +d.lynx_trapped / 100)
        .attr('r', 5)
}
var main = d3.select('svg')
var height = main.attr("height");
var width = main.attr("width");