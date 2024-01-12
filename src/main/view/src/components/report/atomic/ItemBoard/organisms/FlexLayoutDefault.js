import ReportType from 'components/designer/util/ReportType';


const FlexLayoutDefault = () => {
  return {
    [ReportType.DASH_ANY]: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      borders: [],
      layout: {
        type: 'row',
        id: 'root', // layout 전부 삭제 시 임의로 id 가 자동 생성됨. 변화가 필요없다고 생각하여 id 고정.
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                className: 'item1',
                id: 'item1',
                type: 'tab',
                name: 'Chart 1',
                component: 'chart'
              }
            ]
          }
        ]
      }
    },
    [ReportType.AD_HOC]: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      layout: {
        type: 'row',
        id: 'root',
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                id: 'item1',
                type: 'tab',
                name: 'Chart',
                component: 'chart'
              }
            ]
          },
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                id: 'item2',
                type: 'tab',
                name: 'PivotGrid',
                component: 'pivot'
              }
            ]
          }
        ]
      }
    },
    [ReportType.EXCEL]: {
      global: {
        tabEnableClose: false,
        tabEnableRename: false
      },
      layout: {}
    }
  };
};

export default FlexLayoutDefault;
