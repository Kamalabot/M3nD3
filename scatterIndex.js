//Script for bring in the Space Titanic Data, make scatter plot and add interactions
//Once the visualisation is successful, will refactor the code and modularise it....
//Keep the script at the bottom of the html body tag..

const SpaceTitanic = 'SpaceTitanic.csv'; //Referring the dataset of interest
const inetSpace = 'https://gist.githubusercontent.com/Kamalabot/e61b849cc5297aeabd51eeafdcd717e6/raw/fb7a0142c71a204e619fbf4fc58bdc626c4342ca/SpaceTitanic.csv'


const fetchData = async(url) =>{
    const response = await fetch(url);
    return await response.text()
}

fetchData(SpaceTitanic).then(text =>{
    const spaceHap = aq.fromCSV(text)
    dataWrangle(spaceHap); //The feeling of moving the data is empowering.. 
})

function dataWrangle(data){
    //get the data object with Age and Total spend
    const tSpend = data.derive({totalSpend: d => d.FoodCourt + 
                        d.RoomService + 
                        d.ShoppingMall +
                        d.Spa + 
                        d.VRDeck},
            {Age : d => +d.Age})
            .filter(d => d.Age != null)
            .orderby(aq.desc('totalSpend'))
            .select('Name','Age','totalSpend')
    //Wrangled and pulled the data out of the fetched csv file
    toVisArray = tSpend.objects();
    //console.log(toVisArray);
    dataVis(toVisArray) //Sending it to visualisation function
}

const scatter = d3.select('svg');

const height = +scatter.attr('height');
const width = +scatter.attr('width');

const margin ={top:60, bottom:80, left:150, right:40 };

const xVals = (d) => d.totalSpend; //this is a function, just console log and see
const yVals = (d) => d.Age;

const innerWidth = width - margin.right - margin.left;
const innerHeight = height - margin.top - margin.bottom;


const rad = 5;
//console.log(xVals);

const yAxisLabel = 'Age';
const xAxisLabel = 'Spend';


function dataVis(entry){
    //console.log(entry); // data is in
    //console.log(innerWidth);
    const xScale = d3.scaleLinear()
                     .domain(d3.extent(entry,xVals))
                     .range([0, innerWidth])
                     .nice()
                     
    const yScale = d3.scaleLinear()
                     .domain(d3.extent(entry, yVals))
                     .range([innerHeight, 0])
                     .nice()

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(10);
  
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);

        const marks = entry.map(d =>({
        x: xScale(xVals(d)),
        y: yScale(yVals(d)),
        p_y: yVals(d),
        p_x:xVals(d)
    }));
    //this is the gotcha... 
    const g = scatter.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    const yAxisG = g.append('g').call(yAxis)
    console.log(innerHeight);
    yAxisG.append('text')
        .attr('class','axis-label')
        .attr('y',-50)
        .attr('x',-innerHeight / 2)
        .attr('transform','rotate(-90)')
        .attr('fill', 'black')
        .attr('text-anchor','middle')
        .text(yAxisLabel)

    const xAxisG = g.append('g').call(xAxis)
                    .attr('transform',`translate(0,${innerHeight})`)
    xAxisG.append('text')
        .attr('class','axis-label')
        .attr('y',50)
        .attr('x',innerWidth / 2)
        .attr('fill', 'black')
        .attr('text-anchor','middle')
        .text(xAxisLabel)

    g.selectAll('circle')
          .data(marks)
          .join('circle')
          .attr('cx', d =>d.x)
          .attr('cy',d =>d.y)
          .attr('r', rad)
          .attr('fill','black')
          .append('title')
          .text(d => `(${d.p_x},${d.p_y})`);

}
