import {useEffect, useRef} from 'react';
import D3PainterForHierarchicalChart from './D3PainterForHierarchicalChart';

const D3HierarchicalChart = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForHierarchicalChart.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForHierarchicalChart.painting();

    return () => {
      D3PainterForHierarchicalChart.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3HierarchicalChart;
