import DevDataGrid,
{Column, Pager, Paging, Scrolling} from 'devextreme-react/data-grid';
import React, {createRef, useEffect} from 'react';
import DataGridBullet from './DataGridBullet';
import {cellMerge, generateRowSpans} from './options/Merge';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {formatNumber, generateLabelSuffix} from
  'components/utils/NumberFormatUtility';
import {getPagingOption} from './Utility';

const DataGrid = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const dataGridRef = createRef();
  const maxValue = {};
  const config = meta.dataGridOption;
  const allowedPageSizes = config.paging.pageUsageOfPageCount.pageSizes;
  const itemExportObject =
    itemExportsObject(id, dataGridRef, 'GRID', mart.data.data);
  let pagingOption = getPagingOption(config);
  let dataSource = _.cloneDeep(mart.data);
  let rowSpans = null;

  if (!mart.init) {
    return <></>;
  }

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

  useEffect(() => {
    handlePagingIndex();
  }, [mart, pagingOption]);

  const handlePagingIndex = () => {
    const dataGridInstance = dataGridRef.current.instance;
    dataGridInstance.pageIndex(pagingOption.pageIndex);
    dataGridInstance.pageSize(pagingOption.pageRange);
  };

  // 페이징 동작 함수
  const handlePaging = (index) => {
    const options = pagingOption;
    const dataLen = dataSource.data.length;
    if (dataLen < index * options.pageRange) {
      index = Math.floor(dataLen / options.pageRange);
    }
    options.pageIndex = index;
    options.start = options.pageIndex === 0 ?
      0 :
      options.pageRange * options.pageIndex;
    options.end = options.pageIndex === 0 ?
      options.pageRange:
      options.pageRange * (options.pageIndex + 1);
    pagingOption = options;
  };

  // 셀 병합로직
  const handleMerge = (e) => {
    const options = pagingOption;
    const isGetRowpan =
      e.rowType === 'data' && e.rowIndex === 0 && e.columnIndex === 0;
    if (isGetRowpan) {
      dataSource = _.cloneDeep(mart.data);
      if (config.paging.pagination.isOk) {
        const data = dataSource.data.slice(options.start, options.end);
        rowSpans =
          _.cloneDeep(generateRowSpans(data, dataSource.columns));
      } else {
        rowSpans =
          _.cloneDeep(generateRowSpans(dataSource.data, dataSource.columns));
      }
    }
    // handlePagingIndex();
    cellMerge(e, rowSpans, mart.data.columns);
  };

  // DataGrid 이벤트
  const onCellPrepared = (e) => {
    if (config.cellMerging) {
      handleMerge(e);
    }
  };

  // DataGrid 이벤트
  const onOptionChanged = (e) => {
    const options = pagingOption;
    const isPaging = config.paging.pagination.isOk;
    const paging = (e.fullName === 'paging.pageIndex' && isPaging);
    const pagingSize = (e.fullName === 'paging.pageSize' && isPaging);
    if (paging) {
      handlePaging(e.value);
    }
    if (pagingSize) {
      options.pageRange = e.value;
      handlePaging(options.pageIndex);
    }
  };

  const getMaxValue = (column) => {
    if (!maxValue[column.name]) {
      maxValue[column.name] =
      Math.max.apply(null, mart.data.data.map((row) => row[column.name]));
    }
    return maxValue[column.name];
  };

  const getColor = (meta, column, index) => {
    let pickedColor = null;
    if (meta.paletteType === 'colorEdit') {
      const palette = meta.colorEdit;
      const pickColor =
        palette.filter((item) => item.fieldId === column.fieldId);
      pickedColor = pickColor[0]?.value;
    } else {
      const palette = meta.palette?.colors;
      pickedColor = palette[index % 6];
    }
    return pickedColor;
  };

  const cellRender = (e, column, meta, index) => {
    let endScaleValue = 0;
    const value = e.data[column.name];

    if (column.detailSetting === 'bar') {
      endScaleValue = getMaxValue(column);

      return <DataGridBullet
        endScaleValue={endScaleValue}
        value={value}
        column={column}
        color={getColor(meta, column, index)}
      />;
    } else if (column.fieldType === 'MEA') {
      const labelSuffix = generateLabelSuffix(column.format);
      e.value = formatNumber(e.value, column.format, labelSuffix);
      return e.value;
    }

    if (value === 0) return '0';

    return value;
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
      showColumnLines={config.gridLine.column}
      showRowLines={config.gridLine.row}
      AllowUserToAddRows={false}
      rowAlternationEnabled={config.gridLine.stripes}
      columnAutoWidth={config.autoGridWidth}
      showColumnHeaders={config.columnHeader}
      wordWrapEnabled={config.autoWrap}
    >
      <Paging
        enabled={config.paging.pagination.isOk}
        defaultPageSize={pagingOption.pageRange} />
      <Pager
        showPageSizeSelector={config.paging.pageUsageOfPageCount.isOk}
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
          dataType={column.fieldType === 'MEA' ? 'number' : 'string'}
          cellRender={(e) => cellRender(e, column, meta, i)}
        />
      )}
    </DevDataGrid>
  );
};

export default React.memo(DataGrid);
