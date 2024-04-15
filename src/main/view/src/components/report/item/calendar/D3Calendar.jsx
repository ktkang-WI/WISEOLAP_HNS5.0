import {useEffect, useRef} from 'react';
import styled from 'styled-components';
import D3CalendarPainter from './D3CalendarPainter';
import useModal from 'hooks/useModal';

const Svg = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: none;
`;

const isThisDateType = (value) => {
  const regex = /^(?:\d{4}(?:\/|-)\d{2}(?:\/|-)\d{2}|\d{8})$/;
  return regex.test(value);
};

const dataSourceGenerator = (dataSource, argumentField, valueFiled) => {
  const Obj = {};
  let result = [];
  dataSource.forEach((d) => {
    Obj[d[argumentField]] = Obj[d[argumentField]] || 0 + d[valueFiled];
  });
  const keys = Object.keys(Obj);
  keys.forEach((key) => {
    const tempObj = {
      date: key,
      value: Obj[key]
    };
    result.push(tempObj);
  });
  keys.forEach((key) => {
    if (!isThisDateType(key)) result = null;
  });
  return result;
};

const D3Calendar = ({
  width,
  dataSource,
  argumentField,
  valueFiled,
  onClick
}) => {
  const svgRef = useRef(null);
  const {alert} = useModal();
  useEffect(() => {
    dataSource = dataSourceGenerator(dataSource, argumentField, valueFiled);
    if (!dataSource) {
      alert('유효하지 않은 데이터 형식입니다.');
      return;
    }
    const option = {
      width
    };
    D3CalendarPainter.init({
      container: svgRef.current,
      dataSource: dataSource,
      defaultOption: option,
      event: {
        onClick: onClick
      }
    });
    D3CalendarPainter.painting();
    return () => {
      D3CalendarPainter.erasing();
    };
  }, [dataSource]);
  return (
    <Svg
      ref={svgRef}
    >
    </Svg>
  );
};

export default D3Calendar;
