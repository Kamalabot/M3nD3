export const bars = (cls,marginCh,scale,rectL,rectB) => {
    var indRect = d3.select(`#${cls}`)
      .append('g')
      .attr('transform',`translate(${marginCh.left},${marginCh.top})`)
    indRect.append('rect')
      .attr('x',scale('one'))
      .attr('width',scale.bandwidth())
      .attr('height',rectL)
      .attr('fill',"orange")
    indRect.append('rect')
      .attr('x',scale('two'))
      .attr('width',scale.bandwidth())
      .attr('height',rectL)
      .attr('fill',"yellow")
    indRect.append('rect')
      .attr('x',scale('three'))
      .attr('width',scale.bandwidth())
      .attr('height',rectL)
      .attr('fill',"blue")
    indRect.append('rect')
      .attr('x',scale('four'))
      .attr('width',scale.bandwidth())
      .attr('height',rectL)
      .attr('fill',"black")
  }