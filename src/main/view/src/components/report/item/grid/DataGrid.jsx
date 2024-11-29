import React,
{
  useEffect,
  createRef,
  useRef
} from 'react';
import DevDataGrid,
{
  Column,
  LoadPanel,
  Pager,
  Paging,
  Scrolling,
  Selection,
  HeaderFilter,
  Sorting,
  Search
} from 'devextreme-react/data-grid';
import DataGridBullet from './DataGridBullet';
import {cellMerge, generateRowSpans} from './options/Merge';
import {formatNumber, generateLabelSuffix} from
  'components/utils/NumberFormatUtility';
import {getPagingOption} from './Utility';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useContextMenu from 'hooks/useContextMenu';
import ItemType from '../util/ItemType';
import useItemExport from 'hooks/useItemExport';
import useItemSetting from '../util/hook/useItemSetting';
import {useDispatch} from 'react-redux';
import {useSelector} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {debounce} from 'lodash';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const DataGrid = ({setItemExports, id, item}) => {
  const {getContextMenuItems} = useContextMenu(item);
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const dataGridRef = createRef();
  const maxValue = {};
  const config = meta.dataGridOption;
  const dispatch = useDispatch();
  const reportId = useSelector(selectCurrentReportId);
  const {updateItem} = ItemSlice.actions;

  const interactiveOption = meta.interactiveOption || {};

  const clearRef = useRef(false);

  const {filterTools} = useItemSetting(
      item,
      null,
      [],
      false,
      {
        selectedItemType: 'REF',
        clearSelection: () => {
          const selection =
            dataGridRef?.current?.instance?.getSelectedRowsData();
          if (selection && selection.length > 0) {
            clearRef.current = true;
          }

          dataGridRef?.current?.instance?.clearSelection();
        }
      });


  // 데이터 그리드 다운로드 순서 이슈
  // mart data 생성 시 필드 순서대로 만들어지지 않음.
  // 필드(columns) 순서에 맞게 새로운 mart data 재생성
  const cloneData = _.cloneDeep(mart.data);
  const columnNames = mart.data.columns.map((col) => col.name);
  const sortedMartData = cloneData.data.map((item) => {
    return columnNames.reduce((acc, column) => {
      if (item.hasOwnProperty(column)) {
        acc[column] = item[column]; // column 순서에 맞게 새로운 객체 생성
      }
      return acc;
    }, {});
  });

  cloneData.data = sortedMartData;

  useItemExport({
    id,
    ref: dataGridRef,
    type: ItemType.DATA_GRID,
    data: cloneData?.data,
    setItemExports});

  const dataGridConfig = {
    pagingOption: getPagingOption(config),
    dataSource: cloneData,
    rowSpans: null
  };

  const generatePageSizes = () => {
    const dataSize = mart?.data?.data?.length;
    const pageSizes = config?.paging?.pageUsageOfPageCount?.pageSizes;
    if (!pageSizes || !dataSize) throw Error();
    return [...new Set(pageSizes.map((pageSize) =>
      pageSize))];
  };

  const handleColumnsChanging = debounce((e) => {
    if (!config.autoGridWidth) {
      const columnWidth = e.component.getVisibleColumns().map((c) => c.width);
      const newItem = {...item, meta: {...item.meta, columnWidth}};

      if (item.meta.columnWidth &&
        _.isEqual(item.meta.columnWidth, columnWidth)) {
        return;
      }

      dispatch(updateItem({reportId, item: newItem}));
    }
  }, 300);

  const handlePagingIndex = () => {
    const dataGridInstance = dataGridRef?.current?.instance;
    if (!dataGridInstance) return;
    const pageSizes = generatePageSizes();
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

  useEffect(() => {
    const dataGridInstance = dataGridRef?.current?.instance;

    if (!dataGridInstance) return;

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
    handlePagingIndex();
  }, [mart, dataGridConfig.pagingOption]);

  if (!mart.init) {
    return <></>;
  }

  const onCellPrepared = (e) => {
    if (config.cellMerging) {
      handleMerge(e);
      if (config.paging.pagination.isOk) handlePagingIndex();
    }
  };

  const onSelectionChanged = (e) => {
    if (clearRef.current) {
      clearRef.current = false;
      return;
    }
    const keys = e.currentDeselectedRowKeys
        .concat(e.currentSelectedRowKeys).map((key) => {
          const d = [];
          dataGridConfig.dataSource.columns.map((col) => {
            if (col.type == 'DIM') {
              d.push(key[col.name]);
            }
          });

          return d.join(' - ');
        });

    filterTools.setMasterFilterData(keys);
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
    // eslint-disable-next-line max-len
    const value = ((e.data[column.name] === null) || (e.data[column.name] === '')) ?
      null : e.data[column.name] || 0;
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
    } else if (column.type === 'MEA') {
      const labelSuffix = generateLabelSuffix(column.format);
      e.value = formatNumber(displayValue, column.format, labelSuffix);
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
      showBorders={true}
      onCellPrepared={onCellPrepared}
      onOptionChanged={onOptionChanged}
      showColumnLines={config.gridLine.column}
      showRowLines={config.gridLine.row}
      AllowUserToAddRows={false}
      rowAlternationEnabled={config.gridLine.stripes}
      columnResizingMode={'nextColumn'}
      allowColumnResizing={!config.autoGridWidth}
      columnAutoWidth={config.autoGridWidth}
      showColumnHeaders={config.columnHeader}
      wordWrapEnabled={config.autoWrap}
      onSelectionChanged={onSelectionChanged}
      onColumnsChanging={handleColumnsChanging}
      onContextMenuPreparing={(e) => {
        if (!e.cell || e.cell.columnType === undefined ||
          e.cell.rowType === undefined) {
          return;
        }
        const contextMenu = getContextMenuItems();
        e.items = e.items.concat(contextMenu);
      }}
    >
      <HeaderFilter visible={true}>
        <Search enabled={true} />
      </HeaderFilter>
      <Sorting mode="multiple" />
      <Selection
        mode={(interactiveOption.enabled && interactiveOption.mode) || 'none'}
        showCheckBoxesMode='none'
        selectByClick={false}
      />
      <LoadPanel enabled />
      <Paging
        enabled={config.paging.pagination.isOk}
        defaultPageSize={dataGridConfig.pagingOption.pageRange} />
      <Pager
        displayMode={'full'}
        enabled={config.paging.pageUsageOfPageCount.isOk}
        showPageSizeSelector={config.paging.pageUsageOfPageCount.isOk}
        allowedPageSizes={generatePageSizes()}
      />
      <Scrolling mode={config.paging.pagination.isOk ?
        'standard':'virtual'} /> {/* or "virtual" | "infinite" */}
      {dataGridConfig.dataSource.columns.map((column, i) => {
        let columnWidth = column.detailSetting === 'bar' ? '500px' : undefined;

        if (!config.autoGridWidth && meta.columnWidth) {
          if (meta.columnWidth.length ==
            dataGridConfig.dataSource.columns.length) {
            columnWidth = meta.columnWidth[i];
          }
        }

        return <Column
          key={i}
          caption={column.caption}
          dataField={column.name}
          visible={column.visible}
          dataType={column.type === 'MEA' ? 'number' : 'string'}
          cellRender={(e) => cellRender(e, column, meta)}
          width={columnWidth}
        />;
      }
      )}
    </DevDataGrid>
  );
};

const propsComparator = (prev, next) => {
  const prevItem = {
    ...prev.item,
    meta: {
      ...prev.item.meta,
      columnWidth: null
    }
  };

  const nextItem = {
    ...next.item,
    meta: {
      ...next.item.meta,
      columnWidth: null
    }
  };
  const result = _.isEqual(prevItem, nextItem);

  return result;
};

export default React.memo(DataGrid, propsComparator);
