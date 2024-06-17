import {makeAdHocItemMart, makeMart}
  from './martUtilityFactory';
import {DataFieldType, dataFieldTypeOfItemTypeFunc} from './dataFieldType';
import ItemManager from './ItemManager';
import {initDataFieldMeta, makeAdHocItemMeta} from './metaUtilityFactory';
import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';

/**
 * 아이템의 meta값을 가지고 mart를 세팅
 * @param {*} orgItem 아이템 객체
 * @param {*} countMap 아이템 이름 카운트
 * @return {JSON} 생성된 아이템 객체
 */
const makeItem = (orgItem, countMap) => {
  let item = {};
  // 임시용
  const type = {
    chart: '차트',
    pie: '파이',
    pivot: '피벗',
    grid: '그리드',
    boxPlot: '박스플롯',
    choropleth: '코로프레스',
    liquidFillGauge: '액체게이지',
    calendar: '달력',
    treeMap: '트리맵',
    card: '카드',
    textBox: '텍스트상자',
    schedulerComponent: '스케줄러',
    timeline: '타임라인',
    chord: '의존성 휠',
    arc: '아크 다이어그램',
    heatMap: '히트맵',
    wordCloud: '워드클라우드',
    coordinateLine: '평면좌표 라인',
    coordinateDot: '평면좌표 점',
    collapsibleTree: '신경망 트리',
    radialTree: '방사형신경망',
    sunburstChart: '선버스트',
    funnelChart: '깔때기',
    zoomableIcicle: '계층형 네모차트',
    ciclePacking: '버블팩',
    scatterPlot: '산점도',
    comboBox: '콤보상자',
    listBox: '목록상자',
    treeView: '트리보기',
    starChart: '스타차트',
    waterFall: '폭포수'
  };

  let initNum = 1;
  if (countMap) {
    initNum = countMap[orgItem.type];
  }
  const fixMasterFilter = [
    {
      name: 'listBox',
      mode: 'multiple'
    },
    {
      name: 'treeView',
      mode: 'multiple'
    },
    {
      name: 'comboBox',
      mode: 'single'
    }];
  const isFixMasterFilter =
    fixMasterFilter.map((d) => d.name).includes(orgItem.type);
  const seriesType = orgItem.chartType;
  delete orgItem.chartType;
  // meta 값 있는 경우 불러오기로 간주
  if (!orgItem.meta) {
    // 기본 값 세팅
    item = {
      ...orgItem,
      meta: {
        interactiveOption: {
          mode:
            fixMasterFilter.find((d) =>
              d.name == orgItem.type)?.mode || 'single',
          // 마스터 필터 모드 'signle' or 'multiple'
          enabled: isFixMasterFilter, // 마스터 필터 사용 여부
          ignoreMasterFilter: isFixMasterFilter, // 마스터 필터 무시
          // 교차 데이터 소스 필터링 (마스터 필터가 enable 돼 있는데 해당 옵션 true면
          // 데이터 집합 관계없이 마스터 필터 일괄 적용)
          crossDataSource: isFixMasterFilter,
          targetDimension: 'dimension' // 대상 차원
        },
        name: type[orgItem.type] + initNum,
        memo: '',
        paletteType: 'palette',
        palette: paletteCollection[0],
        colorEdit: [],
        useCaption: true,
        dataField: {
          dataFieldQuantity: 0
        },
        dataHighlight: []
      }
    };
    if (orgItem.type === 'chart') {
      item.meta.seriesType = seriesType;
    }
  }

  // mart 및 meta 값 세팅
  const mart = makeMart(item);
  item.mart = mart;

  if (!orgItem.meta) {
    initDataFieldMeta(item);
    ItemManager.generateMeta(item);
  };

  return item;
};

/**
 * 비정형 아이템의 세팅
 * @param {*} orgItem 아이템 객체
 * @return {JSON} 생성된 비정형 아이템의 정보
 */
const makeAdHocItem = (orgItem) => {
  const meta = !orgItem.meta ? makeAdHocItemMeta(orgItem) : orgItem.meta;
  const mart = !orgItem.mart ? makeAdHocItemMart(orgItem.type) : orgItem.mart;

  return {
    ...orgItem,
    meta: meta,
    mart: mart
  };
};

const makeAdHocOption = (layout) => {
  const dataFieldTypes = dataFieldTypeOfItemTypeFunc('pivot');
  const dataField = {};
  dataFieldTypes.forEach((type) => dataField[type] = []);
  dataField[DataFieldType.SORT_BY_ITEM] = [];
  dataField.dataFieldQuantity = 0;
  const attributeItems = ItemManager.getAdHocAttributeItems();
  const topBottomInfo = ItemManager.getTopBottomInfo();
  const dataFieldOption = ItemManager.generateDataFieldOption({type: 'pivot'});

  dataFieldOption.measure.useButton = true;

  return {
    dataFieldOption: dataFieldOption,
    dataField: dataField,
    attributeItems: attributeItems,
    topBottomInfo: topBottomInfo,
    layoutSetting: layout || 'chart_pivot'
  };
};

export {
  makeItem,
  makeAdHocItem,
  makeAdHocOption
};
