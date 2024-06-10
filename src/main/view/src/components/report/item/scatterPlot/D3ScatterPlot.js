import {useEffect, useRef} from 'react';
import D3PainterForScatter from './D3PainterForScatterPlot';

const D3ScatterPlot = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForScatter.init({
      container: svgRef.current,
      dataSource: dataSource.data,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForScatter.painting();
    return () => {
      D3PainterForScatter.erasing();
    };
  }, [dataSource, height, width]);

  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3ScatterPlot;
