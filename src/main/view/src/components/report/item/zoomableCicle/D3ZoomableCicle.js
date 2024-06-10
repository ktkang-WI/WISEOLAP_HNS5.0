import {useEffect, useRef} from 'react';
import D3PainterForZoomableCicle from './D3PainterForZoomableCicle';

const D3ZoomableCicle = ({
  dataSource,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForZoomableCicle.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height
      }
    });
    D3PainterForZoomableCicle.painting();

    return () => {
      D3PainterForZoomableCicle.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3ZoomableCicle;
