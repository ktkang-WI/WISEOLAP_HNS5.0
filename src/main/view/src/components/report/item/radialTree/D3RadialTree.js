import {useEffect, useRef} from 'react';
import D3PainterForRadialTree from './D3PainterForRadialTree';

const D3RadialTree = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForRadialTree.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForRadialTree.painting();

    return () => {
      D3PainterForRadialTree.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3RadialTree;

