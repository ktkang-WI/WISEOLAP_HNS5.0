import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    selectedDatasetId: '',
    datasetQuantity: 0,
    datasets: []
  }
};

const reducers = {
  /* REPORT */
  initDatasets: (state, actions) => initialState,
  insertDataset(state, actions) {
    const reportId = actions.payload.reportId;
    if (!state[reportId]) {
      state[reportId] = {
        selectedDatasetId: '',
        datasetQuantity: 0,
        datasets: []
      };
    }

    state[reportId].datasetQuantity++;

    state[reportId].datasets =
      state[reportId].datasets.concat(actions.payload.dataset);
    state[reportId].selectedDatasetId = dataset.datasetId;
  },
  // 파라미터로 reportId와 dataset
  updateDataset(state, actions) {
    const reportId = actions.payload.reportId;
    const dataset = actions.payload.dataset;

    const datasetIndex = state[reportId].datasets.findIndex(
        (ds) => ds.datasetId == dataset.datasetId
    );

    if (datasetIndex >= 0) {
      state[reportId].datasets[datasetIndex] = dataset;
    } else {
      state[reportId].datasets =
        state[reportId].datasets.concat(dataset);
      state[reportId].datasetQuantity++;
    }

    state[reportId].selectedDatasetId = dataset.datasetId;
  },
  // 파라미터로 reportId와 datsetId
  deleteDataset(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;

    state[reportId].datasets = state[reportId].datasets.filter(
        (ds) => ds.datasetId != datasetId
    );
    state[reportId].selectedDatasetId =
      state[reportId]?.datasets[0]?.datasetId || '';
  },
  // 파라미터로 reportId
  deleteAllDatasets(state, actions) {
    const reportId = actions.payload.reportId;

    state[reportId].datasets = [];
  },
  deleteReportDataset(state, actions) {
    const {reportId} = actions.payload;

    delete state[reportId];
  },
  selectDataset(state, actions) {
    const reportId = actions.payload.reportId;
    if (state[reportId]) {
      state[reportId].selectedDatasetId = actions.payload.datasetId;
    };
  },
  setDataset(state, actions) {
    const reportId = actions.payload.reportId;
    state[reportId] = actions.payload.dataset;
  },
  changeDatasetReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const dataset = state[prevId];
      delete state[prevId];
      state[newId] = dataset;
    }
  },
  deleteDatasetForDesigner(state, actions) {
    delete state[actions.payload];

    if (Object.keys(state).length == 0) {
      state[0] = initialState[0];
    }
  },
  changeDataset(state, actions) {
    const prevId = actions.payload.reportId.prevId;
    const newId = actions.payload.reportId.newId;
    delete state[prevId];
    state[newId] = actions.payload.dataset;
  },
  datasetAppliedFields(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;
    const uniqueName = actions.payload.uniqueName;

    const datasetIndex = state[reportId].datasets.findIndex(
        (ds) => ds.datasetId == datasetId
    );

    const selectedFieldsIdx =
      state[reportId].datasets[datasetIndex].selectedFields.findIndex(
          (field) => field.uniNm == uniqueName
      );

    if (datasetIndex >= 0) {
      if (selectedFieldsIdx >= 0) {
        state[reportId].datasets[datasetIndex]
            .selectedFields[selectedFieldsIdx] =
          {uniNm: uniqueName, check: true};
      }
    }
  },
  viewerPostingUpdate(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;
    const fields = actions.payload.fields;

    const datasetIndex = state[reportId].datasets.findIndex(
        (ds) => ds.datasetId == datasetId
    );

    if (datasetIndex >= 0) {
      state[reportId].datasets[datasetIndex].selectedFields = fields;
    }
  }
};

const extraReducers = {};

const DatasetSlice = createSlice({
  name: 'Dataset',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default DatasetSlice;
