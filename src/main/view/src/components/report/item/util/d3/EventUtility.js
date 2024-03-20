const onMouseEnter = (tooltip) => {
  // 툴팁 객체 없을 경우 생성
  if (!document.getElementById('d3_tooltip')) {
    const d3Tooltip = document.createElement('div');
    d3Tooltip.id = 'd3_tooltip';
    d3Tooltip.style.position = 'absolute';
    document.body.appendChild(d3Tooltip);
  }

  d3.select('#d3_tooltip')
      .html(tooltip)
      .style('visibility', 'visible');
};


const onMouseMove = (e) => {
  d3.select('#d3_tooltip')
      .style('visibility', 'visible')
      .style('top', (e.clientY - 10)+'px')
      .style('left', (e.clientX)+'px');
};

const onMouseOut = () => {
  d3.select('#d3_tooltip')
      .style('visibility', 'hidden');
};

export const TooltipEvent = {
  onMouseEnter,
  onMouseMove,
  onMouseOut
};
