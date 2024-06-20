import {useEffect, useRef} from 'react';
import D3PainterForHeatMap from './D3PainterForHeatMap';

const D3HeatMap = ({
  dataSource,
  width,
  height,
  palette
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    const xDomain =
      [...new Set(dataSource.map((item) => item.x))];
    const yDomain =
      [...new Set(dataSource.map((item) => item.y))];
    D3PainterForHeatMap.init({
      container: svgRef.current,
      dataSource: dataSource,
      xDomain: xDomain,
      yDomain: yDomain,
      option: {
        width: width,
        height: height,
        palette
      }
    });
    D3PainterForHeatMap.painting();
    return () => {
      D3PainterForHeatMap.erasing();
    };
  }, [dataSource, width, height, palette]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3HeatMap;
