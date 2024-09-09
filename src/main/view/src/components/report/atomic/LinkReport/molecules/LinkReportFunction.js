export const processLinkParamData = (
    data,
    setParamInfo,
    setFkNmOptions,
    setLinkFkInfo,
    currentItemParam,
    subLinkParamInfo,
    setSubLinkParamInfo,
    setSubFkNmOptions,
    subLinkDim,
    subYn
) => {
  let transformedData;
  let transSubLinkDim;
  let currentParsedData;
  let parsedData;
  let fkNmOpts;
  let subFkNmOpts;
  if (data.informations) {
    // 처음 가져오는거
    parsedData = JSON.parse(data.informations);
    const linkReportId = data.reports[0].reportId;
    transformedData = currentItemParam.map((item, index) => {
      currentParsedData = parsedData[index];
      return {
        linkReportId: linkReportId,
        pkNm: item.caption,
        pkParam: item.name,
        fkNm:
          currentParsedData?.caption ==
            undefined ? 'None' : currentParsedData?.caption,
        fkParam:
          currentParsedData?.name ==
            undefined ? 'None' : currentParsedData?.name
      };
    });
    setLinkFkInfo(parsedData);
    if (subYn) {
      transSubLinkDim = subLinkDim.map((item, index) => {
        currentParsedData = parsedData[index];
        return {
          linkReportId: linkReportId,
          pkNm: item.caption,
          pkParam: item.name,
          fkNm:
            currentParsedData?.caption ==
              undefined ? 'None' : currentParsedData?.caption,
          fkParam:
            currentParsedData?.name ==
              undefined ? 'None' : currentParsedData?.name
        };
      });
    }
  } else if (!data.informations) {
    // 그대로 가져오는거
    transformedData = data.linkParamInfo;
    if (subYn) {
      if (!data.subLinkParamInfo || data.subLinkParamInfo.length === 0) {
        transSubLinkDim = subLinkDim.map((item, index) => {
          currentParsedData = data.linkParamInfo[index];
          return {
            linkReportId: data.linkReportId,
            pkNm: item.caption,
            pkParam: item.name,
            fkNm:
              currentParsedData?.caption ==
                undefined ? 'None' : currentParsedData?.caption,
            fkParam:
              currentParsedData?.name ==
                undefined ? 'None' : currentParsedData?.name
          };
        });
      } else {
        transSubLinkDim = data.subLinkParamInfo;
      }
    }
  }
  setParamInfo(transformedData);
  if (subYn) {
    setSubLinkParamInfo(transSubLinkDim);
  }
  if (data.informations) {
    fkNmOpts = parsedData.reduce((acc, item) => {
      const exists = acc.some((option) => option.caption === item.caption);
      if (!exists && item.caption !== null) {
        acc.push({
          fkNm: item.caption == undefined ? 'None' : item.caption,
          fkParam: item.name == undefined ? 'None' : item.name,
          caption: item.caption == undefined ? 'None' : item.caption
        });
      }
      return acc;
    }, []);
  } else if (!data.informations) {
    let exists;
    fkNmOpts = data.linkFkInfo.reduce((acc, item) => {
      exists = acc.some((option) => option.caption === item.caption);
      if (!exists && item.caption !== null) {
        acc.push({
          fkNm: item.caption == undefined ? 'None' : item.caption,
          fkParam: item.name == undefined ? 'None' : item.name,
          caption: item.caption == undefined ? 'None' : item.caption
        });
      }
      return acc;
    }, []);
    if (subYn) {
      if (data.subLinkReport.length > 0 &&
        data.subLinkReport[0].subLinkParamInfo &&
        data.subLinkReport[0].subLinkParamInfo.length > 0) {
        subFkNmOpts = data.subLinkReport[0].subLinkParamInfo;
      } else {
        subFkNmOpts = fkNmOpts;
      }
    }
  }
  fkNmOpts.unshift({
    fkNm: 'None',
    fkParam: 'None',
    caption: 'None'
  });
  setFkNmOptions(fkNmOpts);
  if (subYn) {
    if (subFkNmOpts && subFkNmOpts.length > 0) {
      setSubFkNmOptions(subFkNmOpts);
    }
    setSubFkNmOptions(fkNmOpts);
  }
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
