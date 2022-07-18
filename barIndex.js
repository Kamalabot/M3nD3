//Objective is to create the bar chart and add the styling found in the React oriented fork

//Data will be the Space Titanic, and the bar chart will show the expenditure by each family as a whole using their 2nd name.

//fetching the data using the fetch method

const SpaceTitanic = 'SpaceTitanic.csv'; //Referring the dataset of interest
const inetSpace = 'https://gist.githubusercontent.com/Kamalabot/e61b849cc5297aeabd51eeafdcd717e6/raw/fb7a0142c71a204e619fbf4fc58bdc626c4342ca/SpaceTitanic.csv'


const fetchData = async(url) =>{
    const response = await fetch(url);
    return await response.text()
};

fetchData(SpaceTitanic).then(data =>{
    const spaced = aq.fromCSV(data)

    dataWrangle(spaced);

});

function dataWrangle(data){
    //Wrangle out the family names and their expenditure in this trips
    const tSpend = data.derive({totalSpend: d => d.FoodCourt + 
        d.RoomService + 
        d.ShoppingMall +
        d.Spa + 
        d.VRDeck},
        {Age : d => +d.Age})
        .filter(d => d.Age != null)
        .orderby(aq.desc('totalSpend'))
        .select('Name','Age','totalSpend')
    const familySpace = tSpend
        .derive({
            familyName: d=>op.split(d.Name,' ')[1]
        })
    //familySpace.print()
    const removeNull = familySpace
        .filter(d => d.familyName !== undefined)
    //removeNull.print()
    const calculateSpend = removeNull
        .groupby('familyName')
        .derive({
            familySpend: d => op.sum(d.totalSpend)
        })
        .orderby('familySpend')
        .select('familyName','familySpend')
    const filterFam = calculateSpend
        .filter(d => d.familySpend > 10000)
        .dedupe('familyName')
        .orderby(aq.desc('familySpend'))
    const wrangled = filterFam.objects() //converting to simple arrays and feed it to charting.
    dataViz(wrangled.slice(0,10))
    return wrangled;

}

function dataViz(entryData){
    
    const xFam = (d) => d.familyName;
    const ySpend = (d) => d.familySpend;
    const data = entryData.map(d =>({
        familyName:xFam(d),
        familySpend:ySpend(d),
        p_Spend: `${xFam(d)} spent ${ySpend(d)}`
    }))

    const bar = d3.select('svg')

    const height = bar.attr('height');
    const width = bar.attr('width');

    const margin = {top: 60, bottom:80, left:150, right:40}
    
    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.right - margin.left;

    const recWid = 5;

    const xLabel = "Families";
    const yLabel = "Spends";

    const xScale = d3.scaleBand()
        .domain(data.map(xFam))
        .range([0,innerWidth])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0,d3.max(data, ySpend)])
        .range([innerHeight, 0])

    //axis building starts from here
    const g = bar.append('g')
            .attr('transform',`translate(${margin.left},${margin.top})`)
    //y-axis        
    const yAxisTickFormat = number =>
            d3.format('.3s')(number);
    
    const yAxis = d3.axisLeft(yScale)
            .tickFormat(yAxisTickFormat)
            .tickSize(-innerWidth)
    
    const yAxisG = g.append('g').call(yAxis)
    yAxisG.select('domain').remove();
    //x-axis
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform',`translate(0,${innerHeight})`)
        .selectAll('.domain, .tick line')
        .remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -35)
        .attr('x', -innerHeight/2)
        .attr('transform','rotate(-90)')
        .attr('fill', 'black')
        .text(yLabel);
    
    //starting the bar chart building
    g.selectAll('rect')
        .data(data)
        .join('rect')
        .attr('class','box')
        .attr('x', d => xScale(xFam(d)))
        .attr('y',d => yScale(ySpend(d)))
        .attr('height', d => 460 -yScale(ySpend(d)))
        .attr('width',xScale.bandwidth())
        .append('title')
          .text(d => d.p_Spend);
    g.append('text')
        .attr('class','title')
        .attr('y', -10)
        .text("This is one heck of a Bar Chart")
}
//The below async and await methods needs to be learnt more throughly

var cliker = document.getElementById('klik')

// const temp = async () =>{
//         console.log('clicked')
//         await d3.dsv(",", inetSpace,(d)=>{
//             return d
//         });
//     }
cliker.addEventListener('click',newText)

//corrected the below function to use then correctly
function newText(){
    console.log('data');
    d3.csv('Lynx_trapped.csv').then((data) => {
        
        var textAppend = d3.select('svg')
            
        textAppend.selectAll('text')
            .data(data)
            .join('text')
            .text(d => d.Year)
            .attr('y', (d, i) => i * 10 )
    })
}

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`got ${value}`))
console.log(fifteen) //this will be just the promise, not the value

//creating generators
function* powers(n) {
    for (let current = n;; current *= n) {
      yield current;
    }
  }
  
for (let power of powers(3)) {
    if (power > 50) break;
    console.log(power);
  }

//Following the bostock bar chart tutorial
