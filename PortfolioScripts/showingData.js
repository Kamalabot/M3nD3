
function getData(){
  d3.csv("./ObservableData/aidData.csv")
    .then(data => {
        const updatedData = data.map(row =>({
        yearDate: d3.timeParse('%Y')(row.year),
        yearInt: +row.year,
        donor: row.donor,
        recipient: row.recipient,
        amount: +row.commitment_amount_usd_constant,
        purpose: row.coalesced_purpose_name,
        })
      );
      outData(updatedData)
    })
  } 
window.onload = () => {
  getData()
}

const json = document.querySelector('.json')
const hierarchy = document.querySelector('.hierarchy')
const tree = document.querySelector('.treemap')
const net = document.querySelector('.linkd')
const inter = document.querySelector('.noded')

function outData(aidData){
  //plain JSON
  let html = `<small>${JSON.stringify(aidData.slice(0,2),null,2)}</small>`
  json.innerHTML = html
  
  //Setting up for the FDG
  const donReciAggr  = d3.rollups(aidData, g => d3.sum(g, e => e.amount), d => d.donor, d => d.recipient)

  const donatingFrequency = d3.rollups(aidData, g => g.length, d => d.donor).sort((a,b)=> d3.descending(a[1],b[1]))

  const receivingFrequency = d3.rollups(aidData, g => g.length, d => d.recipient).sort((a,b)=> d3.descending(a[1],b[1]))

  const donors10 = donatingFrequency.map(d => d[0]).slice(0,10)

  const recipient20 = receivingFrequency.map(d => d[0]).slice(0,20)

  const donReciMap = [];
  
  donReciAggr.forEach(([country,recips]) => {
    if (donors10.includes(country)){
    recips.forEach(([recipient,value]) =>{
      const donor = country;
      if (recipient20.includes(recipient)){
      const recip = recipient;
      const sumValue = value;
      donReciMap.push({donor,recip,sumValue})
      }
    })
    }
  })

  const links = [];

  donReciAggr.forEach(([country,recips]) => {
    if (donors10.includes(country)){
    recips.forEach(([recipient,value]) =>{
      const source = country;
      if (recipient20.includes(recipient)){
      const target = recipient;
      const weight = value;
      links.push({source,target,weight}) //data structure must be source target..
      }
    })
    }
  })
  console.log(links)
  const hierarchizedAidData = d3.hierarchy(donReciAggr[0])
  let hier = `<small>${JSON.stringify(hierarchizedAidData,null,2)}</small>`
  hierarchy.innerHTML = hier;

  const forTreeMap = donReciAggr[0] //taking only the first data
  const toTreeMap = d3.treemap()
          .size([400,400])(d3.hierarchy(forTreeMap))
  let map = `<small>${JSON.stringify(toTreeMap,null,2)}</small>`
  tree.innerHTML = map;

  const allPlayers = recipient20.concat(donors10)

  const linkForce = links.map(id => id)
  
  const toNet = linkForce.slice(0,3)
  let linkd = `<small>${JSON.stringify(toNet)}</small>`
  net.innerHTML = linkd

  
  const nodeC = allPlayers.map(id => ({id}))

  const nodeCountry = nodeC.map(d => d)
  console.log(nodeCountry[0])

  let vertex = `<small>{id:"India"
    index : 0
    vx : 0.00012028922894812936
    vy : 0.005503308778288158
    x : 184.34809379227045
    y : 150.0284842621878}</small>`
  inter.innerHTML = vertex

  const svg = d3.select('#chart')

  const g = svg.append('g')
    .attr('transform',`translate(${40},
    ${50})`)

    const simulation = d3.forceSimulation(nodeC)
    //first argument is name for the force, the 2nd argument
    .force('link',d3.forceLink(linkForce).id(d => d.id))
    //set mean position of nodes to be center of vis
    .force('center',d3.forceCenter(350/ 2, 350/2))
    //make nodes repel each other
    .force('manyBody',d3.forceManyBody().strength(-700))
    //prevent overlapping
    .force('collision',d3.forceCollide(10))
    .on("tick",ticked);
  
  const edges = g.append('g')
    .selectAll('line')
    .data(linkForce)
    .join('line')
    .attr('stroke','black')
    .attr('fill','none')
    .attr('stroke-width',1);

  const vertices = g.append('g')
    .selectAll('g')
    .data(nodeCountry)
    .join('g');

  vertices.append('circle')
    .attr('r',10)
    .attr('fill','steelblue')

  const textSources = g.selectAll('text .src')
    .data(links)
    .join('text')
    .text(d => d.source.id)
    .attr('class','src')
    .attr('fill','orange')

  const textTargets = g.selectAll('text .tgt')
    .data(links)
    .join('text')
    .text(d => d.target.id)
    .attr('class','tgt')
    .attr('fill','purple')
    
  simulation.on('tick', () => {
    // move the group for each vertex
    vertices
        .attr('transform', d => `translate(${d.x},${d.y})`);
    
    // set the starting and ending coordinates for each edge
    edges
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('opacity',0.3);

      textSources
        .attr('transform',d => `translate(${d.source.x},${d.source.y})`)

      textTargets
        .attr('transform',d => `translate(${d.target.x},${d.target.y})`)
  });
  function ticked() {
    edges
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    vertices
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
      
  }

}
