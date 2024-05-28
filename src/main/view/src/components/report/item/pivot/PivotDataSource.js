
const {getPivotData} = require('models/' +
  'report/Item');

const fieldsTakenJson = (fields) => {
  const takeJson = {};
  fields.map((_fieds, _fieldsIndex) => {
    switch (_fieds.area) {
      case 'row':
        takeJson[_fieds.dataField] = 'text';
        break;
      case 'column':
        takeJson[_fieds.dataField] = 'text';
        break;
      case 'data':
        takeJson[_fieds.dataField] = 123;
        break;
      default:
        takeJson[_fieds.dataField] = 'text';
        break;
    }
  });
  return takeJson;
};
const rowColOptionObj = {
  maxColLength: 0,
  maxRowLength: 0,
  curColLength: 0,
  curRowLength: 0
};

const calcRowColMaxLen = (fields, rowColOption) => {
  fields.forEach((field, i) => {
    // if (field.visible) {
    switch (field.area) {
      case 'row': rowColOption.maxRowLength++; break;
      case 'column': rowColOption.maxColLength++; break;
    }
    // }
  });
};
const loadOptionSetting = (dataField, loadOptions, rowColOption) => {
  const rowNames = new Set(dataField.row.map((row) => row.name));
  try {
    for (let i = 0; i < loadOptions.group.length; i++) {
      const isColumn = rowNames.has(loadOptions.group[i].selector);
      if (isColumn) {
        loadOptions.group[i].area = 'col';
        loadOptions.group[i].index = rowColOption.curColLength;
        rowColOption.curColLength++;
      } else {
        loadOptions.group[i].area = 'row';
        loadOptions.group[i].index = rowColOption.curRowLength;
        rowColOption.curRowLength++;
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
const calcTotal = (loadOptions, matrixInfo, data) => {
  try {
    if (loadOptions.totalSummary.length > 0) {
      const vs = matrixInfo.matrix.cells[0][0].vs;
      for (let i = 0; i < vs.length; i++) {
        data.summary.push(vs[i].s);
      }
    }
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};

const makeTreeData = (
    arr,
    curColDepth,
    maxColDepth,
    curRowDepth,
    maxRowDepth,
    parentKey,
    rowIdx
) => {
  const cells = matrixInfo.matrix.cells;
  const meta = matrixInfo.matrix;

  if (curRowDepth <= maxRowDepth) {
    meta.rowFlattendSummaryDimensions.map((dim, i) => {
      if (dim.depth == curRowDepth &&
          (dim.path.split('~|_').indexOf(parentKey) > -1 ||
          !parentKey)) {
        let items = [];
        const summary = [];
        if (curRowDepth < maxRowDepth || maxRowDepth > 0) {
          makeTreeData(items, curColDepth, maxColDepth,
              curRowDepth + 1, maxRowDepth, dim.key, i);
        }
        if (items.length == 0) {
          items = null;
        }

        cells[i][0].vs.map((cell, j) => {
          summary.push(cell.s || cell.v || cell.c);
        });

        arr.push({
          key: dim.key, summary: summary, items: items
        });
      }
    });
  } else if (curColDepth <= maxColDepth) {
    meta.colFlattendSummaryDimensions.map((dim, i) => {
      if (dim.depth == curColDepth &&
          (dim.path.split('~|_').indexOf(parentKey) > -1 ||
          !parentKey || curColDepth == 1)) {
        let items = [];
        const summary = [];
        if (curColDepth < maxColDepth) {
          makeTreeData(items, curColDepth + 1, maxColDepth,
              curRowDepth, maxRowDepth, dim.key, rowIdx);
        }
        if (items.length == 0) {
          items = null;
        }

        cells[rowIdx][i].vs.map((cell, j) => {
          summary.push(cell.s || cell.v || cell.c);
        });

        arr.push({
          key: dim.key, summary: summary, items: items
        });
      }
    });
  }
};

const calcGroupData = (loadOptions, rowColOption) => {
  if (!loadOptions?.group) return;
  try {
    const tempData = [];

    makeTreeData(
        tempData,
        1,
        rowColOption.curColLength,
        1,
        rowColOption.curRowLength,
        null,
        0);

    data.data = tempData;
  } catch (error) {
    console.error(error);
    return false;
  }
  return true;
};
const makeDataByMatrix = ({
  dataField, loadOptions, rowColOption, matrixInfo}) => {
  const data = {summary: [], data: []};

  if (!loadOptionSetting(dataField, loadOptions, rowColOption)) {
    throw Error('While setting the option, an error is occurring.');
  };

  if (!calcTotal(loadOptions, matrixInfo, data)) {
    throw Error('While setting the data of total, an error is occurring.');
  };

  if (!calcGroupData(loadOptions, rowColOption)) {
    throw Error('While setting the data of group, an error is occurring.');
  }

  return data;
};

const generateParameter = (loadOptions) => {
  return {
    // Pass if the remoteOperations option is set to true
    take: loadOptions.take,
    skip: loadOptions.skip,
    group: loadOptions.group ?
      JSON.stringify(loadOptions.group) : '',
    filter: loadOptions.filter ?
      JSON.stringify(loadOptions.filter) : '',
    totalSummary: loadOptions.totalSummary ?
      JSON.stringify(loadOptions.totalSummary) : '',
    groupSummary: loadOptions.groupSummary ?
      JSON.stringify(loadOptions.groupSummary) : '',
    udfGroups: JSON.stringify([]),
    // topBottom: JSON.stringify({}),
    ...param
  };
};

const generateByPivotData = async ({
  dataField,
  matrixInfo = null,
  loadOptions,
  rowColOption
}) => {
  const parameter = generateParameter(loadOptions);
  const result = await getPivotData(parameter);

  matrixInfo = result.data;

  const tempResult = makeDataByMatrix({
    dataField: dataField,
    matrixInfo: matrixInfo,
    loadOptions: loadOptions,
    rowColOption: rowColOption
  });
  resolve(tempResult);
};

const generateByMatrix = ({
  dataField,
  matrixInfo = null,
  loadOptions,
  rowColOption
}) => {
  const matrixLoadWaitFunc = setInterval(function() {
    if (matrixInfo) {
      try {
        const result = makeDataByMatrix({
          dataField: dataField,
          matrixInfo: matrixInfo,
          loadOptions: loadOptions,
          rowColOption: rowColOption
        });
        resolve(result);
        clearInterval(matrixLoadWaitFunc);
      } catch (e) {
        clearInterval(matrixLoadWaitFunc);
      }
    }
  }, 100);
};

const handleDataSourceConfig = async ({
  dataField,
  loadOptions,
  resolve,
  reject}) => {
  const matrixInfo = null;
  if (loadOptions.take == 20) {
    resolve([fieldsTakenJson(fields)]);
  }
  if (!loadOptions.group) return;
  const rowColOption = _.cloneDeep(rowColOptionObj);
  calcRowColMaxLen(fields, rowColOption);

  const isThisPivot = loadOptions.group.length ==
    rowColOption.maxRowLength + rowColOption.maxColLength;

  if (isThisPivot) {
    generateByPivotData({
      dataField: dataField,
      matrixInfo: matrixInfo,
      loadOptions: loadOptions,
      rowColOption: rowColOption
    });
  } else {
    generateByMatrix({
      dataField: dataField,
      matrixInfo: matrixInfo,
      loadOptions: loadOptions,
      rowColOption: rowColOption
    });
  }
};


export default handleDataSourceConfig;
