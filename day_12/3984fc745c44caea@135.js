// https://observablehq.com/@thetylerwolf/day-12-interactions-1-click-and-hover@135
function _1(md){return(
md`
# Day 12 - Interactions 1 - Click and Hover

We can build charts and we can animate them, so now let's make them interactive! Today, we'll cover the simplest interactions - click and hover.
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

When we build visualizations for the web, we can't always show all of our data all the time. This is for a variety of reasons: screen sizes, a massive data set or maybe a creative decision. One remedy is to implement interactions that can fill in the gaps in the data presentation.

For example, our treemap couldn't show all labels on all data points because of size constraints. We implemented a very simple solution to show the title of the data point on hover. Now, we'll learn how to take control of events like \`\`hover\`\` and \`\`click\`\` and make them do whatever we like.
`
)}

function _4(md){return(
md `
## selection.on()

Like transitions, binding an event to an element is quite simple and very similar to many DOM manipulation libraries. We just take the selection and call \`\`selection.on('eventType', (d) => { /* do something */ })\`\`

\`\`'eventType'\`\` is a DOM event type. They include \`\`click\`\`, \`\`mouseover\`\`, \`\`mouseleave\`\`, etc. [You can see a full list here](https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events).

The function in the second argument is the callback function to be called when the event fires. This is where we control our events. It's passed the same arguments as any accessor on a selection (\`\`d, i, arr\`\`).

Below is example of animating a color change when an element is hovered.
`
)}

function _hover(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  // a 10x10 matrix
  const data = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].map(() => [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ])
  
  svg.selectAll('g')
    .data(data)
    .join('g')
      .attr('transform', (d,i) => `translate(0,${30 * i})`)
    .selectAll('rect')
    .data(d => d)
    .join('rect')
      .attr('x', (d,i) => 30 * i)
      .attr('height', 30)
      .attr('width', 30)
      .style('fill', '#4dbeff')
      // When the mouse moves over a rect, quickly fade its color to blue
      .on('mouseover', function(e, d) {
    
        d3.select(this)
          .transition()
          .duration(100)
            .style('fill', 'white')
    
      })
      // When the mouse leaves a rect, slowly fade its color back to orange
      .on('mouseout', function(e, d) {
    
        d3.select(this)
          .transition()
          .duration(2000)
            .style('fill', '#4dbeff')
    
      })
  
  return svg.node()
  
}


function _6(md){return(
md `
Interactions can be a lot of fun! We don't have to limit them to the element with which we interact. Here's an example of animating surrounding elements on a click:
`
)}

function _click(d3)
{
  
  const svg = d3.create('svg')
      .attr('width', 300)
      .attr('height', 300)
  
  // array of 100 elements
  const data = d3.range(0, 100)
  
  const circles = svg.selectAll('circle')
    .data( data )
    .join('circle')
  
  circles
    .attr('cx', (d,i) => 15 + 30 * (i % 10))
    .attr('cy', (d,i) => 15 + Math.floor( i/10 ) * 30)
    .attr('r', 10)
    .style('fill', '#ff5900')
    // When we click an element, color all elements in the same row
    // and all elements in the same column, then fade them back
    .on('click', (e, d) => {

      const clickX = d % 10,
        clickY = Math.floor(d/10)

      // go through the array of circles one-by-one
      circles.each(function(c, i) {

        const currX = i % 10,
              currY = Math.floor(i/10)

        // If it's the one we clicked, don't change it
        if(d == i) { 
          return
        }          
        // But if an element has the same x position
        // or the same y position...
        else if(currX == clickX || currY == clickY) {
          // then change it to blue quickly, then fade slowly back
          d3.select(this)
            .transition()
            .duration(100)
            .style('fill', '#4dbeff')
            .transition()
            .duration(1000)
            .style('fill', '#ff5900')
        }

      })

    })

  return svg.node()
  
}


function _8(md){return(
md `
I couldn't help getting a little fancy with that last one, but I'm sure you can understand. The sort of math used in the click example comes up from time to time with more traditional interactions. In addition, you may want to match values on a key or a class name, which can be used for connecting two data points more easily.

It's worth studying and making sense of the technique used in the above if it's at all unfamiliar with you.

# Conclusion

As you can see, setting up basic interactions is quite easy. The rest is just hooking them up to create interactions that enhance your visualization. In future lessons, we'll use click and hover interactions to help illustrate useful data connections.

Also, some housekeeping. I've created a table of contents for these lessons to make them all easier to navigate. [You can find it here](https://observablehq.com/@thetylerwolf/25-days-of-d3).

See you [tomorrow](https://observablehq.com/@thetylerwolf/day-13-interactions-2-zooming)!

Tyler
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
  main.variable(observer("hover")).define("hover", ["d3"], _hover);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer("click")).define("click", ["d3"], _click);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["md"], _9);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("end")).define("end", _end);
  return main;
}
