import {useEffect, useRef} from 'react';
import D3PainterForSunBurstChart from './D3PainterForSunBurstChart';

const D3SunBurstChart = ({
  dataSource,
  palette,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForSunBurstChart.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height,
        palette: palette
      }
    });
    D3PainterForSunBurstChart.painting();

    return () => {
      D3PainterForSunBurstChart.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3SunBurstChart;
