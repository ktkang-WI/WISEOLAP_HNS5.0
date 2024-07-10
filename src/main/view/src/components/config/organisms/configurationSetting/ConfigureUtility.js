// 임시 개발. 추후 변경 가능.
const ConfigureUtility = () => {
  const configTypes = ['menuConfig', 'fontConfig', 'layoutConfig'];
  // 백단에서 받은 data -> JSON으로
  const configStringToJson = (configData) => {
    /*
    configTypes.map((type) => {
      if (configData[type]) {
        configData = {
          ...configData,
          [type]: JSON.parse(configData[type])
        };
      }
    });
    */
    return configData;
  };
  // 프론트 -> 백단 -> string으로
  const configJosnToString = (configData) => {
    configTypes.map((type) => {
      if (configData[type]) {
        configData = {
          ...configData,
          [type]: JSON.stringify(configData[type])
        };
      }
    });

    return configData;
  };

  return {
    configStringToJson,
    configJosnToString
  };
};

export default ConfigureUtility;
