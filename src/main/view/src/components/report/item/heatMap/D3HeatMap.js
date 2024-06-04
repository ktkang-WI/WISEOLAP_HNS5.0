import {useEffect, useRef} from 'react';
import D3PainterForHeatMap from './D3PainterForHeatMap';

const D3HeatMap = ({
  dataSource,
  valueField,
  dimensions,
  labelField,
  width,
  height
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    const xDomain =
      [...new Set(dataSource.map((item) => item[dimensions[0].name]))];
    const yDomain =
      [...new Set(dataSource.map((item) => item[dimensions[1].name]))];
    dataSource = dataSource.map((item) => {
      return {
        x: item[dimensions[0].name],
        y: item[dimensions[1].name],
        value: item[valueField]
      };
    });
    D3PainterForHeatMap.init({
      container: svgRef.current,
      dataSource: dataSource,
      xDomain: xDomain,
      yDomain: yDomain
    });
    D3PainterForHeatMap.painting();
    return () => {
      D3PainterForHeatMap.erasing();
    };
  }, []);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3HeatMap;
