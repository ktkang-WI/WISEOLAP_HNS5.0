import DefaultCard from 'components/common/atomic/Common/Card/DefaultCard';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {useEffect, useRef} from 'react';


const Card = ({setItemExports, id, item, node}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const dataSource = mart.data.data;
  const seriesNames = mart.data.info.seriesMeasureNames;

  const dxRef = useRef();
  const itemExportObject =
    itemExportsObject(id, dxRef, 'CARD', mart.data.data);

  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

  return (
    <DefaultCard
      ref={dxRef}
      width={node?._rect?.width}
      dataSource={dataSource}
      argumentField='arg'
      autoCoulmn={meta?.cardOption?.contentArray.autoNumberSet}
      columnNumber={meta?.cardOption?.contentArray.columnNumber}
      valueFiled={seriesNames[0].summaryName}
      column={2}
    />
  );
};

export default Card;
