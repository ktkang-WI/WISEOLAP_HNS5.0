import {createAction} from '@reduxjs/toolkit';
import {
  ExceptionCheck,
  MeasuresUpdateNullCheck,
  ReportIdNullCheck,
  SeriesOptionFetchNullCheck,
  SeriesOptionInitNullCheck} from './handlerException';
import {
  getSeriesOptionDefaultFormat,
  getSeriesOptionGeneralFormat,
  getSeriesOptionPointLabelFormat} from './SeriesOptionFormat';
import _ from 'lodash';

// Create Actions
const seriesOptionFetch = createAction('Item/SERIES_OPTION_FETCH');
const seriesOptionInit = createAction('Item/SERIES_OPTION_INITIAL');
// 임시용 redux
const measuresFetch = createAction('Item/MEASURES_FETCH');

const getItemIndex = (state, reportId) => {
  return state[reportId].items.findIndex(
      (item) => item.id == state[reportId].selectedItemId
  );
};

const isThisAdhoc = (state, reportId) => {
  let isok = false;
  if (state[reportId].adHocOption) isok = true;
  return isok;
};

const getFieldIdFromMeasure = (state, reportId) => {
  const measures = getDataFieldType(state, reportId).measure;
  const range1 = getDataFieldType(state, reportId).range1;
  const fieldIds = [];
  if (measures != undefined) {
    measures.forEach((item) => {
      fieldIds.push(item.fieldId);
    });
  }
  if (range1 != undefined) {
    range1.forEach((item) => {
      fieldIds.push(item.fieldId);
    });
  }
  return fieldIds;
};

// TODO: Item Slice 로 옮겨야 할거 같다.?
const getDataFieldType = (state, reportId) => {
  const itemIndex = getItemIndex(state, reportId);
  // TODO: 긴급 소스수정 추후 수정

  let dataField = null;

  if (isThisAdhoc(state, reportId)) {
    dataField = state[reportId].adHocOption.dataField;
  } else {
    dataField = state[reportId].items[itemIndex].meta.dataField;
  }
  return dataField;
};

const getItemType = (state, reportId) => {
  const itemIndex = getItemIndex(state, reportId);
  const seriesOptionDefaultFormat = getSeriesOptionDefaultFormat();
  let itemMeta = seriesOptionDefaultFormat.type;
  const item = state[reportId];
  if (!item?.items[itemIndex]?.meta?.seriesType) return itemMeta;

  if (isThisAdhoc(state, reportId)) {
    return itemMeta;
  } else {
    itemMeta = state[reportId].items[itemIndex].meta.seriesType;
  }
  return itemMeta;
};

// 임시용 redux
const getItems = (state, reportId) => {
  return state[reportId].items;
};

const getItem = (state, reportId) => {
  return state[reportId];
};

