const resultLayout = (
    tempState,
    layoutPosition,
    selectedLayoutId,
    tabsetType
) => {
  // 레이아웃 설정 초기화
  layoutPosition = layoutPosition.map(
      (child) => {
        return {...child, maximized: false};
      }
  );

  if (tabsetType === 'row') {
    tempState = {
      ...tempState,
      type: 'row',
      children: [
        {
          type: 'row',
          weight: 50,
          selected: 0,
          children: layoutPosition
        }
      ]
    };
  } else {
    tempState = {
      ...tempState,
      type: 'row',
      children: layoutPosition
    };
  }
  // init = 차트, 피벗 전부 보기.
  if (selectedLayoutId === 'init') {
    return tempState;
  }

  const idx = layoutPosition.findIndex(
      (child) => child.children[0].id == selectedLayoutId
  );

  layoutPosition[idx] = {
    ...layoutPosition[idx],
    maximized: true
  };

  return tempState;
};

// 비정형 보고서 배열 모양(tabsetType)이 세로로 2개 -> tabset, 가로로 2개 -> row
const AdHocLayoutSetting = (layoutType, reportId, state) => {
  const resultState = {...state[reportId]};
  const tabsetType = state[reportId].layoutConfig.layout.children[0].type;
  const selectedLayoutId = {
    'chart': 'item1',
    'pivot': 'item2',
    'chart_pivot': 'init'
  };
  const tempState = state[reportId].layoutConfig.layout;
  const layoutPosition = {
    tabset: tempState.children,
    row: tempState.children[0].children
  };

  resultState.layoutConfig = {
    ...resultState.layoutConfig,
    layout:
      resultLayout(
          tempState,
          layoutPosition[tabsetType],
          selectedLayoutId[layoutType],
          tabsetType
      )
  };

  return resultState;
};
export default AdHocLayoutSetting;
