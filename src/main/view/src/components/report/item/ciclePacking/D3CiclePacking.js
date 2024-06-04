import {useEffect, useRef} from 'react';
import D3PainterForCiclePacking from './D3PainterForCiclePacking';

const D3CiclePacking = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForCiclePacking.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForCiclePacking.painting();

    return () => {
      D3PainterForCiclePacking.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3CiclePacking;
