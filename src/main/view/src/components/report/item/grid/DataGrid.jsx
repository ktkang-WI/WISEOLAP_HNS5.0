import DevDataGrid, {Column} from 'devextreme-react/data-grid';
import React, {useEffect, useRef, useState} from 'react';
import DataGridBullet from './DataGridBullet';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {SubLinkReportPopup} from 'components/report/util/ReportUtility';
import styled from 'styled-components';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';

const Container = styled.div`
  position: relative;
`;

const DataGrid = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const maxValue = {};

  if (!mart.init) {
    return <></>;
  }

  const dxRef = useRef();

  const itemExportObject =
   itemExportsObject(id, dxRef, 'GRID', mart.data.data);

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

  const getMaxValue = (column) => {
    if (!maxValue[column.name]) {
      maxValue[column.name] =
      Math.max.apply(null, mart.data.data.map((row) => row[column.name]));
    }
    return maxValue[column.name];
  };

  const cellRender = (e, column) => {
    let endScaleValue = 0;
    const value = e.data[column.name];

    if (column.detailSetting === 'bar') {
      endScaleValue = getMaxValue(column);

      return <DataGridBullet
        endScaleValue={endScaleValue}
        value={value}
        column={column}
      />;
    }

    if (value === 0) return '0';

    return value;
  };

  const [showPopup, setShowPopup] = useState(false);
  const focusedItem = useSelector(selectCurrentDataField);
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
      setShowPopup(true);
    };

    const handleContentReady = () => {
      const gridInstance = dxRef.current.instance;
      if (gridInstance) {
        const scrollable = gridInstance.getScrollable();
        const container = scrollable.element();
        container.addEventListener('contextmenu', handleContextMenu);
        return () => {
          container.removeEventListener('contextmenu', handleContextMenu);
        };
      }
    };

    const gridInstance = dxRef.current.instance;
    if (gridInstance) {
      gridInstance.on('contentReady', handleContentReady);
      return () => {
        gridInstance.off('contentReady', handleContentReady);
      };
    }
  }, []);


  return (
    <Container>
      <DevDataGrid
        ref={dxRef}
        width='100%'
        height='100%'
        id={id}
        dataSource={mart.data.data}
        sorting={false}
      >
        {mart.data.columns.map((column, i) =>
          <Column
            key={i}
            caption={column.caption}
            dataField={column.name}
            visible={column.visible}
            dataType={column.fieldType === 'MEA' ? 'number' : 'string'}
            cellRender={(e) => cellRender(e, column)}
          />
        )}
      </DevDataGrid>
      {showPopup &&
      <SubLinkReportPopup
        showButton={showPopup}
        setShowButton={setShowPopup}
        focusedItem={focusedItem}
      />}
    </Container>
  );
};

export default React.memo(DataGrid);
