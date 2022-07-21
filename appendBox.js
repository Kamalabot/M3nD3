//all the variables inside the function needs to be provided as arguments.
export const appendBox = (chart, ind,marginCh, rectL, rectB) =>{
    chart.append('rect')
        .attr('x',marginCh.left)
        .attr('y',marginCh.bottom)
        .attr('height',rectL)
        .attr('width',rectB)
        .attr('class',`box`)
        .attr('id',`id${ind}`)    
}
