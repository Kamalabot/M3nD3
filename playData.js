
const svgHeight = 300;
const svgWidth = 300;
// All the charts will be under one g element which is assigned to variable base 
const base = d3.select('body').append('g')

const makeSVG = () =>{
    let Svg = base.append('svg')
    .attr('height', svgHeight)
    .attr('width',svgWidth)
//console.log(createData) this logs the complete function... 
//console.log(createData())
    return Svg
}
//Feed the data, and the accessor function to create the necessary rendering
const renderData = (inData, xV, yV) =>{
    //append the SVG to the base 
    var locSVG = makeSVG()
    //Start the points appending process. The data can be fed in arrays too!!!
    //console.log(inData)
    locSVG.selectAll('circle')
        .data(inData)
        .enter()
        .append('circle')
        .attr('cx',xV)
        .attr('cy',yV)
        .attr('r',5)
}

const justRender = (inData, xV, yV) =>{
    //append the SVG to the base 
    d3.select('svg')
        .selectAll('circle')
        .data(inData)
        .enter()
        .append('circle')
        .attr('cx',xV)
        .attr('cy',yV)
        .attr('r',5)
}
//Learnt that function allows it to be anywhere in the script, while the const doesn't
const createLine = () =>{
    d3.range(10).forEach(element => {
        //console.log(element * element)
    });
    const newData = d3.range(20).map((x) =>({
        h: x * 10,
        y: x * 5 + 2
    }))
    return newData
}


const plusSign = () =>{
    var vData = d3.range(10).map((x) =>({
      h: svgHeight / 2,
      y: 30 * x  
    }));
    var hData = d3.range(10).map((x) =>({
        h: x * 30,
        y: svgWidth/2
    }));
    return vData.concat(hData)
}

const circle = () =>{
    var cOne = d3.range(360).map((e) =>({
        h: 50 * Math.sin(e), 
        y: 50 * Math.cos(e)
    }))
    var cTwo = d3.range(360).map((e) =>({
        h: 75 * Math.sin(e), 
        y: 75 * Math.cos(e)
    }))
    var cThe = d3.range(360).map((e) =>({
        h: 90 * Math.sin(e), 
        y: 90 * Math.cos(e)
    }))
    var temp = cOne.concat(cTwo)
    return temp.concat(cThe)
}

const crossHair = () =>{
    var vData = d3.range(30).map((x) =>({
        h: svgHeight / 2,
        y: 10 * x  
      }));
    var filtV = vData.filter((d) => d.y < 130 || d.y > 170)
    var hData = d3.range(30).map((x) =>({
          h: x * 10,
          y: svgWidth/2
      }));
    
    var filtH = hData.filter((d) => d.h < 130 || d.h > 170)
    var cOne = d3.range(360).map((e) =>({
        h: 50 * Math.sin(e) + svgHeight / 2, 
        y: 50 * Math.cos(e) + svgWidth / 2
    }))
    var temp = filtH.concat(filtV)   
    //console.log(temp);
    return temp.concat(cOne)
}

const stairC = () =>{
    //There will be 5 stair cases
    var V = []
    for (let i = 1; i <= 5; i++){
        var vData = d3.range(6).map((x) =>({
            h: svgWidth * (i+1) / 5,
            y: 10 * x + svgWidth * i / 5  
        }));
        V = V.concat(vData)
    }

    var H = []
    for (let i = 1; i <= 5; i++){
        var hData = d3.range(6).map((x) =>({
            h: x * 10 + svgHeight * i / 5,
            y: svgHeight * i / 5
        }));
        H = H.concat(hData)
    }
    return V.concat(H)
}

var conCir = circle()
var plus = plusSign()
var line = createLine()
var crossH = crossHair()
var stairs = stairC()
//down line:
var xU = (d) => d.h
var yU = (d) => svgHeight - d.y
//up line:
var xD = (d) => d.h
var yD = (d) => d.y
//circles:
var xC = (d) => svgHeight / 2 + d.h
var yC = (d) => svgWidth / 2 + d.y
//console.log(plus);
console.log(stairs)
//It all start here:
window.addEventListener('load',renderData(line, xU, yU))
window.addEventListener('load',renderData(line, xD, yD))
window.addEventListener('load',renderData(plus, xU, yU))
window.addEventListener('load',renderData(conCir, xC, yC))
window.addEventListener('load',renderData(crossH, xD, yD))
window.addEventListener('load',renderData(stairs, xD, yD))
//appending div to create buttons

var buttonArray = ['stairs', 'crossH', 'lineUp','lineDown','plus', 'Concentric']

d3.select("body").append('div')
    .selectAll("button")
    .data(buttonArray)
    .enter()
    .append("button")
    .on("click",buttonClick)
    .html(d => d)

function buttonClick(name){
    if(name == 'stairs'){
        renderData(stairs, xD, yD)
    } else if (name == 'crossH'){
        renderData(crossH, xD, yD)
    } else if (name == 'lineUp'){
        renderData(line, xU, yU)
    } else if (name == 'lineDown'){
        renderData(line, xD, yD)
    } else if (name == 'plus'){
        renderData(plus, xU, yU)
    } else if (name == 'Concentric'){
        renderData(conCir, xC, yC)
    }
}