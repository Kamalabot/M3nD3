//Lets bring the data in
var l = d3.select("body")
            .append('svg')
            .attr('height',600)
            .attr('width',900)
            .append('g')

// d3.csv('cities.csv', (e, d)=>{
//     console.log(e)
//     console.log(d)
// })

// const data = await d3.dsv(",", "cities.csv", (d) => {
//     return {
//       year: new Date(+d.x, 0, 1), // convert "Year" column to Date
//       make: d.label,
//       model: d.Populations,
//     };
// });

// data.then((d) =>{
//     console.log(d)
// })

d3.csv("Lynx_trapped.csv").then((data) => {
    console.log(data); // [{"Hello": "world"}, …]
  });