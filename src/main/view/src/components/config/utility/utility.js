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

/**
 * onDragChange 함수는 드래그 앤 드랍 이벤트 중, 항목이 이동할 위치에 따라
 * 드래그가 가능한지 여부를 확인하고, 조건에 맞지 않으면 드래그를 취소합니다.
 *
 * @param {Object} params - 드래그 이벤트에 필요한 데이터가 포함된 객체.
 * @param {Object} params.component - 이벤트를 발생시킨 컴포넌트 객체 드래그할 수 있는 노드를 가져오는 데 사용.
 * @param {Object} params.itemData - 드래그된 항목의 데이터.
 * @param {number} params.toIndex - 드래그된 항목이 이동하려는 대상의 인덱스.
 * @param {boolean} params.cancel - 드래그가 취소될지 여부를 나타내는 플래그.
 * @param {string} params.key - 항목을 구분할 수 있는 키, 예를 들어 항목의 ID와 같은 고유 식별자.
 * @return {boolean}
 */
export const onDragChange = ({component, itemData, toIndex, cancel, key}) => {
  const visibleRows = component.getVisibleRows();
  const sourceNode = component.getNodeByKey(itemData[key]);
  let targetNode = visibleRows[toIndex].node;

  while (targetNode && targetNode.data) {
    if (targetNode.data[key] === sourceNode.data[key]) {
      return true;
    }

    targetNode = targetNode.parent;
  }
  return false;
};

/**
 * onReorder 함수는 드래그 앤 드랍 이벤트에서 요소를 재정렬할 때 호출됩니다.
 * @param {Object} params - 드래그 앤 드랍 이벤트에 필요한 데이터가 포함된 객체.
 * @param {string} params.parentKey - 부모 요소를 찾는 key (예: 'fldParentId')
 * @param {string} params.key - 요소를 구분할 수 있는 값 (예: 'id')
 * @param {string} params.typeKey - 보고서의 type을 구분할 수 있는 값 (예: 'type')
 * @param {Object} params.component - 이벤트를 발생시킨 컴포넌트
 * @param {Object} params.itemData - 드래그된 항목의 데이터
 * @param {number} params.fromIndex - 항목이 이동되기 전의 인덱스
 * @param {number} params.toIndex - 항목이 이동된 후의 인덱스
 * @param {boolean} params.dropInsideItem - 항목이 다른 항목 안에 놓였는지 여부
 * @param {Array} params.datasource - 데이터를 재정렬할 원본 배열
 * @return {Object} - {datasource, sourceData} 재정렬된 데이터와 드래그된 항목의 데이터
 */
export const onReorder = ({
  component, itemData, fromIndex, toIndex, dropInsideItem,
  datasource, parentKey, key, typeKey
}) => {
  const visibleRows = component.getVisibleRows();
  let sourceData = itemData;
  const sourceIndex = datasource
      .findIndex((folder) => folder[key] === sourceData[key]);

  // 폴더 안에 아이템을 넣을 경우
  if (dropInsideItem) {
    if (visibleRows[toIndex].data[typeKey] &&
      visibleRows[toIndex].data[typeKey] !== 'FOLDER') {
      return false;
    }
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

/**
 * 드래그 앤 드랍 완료 후 호출되는 함수
 * @param {Object} params - 드래그 앤 드랍 이벤트의 매개변수
 * @param {Object} params.component - TreeList 컴포넌트
 * @param {Array} params.datasource - TreeList의 데이터 소스
 */
export const onDragEnd = ({component, datasource, key, parentKey}) => {
  // 데이터 소스에서 각 노드를 검사
  datasource.forEach((node) => {
    // eslint-disable-next-line max-len
    const children = datasource.filter((item) => item[parentKey] === node[key]); // 하위 요소 필터링
    if (children.length === 0 && component.isRowExpanded(node[key])) {
      // 하위 요소가 없고, 확장된 상태라면 축소
      component.collapseRow(node[key]);
    }
  });
};
