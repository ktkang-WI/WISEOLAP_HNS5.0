import Choropleth from 'components/report/item/choropleth/Choropleth';
import Chart from 'components/report/item/chart/Chart';
import PivotGrid from 'components/report/item/pivot/PivotGrid';
import Card from 'components/report/item/card/Card';
import DataGrid from 'components/report/item/grid/DataGrid';
import TreeMap from 'components/report/item/treeMap/TreeMap';
import Pie from 'components/report/item/pie/Pie';
import LiquidFillGauge
  from 'components/report/item/liquidFillGauge/LiquidFillGauge';
import CalendarChart
  from 'components/report/item/calendar/Calendar';
import Timeline from 'components/report/item/timeline/Timeline';
import Chord from 'components/report/item/chord/Chord';
import ArcDiagram from 'components/report/item/arc/ArcDiagram';
import WordCloud from 'components/report/item/wordCloud/WordCloud';
import CoordinateLine
  from 'components/report/item/coordinateLine/CoordinateLine';
import CoordinateDot from 'components/report/item/coordinateDot/CoordinateDot';
import HeatMap from 'components/report/item/heatMap/HeatMap';
import CollapsibleTree
  from 'components/report/item/collapsibleTree/CollapsibleTree';
import RadialTree from 'components/report/item/radialTree/RadialTree';
import ScatterPlot from 'components/report/item/scatterPlot/ScatterPlot';
import SunBurstChart from 'components/report/item/sunburstChart/SunBurstChart';
import BoxPlot from 'components/report/item/boxPlot/BoxPlot';
import TextBox from 'components/report/item/textBox/TextBox';
import ZoomableCicle from 'components/report/item/zoomableCicle/ZoomableCicle';
import CiclePacking from 'components/report/item/ciclePacking/CiclePacking';
import ComboBox from 'components/report/item/comboBox/ComboBox';
import ListBox from 'components/report/item/listBox/ListBox';
import TreeView from 'components/report/item/treeView/TreeView';
import FunnelChart from 'components/report/item/funnelChart/FunnelChart';
import StarChart from 'components/report/item/starChart/StarChart';
import WaterFall from 'components/report/item/waterFall/WaterFall';
import SchedulerComponent
  from 'components/report/item/schedulerComponent/SchedulerComponent';
import ItemType from 'components/report/item/util/ItemType';

// TODO: 추후 아이템 타입 자동 감지하여 추가하게 수정
export const itemComponents = {
  [ItemType.CHART]: Chart,
  [ItemType.PIVOT_GRID]: PivotGrid,
  [ItemType.DATA_GRID]: DataGrid,
  [ItemType.PIE_CHART]: Pie,
  [ItemType.CHOROPLETH]: Choropleth,
  [ItemType.TREEMAP]: TreeMap,
  [ItemType.LIQUID_FILL_GAUGE]: LiquidFillGauge,
  [ItemType.CARD]: Card,
  [ItemType.CALENDAR]: CalendarChart,
  [ItemType.BOX_PLOT]: BoxPlot,
  [ItemType.TEXT_BOX]: TextBox,
  [ItemType.TIMELINE]: Timeline,
  [ItemType.CHORD_DIAGRAM]: Chord,
  [ItemType.ARC_DIAGRAM]: ArcDiagram,
  [ItemType.WORDCLOUD]: WordCloud,
  [ItemType.COORDINATE_LINE]: CoordinateLine,
  [ItemType.COORDINATE_DOT]: CoordinateDot,
  [ItemType.HEAT_MAP]: HeatMap,
  [ItemType.COLLAPSIBLE_TREE]: CollapsibleTree,
  [ItemType.RADIAL_TREE]: RadialTree,
  [ItemType.SUNBURST_CHART]: SunBurstChart,
  [ItemType.ZOOMABLE_CICLE]: ZoomableCicle,
  [ItemType.CICLE_PACKING]: CiclePacking,
  [ItemType.SCATTER_PLOT]: ScatterPlot,
  [ItemType.COMBO_BOX]: ComboBox,
  [ItemType.LIST_BOX]: ListBox,
  [ItemType.TREE_VIEW]: TreeView,
  [ItemType.FUNNEL_CHART]: FunnelChart,
  [ItemType.STAR_CHART]: StarChart,
  [ItemType.WATER_FALL]: WaterFall,
  [ItemType.SCHEDULER_COMPONENT]: SchedulerComponent
};

// TODO: 추후 localization 적용 필요. 단순 리팩토링이라 옮기기만 함.
export const defaultItemNames = {
  [ItemType.CHART]: '차트',
  [ItemType.PIVOT_GRID]: '피벗',
  [ItemType.DATA_GRID]: '그리드',
  [ItemType.PIE_CHART]: '파이',
  [ItemType.CHOROPLETH]: '코로프레스',
  [ItemType.TREEMAP]: '트리맵',
  [ItemType.LIQUID_FILL_GAUGE]: '액체게이지',
  [ItemType.CARD]: '카드',
  [ItemType.CALENDAR]: '달력',
  [ItemType.BOX_PLOT]: '박스플롯',
  [ItemType.TEXT_BOX]: '텍스트상자',
  [ItemType.TIMELINE]: '타임라인',
  [ItemType.CHORD_DIAGRAM]: '의존성 휠',
  [ItemType.ARC_DIAGRAM]: '아크 다이어그램',
  [ItemType.WORDCLOUD]: '워드클라우드',
  [ItemType.COORDINATE_LINE]: '평면좌표 라인',
  [ItemType.COORDINATE_DOT]: '평면좌표 점',
  [ItemType.HEAT_MAP]: '히트맵',
  [ItemType.COLLAPSIBLE_TREE]: '신경망 트리',
  [ItemType.RADIAL_TREE]: '방사형신경망',
  [ItemType.SUNBURST_CHART]: '선버스트',
  [ItemType.ZOOMABLE_CICLE]: '계층형 네모차트',
  [ItemType.CICLE_PACKING]: '버블팩',
  [ItemType.SCATTER_PLOT]: '산점도',
  [ItemType.COMBO_BOX]: '콤보상자',
  [ItemType.LIST_BOX]: '목록상자',
  [ItemType.TREE_VIEW]: '트리보기',
  [ItemType.FUNNEL_CHART]: '깔때기',
  [ItemType.STAR_CHART]: '스타차트',
  [ItemType.WATER_FALL]: '폭포수',
  [ItemType.SCHEDULER_COMPONENT]: '스케줄러'
};
