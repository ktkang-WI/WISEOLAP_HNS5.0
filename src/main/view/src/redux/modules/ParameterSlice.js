import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  0: {
    informations: [],
    values: {},
    filterSearchComplete: []
  }
};

const reducers = {
  // 파라미터로 reportId, informations
  setParameterInformation(state, actions) {
    const reportId = actions.payload.reportId;
    const informations = actions.payload.informations;

    if (state[reportId] === undefined) state[reportId] = {};

    state[reportId].informations = informations;
    state[reportId].values = {};
    state[reportId].filterSearchComplete = [];
  },
  // 파라미터로 reportId, informations, datasetId
  updateParameterInformation(state, actions) {
    const reportId = actions.payload.reportId;
    const informations = actions.payload.informations;
    const datasetId = actions.payload.datasetId;

    // 기존에 파라미터로 넘어온 datasetId를 가지고 있던 필터 정보 삭제
    state[reportId].informations = state[reportId].informations
        .reduce((acc, info) => {
          const datasetArr = info.dataset;
          const idx = datasetArr.indexOf(datasetId);

          if (idx >= 0) {
            if (datasetArr.length > 1) {
              datasetArr.splice(idx, 1);
              acc.push({...info, dataset: datasetArr});
            }
          } else {
            acc.push(info);
          }

          return acc;
        }, []);

    // 필터 정보 업데이트 & push
    informations.map((info) => {
      const org = state[reportId].informations
          .findIndex((i) => i.name == info.name);
      if (org >= 0) {
        state[reportId].informations[org] = info;
      } else {
        state[reportId].informations.push(info);
      }
    });

    state[reportId].informations.sort((a, b) => a.order - b.order);
    state[reportId].values = {};
    state[reportId].filterSearchComplete = [];
  },
  // 파라미터로 reportId, values
  setParameterValues(state, actions) {
    const reportId = actions.payload.reportId;
    const values = actions.payload.values;
    state[reportId].values = Object.assign(state[reportId].values, values);
  },
  initParameter: () => initialState,
  filterSearchComplete(state, actions) {
    const reportId = actions.payload.reportId;
    const filterId = actions.payload.id;
    state[reportId].filterSearchComplete =
        state[reportId].filterSearchComplete.concat([filterId]);
  },
  deleteParameterByDatsetId(state, actions) {
    const reportId = actions.payload.reportId;
    const datasetId = actions.payload.datasetId;

    state[reportId].informations = state[reportId].informations
        .reduce((acc, info) => {
          const datasetArr = info.dataset;
          const idx = datasetArr.indexOf(datasetId);

          if (idx >= 0) {
            if (datasetArr.length > 1) {
              datasetArr.splice(idx, 1);
              acc.push({...info, dataset: datasetArr});
            }
          } else {
            acc.push(info);
          }

          return acc;
        }, []);
  },
  changeParameterReportId(state, actions) {
    const prevId = actions.payload.prevId;
    const newId = actions.payload.newId;

    if (prevId != newId) {
      const parameter = state[prevId];
      delete state[prevId];
      state[newId] = parameter;
    }
  },
  deleteParameterForDesigner(state, actions) {
    delete state[actions.payload];

    if (Object.keys(state).length == 0) {
      state[0] = initialState[0];
    }
  }
};

const extraReducers = {};

const ParameterSlice = createSlice({
  name: 'Parameter',
  initialState: initialState,
  reducers: reducers,
  extraReducers: extraReducers
});

export default ParameterSlice;
