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
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const DataGrid = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const dataGridRef = createRef();
  const maxValue = {};
  const config = meta.dataGridOption;
  const allowedPageSizes = config.paging.pageUsageOfPageCount.pageSizes;
  const itemExportObject =
    itemExportsObject(id, dataGridRef, 'GRID', mart.data.data);
  const dataGridConfig = {
    pagingOption: getPagingOption(config),
    dataSource: _.cloneDeep(mart.data),
    rowSpans: null
  };

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
  }, [mart, dataGridConfig.pagingOption]);

  const handlePagingIndex = () => {
    const dataGridInstance = dataGridRef.current.instance;
    dataGridInstance.pageIndex(dataGridConfig.pagingOption.pageIndex);
    dataGridInstance.pageSize(dataGridConfig.pagingOption.pageRange);
  };

  const handlePaging = (index) => {
    const options = dataGridConfig.pagingOption;
    const dataLen = dataGridConfig.dataSource.data.length;
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
    dataGridConfig.pagingOption = options;
  };

  const handleMerge = (e) => {
    const options = dataGridConfig.pagingOption;
    const isGetRowpan =
      e.rowType === 'data' && e.rowIndex === 0 && e.columnIndex === 0;
    if (isGetRowpan) {
      dataGridConfig.dataSource = _.cloneDeep(mart.data);
      const data = dataGridConfig.dataSource.data;
      const columns = dataGridConfig.dataSource.columns;
      if (config.paging.pagination.isOk) {
        const pagedData = data.slice(options.start, options.end);
        dataGridConfig.rowSpans =
          _.cloneDeep(generateRowSpans(pagedData, columns));
      } else {
        dataGridConfig.rowSpans =
          _.cloneDeep(generateRowSpans(data, columns));
      }
    }
    // handlePagingIndex();
    cellMerge(e, dataGridConfig.rowSpans, mart.data.columns);
  };

  const onCellPrepared = (e) => {
    if (config.cellMerging) {
      handleMerge(e);
    }
  };

  const onOptionChanged = (e) => {
    const options = dataGridConfig.pagingOption;
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
      const labelSuffix = generateLabelSuffix(column.format);
      const label = formatNumber(e.displayValue, column.format, labelSuffix);
      endScaleValue = getMaxValue(column);

      return (
        <Wrapper display="flex">
          <DataGridBullet
            endScaleValue={endScaleValue}
            value={value}
            column={column}
            displayValue={e.displayValue}
            color={getColor(meta, column, index)}
          />
          <span>{label}</span>
        </Wrapper>
      );
    } else if (column.fieldType === 'MEA') {
      const labelSuffix = generateLabelSuffix(column.format);
      e.value = formatNumber(e.displayValue, column.format, labelSuffix);
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
      dataSource={dataGridConfig.dataSource.data}
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
        defaultPageSize={dataGridConfig.pagingOption.pageRange} />
      <Pager
        showPageSizeSelector={config.paging.pageUsageOfPageCount.isOk}
        allowedPageSizes={allowedPageSizes}
        showNavigationButtons={true}
      />
      <Scrolling mode="standard" /> {/* or "virtual" | "infinite" */}
      {dataGridConfig.dataSource.columns.map((column, i) =>
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
