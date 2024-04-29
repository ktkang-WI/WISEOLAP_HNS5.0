import {useEffect, useRef} from 'react';
import D3PainterForCollapsibleTree from './D3PainterForCollapsibleTree';

const D3CollapsibleTree = ({
  dataSource
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForCollapsibleTree.init({
      container: svgRef.current,
      dataSource: dataSource
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
