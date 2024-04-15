const D3Legend = ({legend, legendOption, legendData, palette, children}) => {
  const textPos = legend.itemTextPosition;
  const {maxWidth, count, row, visible} = legendOption;
  const translate = [0];

  if (textPos == 'right') {
    translate.push(...maxWidth);
  } else {
    translate.push(...Array(count).fill(maxWidth));
  }

  for (let i = 1; i < translate.length; i++) {
    translate[i] = translate[i - 1] + translate[i];
  }

  const getTranslate = (idx) => {
    if (textPos == 'right') {
      const curRow = Math.floor(idx / count);
      const y = idx % count * 25;
      const x = translate[curRow];

      return 'translate(' + x + ', ' + y + ')';
    } else {
      const curRow = Math.floor(idx / count);
      const y = curRow * 40;
      const x = translate[idx % count] + maxWidth / 2;

      return 'translate(' + x + ', ' + y + ')';
    }
  };

  const getLegend = () => {
    let width;
    let height;

    if (textPos == 'right') {
      width = maxWidth.reduce((acc, n) => acc + n, 0);
      height = Math.min(legendData.length, count) * 25;
    } else {
      width = maxWidth * Math.min(legendData.length, count);
      height = row * 40;
    }

    const style = {
      'right': {
        'rect': {
        },
        'text': {
          transform: 'translate(18, 10)'
        }
      },
      'bottom': {
        'rect': {
          transform: 'translate(-6, 0)'
        },
        'text': {
          transform: 'translate(0, 30)',
          textAnchor: 'middle'
        }
      }
    };

    return (
      <svg width={width} height={height}>
        {legendData.map((name, i) =>
          <g
            key={'legend-' + i}
            transform={getTranslate(i)}
          >
            <rect
              fill={palette[i]}
              width='12'
              height='12'
              {...style[textPos].rect}
            >
            </rect>
            <text
              fill='rgb(118, 118, 118)'
              fontSize='12px'
              {...style[textPos].text}
            >
              {name}
            </text>
          </g>
        )}
      </svg>
    );
  };

  const getFlexOption = () => {
    const option = {};
    const vertical = legend.verticalAlignment;
    const horizontal = legend.horizontalAlignment;

    const flexDirectMapper = {
      'left': 'row',
      'right': 'row-reverse',
      'top': 'column',
      'bottom': 'column-reverse'
    };

    const alignItemsMapper = {
      'left': 'start',
      'center': 'center',
      'right': 'end',
      'top': 'start',
      'bottom': 'end'
    };

    if (textPos == 'right') {
      option.flexDirection = flexDirectMapper[horizontal];
      option.alignItems = alignItemsMapper[vertical];
    } else {
      option.flexDirection = flexDirectMapper[vertical];
      option.alignItems = alignItemsMapper[horizontal];
    }

    return option;
  };

  if (!visible) {
    return <>{children}</>;
  }

  return (
    <div style={{
      display: 'flex',
      ...getFlexOption()
    }}>
      {getLegend()}
      {children}
    </div>
  );
};

export default D3Legend;
