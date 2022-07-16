var main = d3.select('svg')
var height = main.attr("height");
var width = main.attr("width");

//Function that works on real data
function printD(data){
    //console.log(data)
    main.selectAll("circle")
        .data(data)
        .join("circle")
        .transition()
        .duration(1000)
        .attr("cx", (d ,i) => i * 10)
        .attr("cy", d => height - +d.lynx_trapped / 100)
        .attr('r', 5)
    main.selectAll('text')
        .data(data)
        .join('text')
        .attr('y', (d, i) => i * 15)
        .text(d => `${d.Year} , ${d.lynx_trapped}`)
}
const realPop = () =>{    
    console.log('recieved')
    d3.csv('Lynx_trapped.csv').then((d)=>{
        printD(d.slice(0,20));
    });
}

var realB = document.getElementById("real")
realB.addEventListener('click',realPop)

var ranData = d3.range(50).map(d =>({
    x: Math.round(150 * Math.random()),
    y: Math.round(150 * Math.random())
}))
//Fuction that works on random data
const ranPop = (data) =>{
    console.log('recieved')
    main.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr('r', 5)
    main.append('g')
        .selectAll('text')
        .data(data)
        .join("text")
        .attr('transform', `translate(200,10)`)
        .attr('y', (d, i) => i * 15)
        .text(d => `${d.x}, ${d.y}`)
}

var ranB = document.getElementById('random');
ranB.addEventListener('click',ranPop(ranData))