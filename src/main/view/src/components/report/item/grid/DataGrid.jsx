import DevDataGrid,
{Column, Pager, Paging, Scrolling} from 'devextreme-react/data-grid';
import React, {createRef, useEffect} from 'react';
import DataGridBullet from './DataGridBullet';
import {cellMerge, generateRowSpans} from './options/Merge';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';

const DataGrid = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const dataGridRef = createRef();
  const config = {
    gridLine: true,
    barPallete: false, // TODO: 추구개발
    barColorEdit: false, // 구현 X
    merging: true,
    shwHeader: true,
    paging: true,
    autoWrap: false,
    autoGridWidth: false,
    headerAdd: false, // TODO: 추구개발
    writeHeader: false // 구현 X
  };
  const options = {
    pageRange: 20,
    pageIndex: 0,
    start: 0,
    end: 20
  };
  let dataSource = _.cloneDeep(mart.data);
  let rowSpans = null;
  const maxValue = {};

  if (!mart.init) {
    return <></>;
  }

  useEffect(() => {
    const dataGridInstance = dataGridRef.current.instance;
    dataGridInstance.pageIndex(options.pageIndex);
    dataGridInstance.pageSize(options.pageRange);
  }, [mart]);

  const handleMerge = (e) => {
    const isGetRowpan =
      e.rowType === 'data' && e.rowIndex === 0 && e.columnIndex === 0;

    if (isGetRowpan) {
      dataSource = _.cloneDeep(mart.data);
      if (config.paging) {
        const data = dataSource.data.slice(options.start, options.end);
        rowSpans =
          _.cloneDeep(generateRowSpans(data, dataSource.columns));
      } else {
        rowSpans =
          _.cloneDeep(generateRowSpans(dataSource.data, dataSource.columns));
      }
    }
    cellMerge(e, rowSpans, mart.data.columns);
  };

  const handlePaging = (index) => {
    options.pageIndex = index;
    options.start = options.pageIndex === 0 ?
      0 :
      options.pageRange * options.pageIndex;
    options.end = options.pageIndex === 0 ?
      options.pageRange:
      options.pageRange * (options.pageIndex + 1);
  };

  const onCellPrepared = (e) => {
    if (config.merging) {
      handleMerge(e);
    }
  };

  const onOptionChanged = (e) => {
    const paging = (e.fullName === 'paging.pageIndex' && config.paging);
    const pagingSize = (e.fullName === 'paging.pageSize' && config.paging);
    if (paging) {
      handlePaging(e.value);
    }
    if (pagingSize) {
      const dataGridInstance = dataGridRef.current.instance;
      options.pageRange = e.value;
      handlePaging(options.pageIndex);
      dataGridInstance.pageIndex(options.pageIndex);
    }
  };

  const allowedPageSizes = [10, 20, 50];

  const itemExportObject =
   itemExportsObject(id, dataGridRef, 'GRID', mart.data.data);

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
    if (column.detailSetting === 'bar') {
      endScaleValue = getMaxValue(column);

      return <DataGridBullet
        endScaleValue={endScaleValue}
        value={e.value}
        column={column}
      />;
    }
    return e.value;
  };

  return (
    <DevDataGrid
      ref={dataGridRef}
      width='100%'
      height='100%'
      id={id}
      dataSource={dataSource.data}
      sorting={false}
      onCellPrepared={onCellPrepared}
      onOptionChanged={onOptionChanged}
      showColumnLines={config.gridLine}
      showRowLines={config.gridLine}
      AllowUserToAddRows={false}
      rowAlternationEnabled={false}
      columnAutoWidth={config.autoGridWidth}
      showColumnHeaders={config.shwHeader}
      wordWrapEnabled={config.autoWrap}
    >
      <Paging
        enabled={config.paging}
        defaultPageSize={20} />
      <Pager
        showPageSizeSelector={true}
        allowedPageSizes={allowedPageSizes}
        showNavigationButtons={true}
      />
      <Scrolling mode="standard" /> {/* or "virtual" | "infinite" */}
      {dataSource.columns.map((column, i) =>
        <Column
          key={i}
          caption={column.caption}
          dataField={column.name}
          visible={column.visible}
          cellRender={(e) => cellRender(e, column)}
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
