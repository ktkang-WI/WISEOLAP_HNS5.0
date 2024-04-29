import {useEffect, useRef} from 'react';
import D3PainterForRadialTree from './D3PainterForRadialTree';

const D3RadialTree = ({
  dataSource
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForRadialTree.init({
      container: svgRef.current,
      dataSource: dataSource
    });
    D3PainterForRadialTree.painting();

    return () => {
      D3PainterForRadialTree.erasing();
    };
  }, []);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3RadialTree;

