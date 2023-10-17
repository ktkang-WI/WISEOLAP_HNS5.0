const FlexLayoutDefault= () => {
  return {
    dashboard: {
      global: {tabEnableClose: false},
      layout: {
        type: 'row',
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                id: '1',
                type: 'tab',
                name: 'Chart 1',
                component: 'chart'
              }
            ]
          }
        ]
      }
    },
    adhoc: {
      global: {tabEnableClose: false},
      layout: {
        type: 'column',
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            children: [
              {
                id: '1',
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
                id: '2',
                type: 'tab',
                name: 'PivotGrid',
                component: ''
              }
            ]
          }
        ]
      }
    }
  };
};
export default FlexLayoutDefault;
