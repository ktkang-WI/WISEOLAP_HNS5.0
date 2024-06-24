import {useEffect, useRef} from 'react';
import D3PainterForWordCloud from './D3PainterForWordCloud';

const D3WordCloud = ({
  dataSource,
  valueField,
  labelField,
  palette,
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
      dataSource: dataSource,
      option: {
        width: width,
        height: height,
        sectionSize: 5,
        palette
      }
    });
    D3PainterForWordCloud.painting();
    return () => {
      D3PainterForWordCloud.erasing();
    };
  }, [dataSource, width, height, palette]);
  return (
    <div
      ref={svgRef}
    >
    </div>
  );
};

export default D3WordCloud;
