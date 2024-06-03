import {useEffect, useRef} from 'react';
import D3PainterForCollapsibleTree from './D3PainterForCollapsibleTree';

const D3CollapsibleTree = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForCollapsibleTree.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForCollapsibleTree.painting();

    return () => {
      D3PainterForCollapsibleTree.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3CollapsibleTree;
