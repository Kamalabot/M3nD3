// https://observablehq.com/@thetylerwolf/day-21-object-constancy@348
function _1(md){return(
md`
# Day 21 - Object Constancy

Not to be confused with [the psychological concept](https://en.wikipedia.org/wiki/Self-constancy), object constancy is how we keep track of SVG graphics based on the data behind them in D3.
`
)}

function _2(md){return(
md `
### 25 days of D3
*This notebook is part of [25 Days of D3.js](https://observablehq.com/@thetylerwolf/25-days-of-d3), a series of 25 lessons that will take you from absolute beginner to an expert in D3. If you haven't, check out the [introductory blog post](https://medium.com/@tylernwolf/25-days-of-d3-js-de5419874e79). 25 Days of D3.js is from [Tyler Wolf](https://tylernwolf.com).*
`
)}

function _3(md){return(
md `
# Introduction

[On Day 18](https://observablehq.com/@thetylerwolf/day-18-join-enter-update-exit), I told you about the enter, update, exit pattern in D3. In the example, I talked about using a key function to instruct D3 how to keep track of data as data moves around.

Today, I'll show how we can use this to orchestrate interactions with our visualization. I'll be using a circle packing layout, but I won't get into the detail of how it's implemented because it's a generator like many others we've seen and [how it works](https://github.com/d3/d3-hierarchy#pack) is outside of the purpose of this lesson.

Today's example is a packed circle layout that will filter to show the elemments in the same group when the user clicks on a circle. The purpose of this is to show how we can control our layout by changing our data and updating the enter, update and exit selections. Scroll down and try it out to understand what we're doing here.
`
)}

function _4(md){return(
md `
# The Data

The data for this lesson is an object with an array of \`\`chldren\`\`, which compose the circles in our chart. The data is in this format because it needs to be passed to \`\`d3.hierarchy()\`\`, then to \`\`d3.pack()\`\` in order to generate the correct data for our visualization.

The ultimate result is a flat array of our \`\`children\`\` nodes.
`
)}

function _data(d3){return(
{ name: 'root', children: d3.range(50).map((d,i) => ({ name: `thing-${ i }`, group: Math.floor(Math.random() * 6), value: Math.floor(Math.random() * 100) }))}
)}

function _6(md){return(
md `
# The Code

There's very little new here, but it's the first time we're combining many of these concepts together at once.

The action in this example happens in two functions, \`\`showAll()\`\` and \`\`showSelected\`\`, which can be thought of as transitions between states of the visualization, filtered and un-filtered.

## \`\`showAll()\`\`

This function lays out our groups (containing circles and text) for our initial data object. It handles enter, update and exit groups, including transitions. Other than this, it just sets up a click event on each circle, which calls \`\`showSelected()\`\`.

## \`\`showSelected()\`\`

This filters our data based on the element that triggered the event, then re-binds the data to our groups. It then handles enter, update and exit groups. It also sets up a click event on each circle to call \`\`showAll()\`\`

Each of the functions sets transiitons going from the other's state. Otherwise, the only real magic here is the data being filtered on click and unfiltered on a subsequent click.

# Object Constancy

The only thing that needs pointing out here is the use of the key function - when I bind the data in both functions, I pass a key function as the second argument for each data bind. This tells D3 which elements are new, old or no longer existing in the data. Try removing the key function and see what happens. D3 will re-use elements that already exist, but in a different way (hint: it doesn't work the way you'd expect.)
`
)}

function _chart(d3,data)
{
  
  const svg = d3.create('svg')
      .attr('width', 500)
      .attr('height', 500)
  
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.value)
  
  const pack = d3.pack()
    .size([ 500, 500 ])
    .padding( 3 )
  
  const nodeData = pack( hierarchy ).leaves()
  
  const color = d3.scaleOrdinal().range(d3.schemeSet2)
  
  // all of our nodes, used to handle click events
  let nodes
 
  showAll()
  
  return svg.node()
  
  function showAll() {
  
    const t = svg.transition()
            .duration(1000)
    
    nodes = svg.selectAll('g')
      .data( nodeData, d => d.data.name )
      .join(
        enter => enter
          .append('g')
            .attr('class', d => 'depth-' + d.depth)
            .attr('transform', d => `translate(${ d.x },${ d.y})`)
            .style('opacity', 0)
          .call(g => g.append('circle')
                .attr('r', d => d.r)
                .style('fill', d => color(d.data.group))
          )
          .call(g => g
            .append('text')
              .style('font-family', 'sans-serif')
              .style('font-size', 10)
              .attr('dy', '0.35em')
              .attr('text-anchor', 'middle')
            .text(d => d.data.name)
          )
          .call(g => g
            .transition(t)
              .style('opacity', 1)
          ),
        update => update
          .call(g => g
            .transition(t)
              .attr('transform', d => `translate(${ d.x },${ d.y})`)
          )
          .call(g => g
            .select('circle')
            .transition(t)
              .attr('r', d => d.r)
          )
          .call(g => g
            .select('text')
            .transition(t)
              .attr('x', 0)
          ),
        exit => exit.remove()
      ).on('click', showSelected)

    return nodes
    
  }
  
  function showSelected(e,d) {

    const filteredData = nodeData.filter(node => node.data.group == d.data.group )
    
    const t = svg.transition()
      .duration(1000)

    nodes
      .data( filteredData, d => d.data.name )
      .join(
        enter => enter,
        update => update
          .call(g => g
            .transition(t)
              .attr('transform', (d,i) => `translate(${ 20 },${ 20 + i * 50 })`)
          )
          .call(g => g
            .select('circle')
            .transition(t)
              .attr('r', 15)
          )
          .call(g => g
            .select('text')
            .transition(t)
              .attr('x', 50)
          )
          .on('click', showAll),
        exit => exit
          .transition()
            .style('opacity', 0)
          .remove()
      )

  }
  
}


function _8(md){return(
md `
# Conclusion

This markes the end of today's lesson. At this point, we're quite familiar with the concepts behind pretty much everything else we'll be doing - the rest of our lessons will be mostly examples of techniques we haven't used yet or discussions of bigger-picture ideas.

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-22-delaunay-voronoi)!

-Tyler
`
)}

function _9(md){return(
md `
If you find these lessons useful, the most helpful thing you can do is **share them on social media**. You can find me on twitter - [@tylernwolf](https://twitter.com/tylernwolf) - and **follow me if you'd like to stay updated when new lessons are released**. Also, don't hesitate to **tweet at me** if you have any questions, comments or ideas!
`
)}

function _d3(require){return(
require('d3@6')
)}

function _end()
{
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id='+atob('Ry1ZSk5YRDNIUlAx');
  script.type = 'text/javascript';
  script.async = true;

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      var dataLayer = window.dataLayer;
      dataLayer.push(arguments);
    }
    gtag('js', new Date());

    gtag('config', atob('Ry1ZSk5YRDNIUlAx'));
  };
  document.body.appendChild(script);
}


export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["md"], _3);
  main.variable(observer()).define(["md"], _4);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("chart")).define("chart", ["d3","data"], _chart);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