// Create Selectors for in slice
const getSeriesOptions = (state, reportId) => {
  let result = null;
  try {
    ExceptionCheck[ReportIdNullCheck](reportId);
    result = getDataFieldType(state, reportId);

    if (!result.seriesOptions) {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
  return _.cloneDeep(result.seriesOptions);
};


// remove data by comparing it with measured values.
export const removedSeriesOptions = (state, reportId, fetchFieldId) => {
  const fieldIds = getFieldIdFromMeasure(state, reportId);
  const seriesOptions = getSeriesOptions(state, reportId);
  const seriesFieldIds = seriesOptions.map((item) => item.fieldId);
  const removeIndexs = [];

  if (seriesOptions.length == 0) return seriesOptions;

  seriesFieldIds.forEach((fieldId) => {
    if (fieldId === fetchFieldId) {
      removeIndexs.push(seriesFieldIds.indexOf(fetchFieldId));
    }
    if (!fieldIds.includes(fieldId)) {
      removeIndexs.push(seriesFieldIds.indexOf(fieldId));
    }
  });

  removeIndexs.forEach((i, index) => seriesOptions.splice((i - index), 1));

  return seriesOptions;
};

const generatePointLabel =
   (Notation, direction, overlayMode) => {
     const tempPointLabel = getSeriesOptionPointLabelFormat();
     tempPointLabel.Notation = Notation;
     tempPointLabel.direction = direction;
     tempPointLabel.overlayMode = overlayMode;
     return tempPointLabel;
   };

const generateGeneralOption =
   (auxiliaryAxis, ignoreEmptyPoints, pointerMarker, reverseView) => {
     const tempGeneral = getSeriesOptionGeneralFormat();
     tempGeneral.auxiliaryAxis = auxiliaryAxis;
     tempGeneral.ignoreEmptyPoints = ignoreEmptyPoints;
     tempGeneral.pointerMarker = pointerMarker;
     tempGeneral.reverseView = reverseView;
     return tempGeneral;
   };

const seriesOptionsSynchronization = (
    dataField,
    tempSeriesOption,
    tempPointGeneralOption) => {
  dataField.seriesOptions.push(tempSeriesOption);
  if (!tempPointGeneralOption) return;

  // 필드 데이터 공용 동기화
  dataField.seriesOptions.forEach((item) => {
    item.pointLabel =
      generatePointLabel(
          item.pointLabel.Notation,
          item.pointLabel.direction,
          tempPointGeneralOption.pointLabel.overlayMode);
    item.general =
      generateGeneralOption(
          item.general.auxiliaryAxis,
          tempPointGeneralOption.general.ignoreEmptyPoints,
          tempPointGeneralOption.general.pointerMarker,
          tempPointGeneralOption.general.reverseView);
  });
};
const getMeasures = (item) => {
  let measures = null;
  if (!item.meta) return null;
  if (!item.meta.dataField) return null;
  if (item.type === 'grid') {
    measures =
    item.meta.dataField.field.filter((field) => field.fieldType === 'MEA');
  } else {
    measures =
    item.meta.dataField.measure;
  };
  return measures;
};

const getAdHocMeasures = (item) => {
  let measures = null;
  if (!item.adHocOption) return null;
  if (!item.adHocOption.dataField) return null;
  const dataField = item.adHocOption.dataField;
  measures = dataField.measure;
  return measures;
};

const updateMeasuresInfo = (measures, customDatas) => {
  if (!measures) return;
  if (!customDatas) return;
  measures.forEach((measure) => {
    customDatas.forEach((customData) => {
      if (measure.uniqueName === customData.uniqueName) {
        measure.expression = customData.expression;
      }
    });
  });
};

const updateMeasureInfoAdhocProcess = (state, reportId, customDatas) => {
  const item = getItem(state, reportId);
  const measures = getAdHocMeasures(item);
  if (measures) updateMeasuresInfo(measures, customDatas);
};

const updateMeasureInfoProcess = (state, reportId, customDatas) => {
  const items = getItems(state, reportId);
  if (!customDatas) return;
  if (!items) return;

  items.forEach((item) => {
    const measures = getMeasures(item);
    if (measures) updateMeasuresInfo(measures, customDatas);
  });
};

// Create Reducers
const seriesOptionSlice = (builder) => {
  // 임시용 코드
  builder.addCase(measuresFetch, (state, action) => {
    // STEP1 This would be send fields
    try {
      ExceptionCheck[MeasuresUpdateNullCheck](action.payload);
      const customDatas = action.payload.customDatas;
      const reportId = action.payload.reportId;

      if (isThisAdhoc(state, reportId)) {
        updateMeasureInfoAdhocProcess(state, reportId, customDatas);
      } else {
        updateMeasureInfoProcess(state, reportId, customDatas);
      }
    } catch (error) {
      console.log(error);
    }
  });
  builder.addCase(seriesOptionInit, (state, action) => {
    try {
      ExceptionCheck[SeriesOptionInitNullCheck](action.payload);

      const fieldId = action.payload.fieldId;
      const reportId = action.payload.reportId;
      const itemType = getItemType(state, reportId);
      const dataField = getDataFieldType(state, reportId);
      const tempSeriesOption = getSeriesOptionDefaultFormat();

      tempSeriesOption.fieldId = fieldId;
      tempSeriesOption.type = itemType;
      dataField.seriesOptions = removedSeriesOptions(state, reportId, fieldId);

      (dataField.seriesOptions.length > 1) ?
       seriesOptionsSynchronization(
           dataField,
           tempSeriesOption,
           dataField.seriesOptions[0]) :
       seriesOptionsSynchronization(
           dataField,
           tempSeriesOption,
           null);
    } catch (error) {
      console.log(error);
    }
  });
  builder.addCase(seriesOptionFetch, (state, action) => {
    try {
      ExceptionCheck[SeriesOptionFetchNullCheck](action.payload);

      const fieldId = action.payload.fieldId;
      const reportId = action.payload.reportId;
      const dataField = getDataFieldType(state, reportId);
      const seriesOptions = action.payload.seriesOptions;
      const tempSeriesOption = getSeriesOptionDefaultFormat();

      tempSeriesOption.fieldId = fieldId;
      tempSeriesOption.type = seriesOptions.type;
      tempSeriesOption.general = seriesOptions.general;
      tempSeriesOption.pointLabel = seriesOptions.pointLabel;

      dataField.seriesOptions = removedSeriesOptions(state, reportId, fieldId);

      seriesOptionsSynchronization(
          dataField,
          tempSeriesOption,
          tempSeriesOption);
    } catch (error) {
      console.log(error);
    }
  });
};

// export Selectors
export {
  getSeriesOptions
};

// export Actions
export {
  seriesOptionInit,
  seriesOptionFetch,
  measuresFetch
};

export default seriesOptionSlice;
