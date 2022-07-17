var main = d3.select('body').append('table')
var paraMain = d3.select('body').append('div')

var height = main.attr("height");
var width = main.attr("width");

const realPop = () =>{    
    console.log('data');
    d3.csv('Final_parsed_data.csv').then((d)=>{
        populatePara(d.slice(0,2));
    });
}

//Initially I decided to use the tables. The data however seemed unwieldy for the columns.

function populaTable(data){
    //first just create table and bring in the data
    var libTable = main.selectAll('tr')
        .data(data)
        .join('tr')
    
    libTable.append('td')
        .text(d => d.topic_head)
    
    libTable.append('td')
        .text(d => d.data)
    
    libTable.append('td')
        .text(d => d.code)

    libTable.append('td')
        .text(d => d.links)
}

// Below function implements the paragraph. Since the method chaining returns the object as it prepares, the entire 
// fragments can be built using D3.

function populatePara(data){
    data.forEach(cleanData)
    console.log(data)

    var localPara = paraMain.selectAll('div')
                    .data(data)
                    .join('div')
                    
    localPara.append('strong')
        .text(d => d.topic_head)
    
    localPara.append('p')
        .text(d => d.data)
    
    localPara.append('pre')
        .text(d => d.code)
    // localPara.append('a')
    //     .attr('href', d => d.links)
    //     .text('Additional Info')
}

function cleanData(dataPoint){
    dataPoint.code = dataPoint.code
                .replace(/(\\n)/gm,"")
                .split(',')
                .join('\n')
    dataPoint.topic_head = dataPoint.topic_head
                .replace(/_/gm, " ")
                .replace("/","");
    dataPoint.data = dataPoint.data.replace(/\[/," ")
                .replace(/\]/,",")
                .split(',')
                .join('\n\r\n')
}

var realB = document.getElementById("getData")
realB.addEventListener('click',realPop)

