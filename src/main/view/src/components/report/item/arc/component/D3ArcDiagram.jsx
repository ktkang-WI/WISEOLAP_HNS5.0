import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import * as d3 from 'd3';
import {styled} from 'styled-components';
// import {darkenColor} from 'components/utils/Color';
import {
  getHatchingPattern, getLegendOptions, getPaletteForD3, getTextWidth
} from '../../util/d3/CanvasUtility';
import D3Legend from '../../d3/D3Legend';

const StyledWrapper = styled(Wrapper)`
  overflow: auto;

  .group:hover {
    .hatch {
      opacity: 1 !important;
    }
  }
`;

const D3ArcDiagram = ({
  id,
  width,
  height,
  data,
  onClick,
  palette,
  rotated = false,
  dimensions,
  legend,
  selectedItem = []
}) => {
  const links = data.data;
  const {nodes} = data.info;

  if (nodes.length == 0) return <></>;

  const legendData = dimensions.map((dim) => dim.caption);
  const {itemWidth, itemHeight, legendOption} = getLegendOptions(
      legend, width, height, legendData);

  let svgHeight = itemHeight - 20;
  let svgWidth = itemWidth - 20;

  if (rotated) {
    svgHeight = nodes.length * 25;
  } else {
    svgWidth = nodes.length * 25;
  }

  const d3Palette = getPaletteForD3(palette, dimensions.length);

  const scalePoint = d3.scalePoint()
      .range([10, rotated ? svgHeight : svgWidth])
      .domain(nodes.map(({id}) => id));

  const labelAreaSize = nodes.reduce((acc, node) => {
    const size = getTextWidth(node.id, 14, 'Noto Sans KR');

    return Math.max(acc, size);
  }, 0);

  const x = labelAreaSize + 10;
  const y = itemHeight - labelAreaSize - 30;

  const fade = (opacity, targetOpacity, name, color) => {
    const paths = d3.selectAll('#' + id + ' .arc-link')
        .data(links);

    paths
        .filter((d) => {
          return d.source != name && d.target != name;
        })
        .transition()
        .style('stroke', 'gray')
        .style('opacity', opacity);

    paths
        .filter((d) => {
          return d.source == name || d.target == name;
        })
        .transition()
        .style('stroke', color)
        .style('opacity', targetOpacity);
  };

  const onMouseOver = (e, id, group) => {
    fade(0.1, 1, id, d3Palette[group]);

    e.target.setAttribute('r', '7');
    e.target.setAttribute('stroke', d3Palette[group]);
    e.target.setAttribute('fill', 'white');
  };

  const onMouseOut = (e, id, group, selected) => {
    fade(1, 1, id, 'gray');

    if (!selected) {
      e.target.setAttribute('r', '5');
      e.target.setAttribute('stroke', 'none');
      e.target.setAttribute('fill', d3Palette[group]);
    }
  };

  const getLinks = () => {
    return links.map(({source, target}, idx) => {
      const start = scalePoint(source);
      const end = scalePoint(target);
      const r = Math.abs(end - start) / 2;

      const getPath = () => {
        if (rotated) {
          const pWidth = Math.min(r, itemWidth - 80);

          return ['M', x, start, // 시작 x, y
            'A',
            pWidth, ',', // 굴곡점 좌표
            r, // 높이
            0, 0, ',',
            start < end ? 1 : 0, x, ',', end] // 호 방향 설정, 끝 x, y
              .join(' ');
        } else {
          const pHeight = Math.min(r, y - 5);

          return ['M', start, y, // 시작 x, y
            'A',
            r, ',', // 굴곡점 좌표
            pHeight, // 높이
            0, 0, ',',
            start < end ? 1 : 0, end, ',', y] // 호 방향 설정, 끝 x, y
              .join(' ');
        }
      };

      return <path
        key={'link-' + idx}
        className='arc-link'
        d={getPath()}
        fill='none'
        stroke='gray'
        strokeWidth={1}
      >
      </path>;
    });
  };

  const getNodes = () => {
    return nodes.map(({id, group}, idx) => {
      const key = dimensions[group].uniqueName;
      const selected = selectedItem[key]?.includes(id);
      return <circle
        key={'node-' + idx}
        r={selected ? 7 : 5}
        stroke={selected ? d3Palette[group] : 'none'}
        strokeWidth={4}
        strokeLinejoin=''
        fill={selected ? 'white' : d3Palette[group]}
        onClick={() => onClick(key, id)}
        cy={rotated ? scalePoint(id) : y}
        cx={rotated ? x : scalePoint(id)}
        onMouseOver={(e) => onMouseOver(e, id, group)}
        onMouseOut={(e) => onMouseOut(e, id, group, selected)}
      ></circle>;
    });
  };

  const getLabels = () => {
    return nodes.map(({id, group}, idx) => {
      const posY = rotated ? scalePoint(id) : y + 10;
      const posX = rotated ? x - 10 : scalePoint(id);
      return <g
        key={'label' + idx}
        transform={'translate(' + posX + ', ' + posY + ')'}
      >
        <text
          // fill={d3Palette[group]}
          transform={'rotate(' + (rotated ? '0' : '90') + ') translate(0, 6)'}
          fontFamily='Noto Sans KR'
          fontSize='14px'
          textAnchor={rotated ? 'end' : 'start'}
        >
          {id}
        </text>
      </g>;
    });
  };

  return (
    <D3Legend
      legend={legend}
      legendOption={legendOption}
      palette={d3Palette}
      legendData={legendData}
    >
      <StyledWrapper
        id={id}
        className='custom-scrollbar'
        width={itemWidth + 'px'}
        height={itemHeight + 'px'}
      >
        <svg
          width={svgWidth + (rotated ? 0 : 20)}
          height={svgHeight + (rotated ? 20 : 0)}
          className='arc-diagram'>
          <defs>
            {getHatchingPattern()}
          </defs>
          <g>
            <g>
              {getLinks()}
            </g>
            <g>
              {getNodes()}
            </g>
            <g>
              {getLabels()}
            </g>
          </g>
        </svg>
      </StyledWrapper>
    </D3Legend>
  );
};

export default D3ArcDiagram;
