import {useEffect, useRef} from 'react';
import D3PainterForZoomableIcicle from './D3PainterForZoomableIcicle';

const D3ZoomableIcicle = ({
  dataSource,
  palette,
  height,
  width
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    D3PainterForZoomableIcicle.init({
      container: svgRef.current,
      dataSource: dataSource,
      option: {
        width: width,
        height: height,
        palette
      }
    });
    D3PainterForZoomableIcicle.painting();

    return () => {
      D3PainterForZoomableIcicle.erasing();
    };
  }, [dataSource]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3ZoomableIcicle;
