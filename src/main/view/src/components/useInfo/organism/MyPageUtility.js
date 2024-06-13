export const defaultItemList = () => {
  const type = [
    {id: 'chart', name: '차트'},
    {id: 'pie', name: '파이차트'},
    {id: 'pivot', name: '피벗 그리드'},
    {id: 'grid', name: '그리드'},
    {id: 'boxPlot', name: '박스플롯'},
    {id: 'choropleth', name: '코로프레스'}
    // liquidFillGauge: '액체게이지',
    // calendar: '달력',
    // treeMap: '트리맵',
    // card: '카드',
    // textBox: '텍스트상자',
    // schedulerComponent: '스케줄러',
    // timeline: '타임라인',
    // chord: '의존성 휠',
    // arc: '아크 다이어그램',
    // heatMap: '히트맵',
    // wordCloud: '워드클라우드',
    // coordinateLine: '평면좌표 라인',
    // coordinateDot: '평면좌표 점',
    // collapsibleTree: '신경망 트리',
    // radialTree: '방사형신경망',
    // sunburstChart: '선버스트',
    // funnelChart: '깔때기',
    // zoomableCicle: '계층형 네모차트',
    // ciclePacking: '버블팩',
    // scatterPlot: '산점도',
    // comboBox: '콤보상자',
    // listBox: '목록상자',
    // treeView: '트리보기',
    // starChart: '스타차트',
    // waterFall: '폭포수'
  ];
  return type;
};

export const adHocLayoutSelectList = () => {
  return [
    {id: 'C', name: '차트만 보기'},
    {id: 'G', name: '그리드만 보기'},
    {id: 'CTGB', name: '차트, 피벗 전부 보기'}
  ];
};
