import {selectCurrentInformationas} from 'redux/selector/ParameterSelector';
import store from 'redux/modules';

export const processLinkParamData = (data, setParamInfo, setFkNmOptions) => {
  let transformedData;
  if (data.informations) {
    const parsedData = JSON.parse(data.informations);
    const linkReportId = data.reports[0].reportId;
    const CurrentItemParam = selectCurrentInformationas(store.getState());
    transformedData = parsedData.map((item, index) => {
      const currentItem = CurrentItemParam[index];
      return {
        linkReportId: linkReportId,
        pkNm: currentItem?.caption,
        pkParam: currentItem?.name,
        fkNm: item.caption,
        fkParam: item.name
      };
    });
  } else if (!data.informations) {
    transformedData = data.linkParamInfo;
  }
  setParamInfo(transformedData);

  const uniqueFkNmOptions = transformedData.reduce((acc, item) => {
    const exists = acc.some((option) => option.fkNm === item.fkNm);
    if (!exists && item.fkNm !== null) {
      acc.push({
        fkNm: item.fkNm,
        fkParam: item.fkParam,
        caption: item.fkNm
      });
    }
    return acc;
  }, []);
  setFkNmOptions(uniqueFkNmOptions);
};


export const createLinkDataXML = (dataPairs) => {
  const xmlDoc = document.implementation.createDocument('', '', null);
  const root = xmlDoc.createElement('LINKDATA_XML');
  xmlDoc.appendChild(root);
  dataPairs.forEach((pair) => {
    const argData = xmlDoc.createElement('ARG_DATA');
    const fkColNm = xmlDoc.createElement('FK_COL_NM');
    const pkColNm = xmlDoc.createElement('PK_COL_NM');
    const fkText = xmlDoc.createTextNode(pair.FK_COL_NM);
    const pkText = xmlDoc.createTextNode(pair.PK_COL_NM);
    fkColNm.appendChild(fkText);
    pkColNm.appendChild(pkText);
    argData.appendChild(fkColNm);
    argData.appendChild(pkColNm);
    root.appendChild(argData);
  });
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(xmlDoc);
  return xmlString;
};
