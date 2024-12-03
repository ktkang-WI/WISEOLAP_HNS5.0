import localizedString from 'config/localization';

export const handleRowClick = (data, setRow) => {
  setRow(_.cloneDeep(data));
};

export const duplicateValidation = (value, list) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(!list.includes(value));
    }, 500);
  });
};

export const getRefInstance = (component, classNm) => {
  const element = document.getElementsByClassName(classNm);
  return component.getInstance(element[0]);
};

export const getHint = (item) => {
  if (item === 'plus') {
    return localizedString.newReport;
  }

  if (item === 'save') {
    return localizedString.saveReport;
  }

  if (item === 'remove') {
    return localizedString.deleteReport;
  }

  if (item === 'key') {
    return localizedString.passwordChange;
  }

  if (item === 'initPw') {
    return '비밀번호 초기화';
  }
};

export const onDragChange = ({component, itemData, toIndex, cancel, key}) => {
  const visibleRows = component.getVisibleRows();
  const sourceNode = component.getNodeByKey(itemData[key]);

  let targetNode = visibleRows[toIndex].node;
  while (targetNode && targetNode.data) {
    if (targetNode.data[key] === sourceNode.data[key]) {
      cancel = true;
      break;
    }
    targetNode = targetNode.parent;
  }
};

export const onReorder = ({
  component, itemData, fromIndex, toIndex, dropInsideItem, datasource,
  parentKey, key
}) => {
  const visibleRows = component.getVisibleRows();
  let sourceData = itemData;
  const sourceIndex = datasource
      .findIndex((folder) => folder[key] === sourceData[key]);

  // 폴더 안에 아이템을 넣을 경우
  if (dropInsideItem) {
    const parentNodeKey = visibleRows[toIndex].key;
    const childNodes = datasource.filter(
        (item) => item[parentKey] === parentNodeKey
    );

    const insertIndex = childNodes.length > 0 ?
    datasource.indexOf(childNodes[childNodes.length - 1]) + 1 :
      toIndex + 1;
    // 부모 ID 설정 후 이동
    sourceData = {...sourceData, [parentKey]: parentNodeKey};
    datasource.splice(sourceIndex, 1); // 기존 위치에서 제거
    // eslint-disable-next-line max-len
    datasource.splice(insertIndex, 0, sourceData); // 자식의 마지막 위치에 삽입
  } else {
    const newToIndex = fromIndex > toIndex ? toIndex - 1 : toIndex;
    let targetData = newToIndex >= 0 ? visibleRows[newToIndex].node.data : null;
    if (targetData && component.isRowExpanded(targetData[key])) {
      sourceData = {...sourceData, [parentKey]: targetData[key]};
      targetData = null;
    } else {
      const headId = targetData ? targetData[parentKey] : 0;
      if (sourceData[key] !== headId) {
        sourceData = {...sourceData, [parentKey]: headId};
      }
    }
    datasource.splice(sourceIndex, 1);
    const targetIndex = datasource
        // eslint-disable-next-line max-len
        .findIndex((folder) => folder[key] === (targetData && targetData[key])) + 1;
    datasource.splice(targetIndex, 0, sourceData);
  }

  return {datasource, sourceData};
};
