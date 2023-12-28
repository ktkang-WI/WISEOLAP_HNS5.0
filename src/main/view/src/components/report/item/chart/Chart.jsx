import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import DevChart, {
  Legend,
  Series,
  Tooltip
} from 'devextreme-react/chart';
import React, {useEffect, useRef} from 'react';

const Chart = ({setItemExports, id, mart}) => {
  if (!mart.init) {
    return <></>;
  }

  const seriesCaptions = mart.data.info.seriesDimensionCaptions;
  const seriesNames = mart.data.info.seriesDimensionNames;
  const itemRef = useRef(null);
  // 아이템별 파일 Export 데이터 저장
  const itemExportObject =
   itemExportsObject(id, itemRef, 'CHART', mart.data.data);

  useEffect(() => {
    setItemExports((prev) => {
      return [
        ...prev,
        itemExportObject
      ];
    });
  }, []);

  return (
    <DevChart
      ref={itemRef}
      dataSource={mart.data.data}
      width="100%"
      height="100%"
      id={id}
    >
      <Legend
        visible={true}
        position='outside'
        horizontalAlignment='right'
        verticalAlignment='top'
      />

      <Tooltip
        enabled={true}
        location='edge'
      ></Tooltip>
      {
        seriesNames.map(
            (valueField, i) =>
              <Series
                key={valueField}
                valueField={valueField}
                argumentField='arg'
                name={seriesCaptions[i]}
                type="bar"
              />
        )
      }

    </DevChart>
  );
};

export default React.memo(Chart);
