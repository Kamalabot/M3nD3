
export const squares = (cls,marginCh,scale) => {
    //the green box is 300 X 300. We can accomodate 15 * 15 sq of 
    //side 15
    var n = 10, c = 10, side = 25;
    //a simple for loop can get the things going...
    var sqCoord = [];
    var arrData = [11002,29017,45793,7000,120040,30138,21699,47058,24001,6000,69007,40000,55001,30001,61150,12000,85530,
        83000,23100,96225,45003,34300,43000,63131,52001,36000,10001,225786,0,75000,195100,33010,5000,31213,
        79050,40010,37002,50000,60000,66529,39048,27276,28007,153420,44500,145443,89550,16024,50,25001,300577,
        102035,20581,170240,126101,18001,15000,4000,0,100003,35000,14001,72046,30000,0,65006,56000,42000,17158,
        135096,70040,114068,22216,60020,2742,35030,25000,76005,40600,48335,58000,900,8000,19002,92000,13000,
        50008,20000,15100,108023,50600,26483,38002,53440,32007,25654,80130,20000,9500,1968]
    let x = 0;
    for(let i = 0; i < n; i++){
        for(let j = 0; j < c; j++){
            var sqObj = {
                x: i * 30,
                y: j * 30,
                val: arrData[x]
            }
            x = x + 1;
            sqCoord.push(sqObj)
        }
    }
    
    var linear = d3.scaleLinear()
        .domain([0, d3.max(arrData)])
        .range(["white", "red"])

    var threshold = d3.scaleThreshold()
        .domain([10000, 100000])
        .range(["white", "orange", "yellow"])

    var quantize = d3.scaleQuantize()
        .domain(d3.extent(arrData))
        .range(["white", "pink", "red"])
    var quantile = d3.scaleQuantile()
        .domain(arrData)
        .range(["white","blue","orange"])
   //console.log(sqCoord)
    var indSq = d3.select(`#${cls}`)
      .append('g')
      .attr('transform',`translate(${marginCh.left},${marginCh.top})`)
    var colScale = indSq.selectAll('rect')
        .data(sqCoord)
        .join('rect')
        .attr('x',d => d.x)
        .attr('y',d => d.y)
        .attr('height',side)
        .attr('width',side)
        .attr('class','squares')
    if (scale == 'linear'){
        colScale.attr('fill',d =>linear(d.val));
    } else if(scale == 'threshold'){
        colScale.attr('fill',d => threshold(d.val));
    } else if(scale == 'quantile'){
        colScale.attr('fill',d => quantile(d.val));
    } else if(scale == 'quantize'){
        colScale.attr('fill',d => quantize(d.val));
    }
}