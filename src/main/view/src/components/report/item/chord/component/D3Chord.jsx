import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import * as d3 from 'd3';
import {styled} from 'styled-components';
import {darkenColor} from 'components/utils/Color';
import {
  getHatchingPattern, getPaletteForD3, getTextWidth
} from '../../util/d3/CanvasUtility';

const StyledWrapper = styled(Wrapper)`
  .group:hover {
    .hatch {
      opacity: 1 !important;
    }
  }
`;

const D3Chord = ({
  id,
  width,
  height,
  data,
  onClick,
  palette,
  selectedItem = []
}) => {
  const {matrix, groups} = data.info;

  const x = width / 2;
  const y = height / 2;

  let margin = 0;

  groups.forEach((group) => {
    margin = Math.max(margin, getTextWidth(group.value, 14) + 10);
  });

  const radius = Math.min(width, height) / 2 - margin - 10;

  if (radius <= 0) return <></>;

  const chord = d3.chord().padAngle(0.02).sortSubgroups(d3.descending)(matrix);
  const arc = d3.arc().innerRadius(radius).outerRadius(radius + 18);
  const ribbon = d3.ribbon().radius(radius);

  const d3Palette = getPaletteForD3(palette, groups.length);

  const rootGroup = chord.groups[0];
  const rotation = - (rootGroup.endAngle - rootGroup.startAngle) /
   2 * (180 / Math.PI);

  const fade = (opacity, targetOpacity, groupOpacity, i) => {
    const chordPath = d3.selectAll('#' + id + ' .chord-path')
        .data(chord);

    const groupPath = d3.selectAll('#' + id + ' .group').data(chord.groups);

    chordPath
        .filter((d) => {
          return d.source.index != i && d.target.index != i;
        })
        .transition()
        .style('opacity', opacity);

    chordPath
        .filter((d) => {
          return d.source.index == i && d.target.index == i;
        })
        .transition()
        .style('opacity', targetOpacity);

    groupPath
        .filter((d, idx) => {
          return i != idx;
        })
        .transition()
        .style('opacity', groupOpacity);
  };

  const edges = chord.groups.map((group, i) => {
    const angle = (group.startAngle + group.endAngle) / 2;
    const d = arc(group);
    const selected = selectedItem[groups[i].field]?.find(
        (item) => item == groups[i].value);
    return (
      <g
        className='group'
        key={'chord-group-' + i}
        onClick={() => onClick({[groups[i].field]: groups[i].value})}
        onMouseOver={() => fade(0.1, 0.7, 0.5, i)}
        onMouseOut={() => fade(0.5, 0.5, 1, i)}
        transform={'rotate(' + rotation + ')'}>
        <path
          className='edge'
          fill={d3Palette[i]}
          d={d}
        />
        <path
          opacity={selected ? '1' : '0'}
          className='hatch'
          fill='url(#hatch)'
          d={d}
        />
        <text
          textAnchor={angle > Math.PI ? 'end' : 'start'}
          fill={darkenColor(d3Palette[i])}
          fontSize={'14px'}
          transform={
            'rotate(' + (angle * 180 / Math.PI - 90) + ') ' +
            'translate(' + (radius + 28) + ')' +
            (angle > Math.PI ? 'rotate(180)' : '')
          }
        >
          {groups[i].value}
        </text>
      </g>
    );
  });

  const ribbons = chord.map((d, i) => (
    <path
      key={'chord-path-' + i}
      className='chord-path'
      fill={d3Palette[d.source.index]}
      data={d.source.index + '-' + d.target.index}
      opacity='0.5'
      d={ribbon(d)}
      transform={'rotate(' + rotation + ')'}
    />
  ));

  return (
    <StyledWrapper id={id}>
      <svg
        width={width} height={height}
        x={x} y={y}
        className='chord-diagram'>
        <defs>
          {getHatchingPattern()}
        </defs>
        <g transform={'translate(' + x + ', ' + y + ')'}>
          {edges}
          {ribbons}
        </g>
      </svg>
    </StyledWrapper>
  );
};

export default D3Chord;
