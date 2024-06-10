import {useEffect, useRef} from 'react';
import D3PainterForWaterFall from './D3PainterForWaterFall';

const D3WaterFall = ({
  dataSource,
  valueField,
  labelField,
  width,
  height
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForWaterFall.init({
      container: svgRef.current,
      dataSource: dataSource,
      valueField,
      labelField,
      option: {
        width: width,
        height: height,
        sectionSize: 5
      }
    });
    D3PainterForWaterFall.painting();
    return () => {
      D3PainterForWaterFall.erasing();
    };
  }, [dataSource, width, height]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3WaterFall;
