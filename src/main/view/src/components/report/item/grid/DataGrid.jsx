import React, {useEffect, createRef, useState} from 'react';
import DevDataGrid,
{Column, Pager, Paging, Scrolling} from 'devextreme-react/data-grid';
import DataGridBullet from './DataGridBullet';
import {cellMerge, generateRowSpans} from './options/Merge';
import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {SubLinkReportPopup} from 'components/report/util/ReportUtility';
import styled from 'styled-components';
import {selectCurrentDataField} from 'redux/selector/ItemSelector';
import {useSelector} from 'react-redux';
import {formatNumber, generateLabelSuffix} from
  'components/utils/NumberFormatUtility';
import {getPagingOption} from './Utility';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';


const Container = styled.div`
  position: relative;
`;
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
    const dataGridInstance = dataGridRef.current.instance;
    const pageRange = dataGridConfig.pagingOption.pageRange;
    const totalRows = dataGridConfig.dataSource.info.totalRows;
    const lastIndex = Math.floor(totalRows / pageRange);
    let index = 0;
    const id = setInterval(() => {
      if (lastIndex > index) {
        index = index + 1;
      } else {
        index = 0;
      }
      if (config.paging.autoPaging.isOk) dataGridInstance.pageIndex(index);
    }, config.paging.autoPaging.time * 1000);
    return () => clearInterval(id);
  }, [config.paging.autoPaging]);

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
    const dataGridInstance = dataGridRef?.current?.instance;
    if (!dataGridInstance) return;
    const pageSizes = config?.paging?.pageUsageOfPageCount?.pageSizes;
    const pageIndex = dataGridConfig.pagingOption.pageIndex;
    let setPageRange = dataGridConfig.pagingOption.pageRange;
    if (pageSizes.indexOf(setPageRange) === -1) {
      dataGridConfig.pagingOption.pageRange = pageSizes[0];
      handlePaging(pageIndex);
      setPageRange = pageSizes[0];
    }

    dataGridInstance.pageIndex(pageIndex);
    dataGridInstance.pageSize(setPageRange);
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
    cellMerge(e, dataGridConfig.rowSpans, mart.data.columns);
  };

  const onCellPrepared = (e) => {
    if (config.cellMerging) {
      handleMerge(e);
      if (config.paging.pagination.isOk) handlePagingIndex();
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

  const getColor = (meta, column) => {
    const columnFieldId = column.fieldId;
    let pickedColor = null;
    if (meta.paletteType === 'colorEdit') {
      const palette = meta.colorEdit;
      const pickColor =
        palette.filter((item) => item.fieldId === columnFieldId);
      pickedColor = pickColor[0]?.value;
    } else {
      const measures =
        meta.dataField.field.filter((item) => item.type === 'MEA');
      const palette = meta.palette?.colors;
      let colorIndex = 0;
      measures.forEach((item, index) => {
        if (item.fieldId === columnFieldId) colorIndex = index;
      });
      pickedColor = palette[colorIndex % 6];
    }
    return pickedColor;
  };

  const cellRender = (e, column, meta) => {
    let endScaleValue = 0;
    const value = e.data[column.name] ? e.data[column.name] : 0;
    const displayValue = e.displayValue ? e.displayValue : 0;

    if (column.detailSetting === 'bar') {
      const labelSuffix = generateLabelSuffix(column.format);
      const label = formatNumber(displayValue, column.format, labelSuffix);
      endScaleValue = getMaxValue(column);

      return (
        <Wrapper display="flex" style={{position: 'relative'}}>
          <DataGridBullet
            endScaleValue={endScaleValue}
            value={value ? value : 0}
            column={column}
            color={getColor(meta, column)}
            displayValue={displayValue}
          />
          <div style={{position: 'absolute', right: '1%'}}>
            {label}
          </div>
        </Wrapper>
      );
    } else if (column.fieldType === 'MEA') {
      const labelSuffix = generateLabelSuffix(column.format);
      e.value = formatNumber(displayValue, column.format, labelSuffix);
      return e.value;
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
        ref={dataGridRef}
        width='100%'
        height='100%'
        id={id}
        dataSource={dataGridConfig.dataSource.data}
        showBorders={true}
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
          displayMode={'full'}
          enabled={config.paging.pageUsageOfPageCount.isOk}
          showPageSizeSelector={config.paging.pageUsageOfPageCount.isOk}
          allowedPageSizes={allowedPageSizes}
        />
        <Scrolling mode="standard" /> {/* or "virtual" | "infinite" */}
        {dataGridConfig.dataSource.columns.map((column, i) =>
          <Column
            key={i}
            caption={column.caption}
            dataField={column.name}
            visible={column.visible}
            dataType={column.fieldType === 'MEA' ? 'number' : 'string'}
            cellRender={(e) => cellRender(e, column, meta)}
            width={column.detailSetting === 'bar' ? '500px' : undefined}
          />
        )}
      </DevDataGrid>
    </Container>
  );
};

export default React.memo(DataGrid);
