import {useEffect, useRef} from 'react';
import D3PainterForWordCloud from './D3PainterForWordCloud';

const D3WordCloud = ({
  dataSource,
  valueField,
  labelField,
  width,
  height
}) => {
  const svgRef = useRef(null);
  useEffect(() => {
    dataSource = dataSource.map((item) => {
      return {
        dimension: item[labelField],
        measure: item[valueField]
      };
    });
    D3PainterForWordCloud.init({
      container: svgRef.current,
      dataSource: dataSource
    });
    D3PainterForWordCloud.painting();
    return () => {
      D3PainterForWordCloud.erasing();
    };
  }, []);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3WordCloud;
