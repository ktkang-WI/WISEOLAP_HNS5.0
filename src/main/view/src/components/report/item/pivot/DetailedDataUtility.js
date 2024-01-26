import models from 'models';

const getParameterInformation = (name, dataset, cubeColumnInfo, value) => {
  return {
    dataType: 'STRING',
    dsId: dataset.dsId,
    dsType: 'CUBE',
    exceptionValue: cubeColumnInfo.physicalTableName + '.' +
       cubeColumnInfo.physicalColumnKey,
    dataSource: cubeColumnInfo.physicalTableName,
    itemCaption: cubeColumnInfo.physicalColumnName != '' ?
        cubeColumnInfo.physicalColumnName :
        cubeColumnInfo.physicalColumnKey, // 리스트에 보여줄 값
    itemKey: cubeColumnInfo.physicalColumnName, // 조회할 때 실제로 쿼리에 들어가는 값
    name: name,
    operation: 'In',
    paramType: 'LIST',
    uniqueName: cubeColumnInfo.logicalColumnName,
    values: [value]
  };
};

const getCubeColumnInfo = async (cubeId, uniqueName) => {
  const cubeInfoParam = {
    cubeId: cubeId,
    userId: 'admin', // 추후 userId 받아서
    uniqueName: uniqueName
  };

  const response = await models.Cube.getCubeInfo(cubeInfoParam);

  return response.data;
};

export default {
  getParameterInformation,
  getCubeColumnInfo
};
