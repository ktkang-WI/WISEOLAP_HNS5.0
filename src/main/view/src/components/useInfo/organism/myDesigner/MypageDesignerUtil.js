export const MyDesignerConstance = {
  // DEFAULT_DATASET_ID: 'defaultDatasetId',
  DEFAULT_REPORT_ID: 'defaultReportId',
  ADHOC_DEFAULT_REPORT_ID: 'adHocDefaultReportId',
  EXCEL_DEFAULT_REPORT_ID: 'excelDefaultReportId',
  DEFAULT_ITEM: 'defaultItem',
  DEFAULT_PALETTE: 'defaultPalette',
  DEFAULT_LAYOUT: 'defaultLayout',
  DEFAULT_DISPLAY: 'defaultDisplay',
  DEFAULT_VIEWER_REPORT_ID: 'defaultViewerReportId'
};

export const favoritIdMapper = {
  defaultReportId: 'DashAny',
  adHocDefaultReportId: 'AdHoc',
  excelDefaultReportId: 'Excel'
};

export const designerConfigItems = [
  // TODO: 기본데이터 집합은 사용 안할 예정이지만 추후 추가 될 가능성 있음.
  // {id: 'defaultDatasetId', title: '기본 데이터 집합', label: '즐겨찾기'},
  {id: {id: 'defaultReportId', requiredNm: 'defaultReportNm'},
    title: '대시보드 기본 보고서', label: '즐겨찾기', type: 'favorit'},
  {id: {id: 'adHocDefaultReportId', requiredNm: 'adHocDefaultReportNm'},
    title: '비정형 기본 보고서', label: '즐겨찾기', type: 'favorit'},
  {id: {id: 'excelDefaultReportId', requiredNm: 'excelDefaultReportNm'},
    title: '스프레드 기본 보고서', label: '즐겨찾기', type: 'favorit'},
  {id: 'defaultItem', title: '기본 아이템', label: '즐겨찾기', type: 'favorit'},
  {id: 'defaultPalette', title: '기본 색상', label: '즐겨찾기', type: 'favorit'},
  {id: 'defaultLayout', title: '비정형 레이아웃 설정',
    label: '비정형 레이아웃 설정', type: 'checkAndSelect'},
  {id: 'defaultDisplay', title: '초기화면 설정',
    label: '초기화면 설정', type: 'checkAndSelect'},
  {id: 'maxReportQueryPeriod', title: '최대 조회 기간 설정',
    label: '최대 조회 기간 설정', type: 'checkAndSelect'}
];

export const defaultItemList = () => {
  const type = [
    {name: 'chart', caption: '차트'},
    {name: 'pie', caption: '파이차트'},
    {name: 'pivot', caption: '피벗 그리드'},
    {name: 'grid', caption: '그리드'},
    {name: 'boxPlot', caption: '박스플롯'},
    {name: 'choropleth', caption: '코로프레스'},
    {name: 'liquidFillGauge', caption: '액체게이지'},
    {name: 'calendar', caption: '달력'},
    {name: 'treeMap', caption: '트리맵'}
    // TODO : 추후 추가 예정
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
// myDesignerFolder로 이동.
export const layoutSelectList = (id) => {
  if (id == MyDesignerConstance['DEFAULT_LAYOUT']) {
    return [
      {id: 'C', name: '차트만 보기'},
      {id: 'G', name: '그리드만 보기'},
      {id: 'CTGB', name: '차트, 피벗 전부 보기'}
    ];
  }

  if (id == MyDesignerConstance['DEFAULT_DISPLAY']) {
    return [
      {id: 'DashAny', name: '대시보드'},
      {id: 'AdHoc', name: '비정형'},
      {id: 'Excel', name: '스프레드'}
    ];
  }

  if (id === 'maxReportQueryPeriod') {
    return [
      {id: 1, name: '1년'},
      {id: 2, name: '2년'},
      {id: 3, name: '3년'},
      {id: 4, name: '4년'},
      {id: 5, name: '5년'}
    ];
  }
};
