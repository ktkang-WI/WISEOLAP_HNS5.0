import axios from 'axios';
import ParamUtils from 'components/dataset/utils/ParamUtils';

const path = '/dataset';

export const getSingleTableQuery = (dsId, columnList, parameters) => {
  const parameter = ParamUtils.generateParameterForQueryExecute(parameters);

  return axios.post(path + '/query-single-datas', {
    dsId: parseInt(dsId),
    columnList: JSON.stringify(columnList),
    parameter: JSON.stringify(parameter)
  });
};
