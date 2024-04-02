import {styled} from 'styled-components';
import {Layout, Model, Actions} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCurrentItems,
  selectRootItem,
  selectSelectedItemId
} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import './itemBoard.css';
import download from 'assets/image/icon/button/download_new.png';
import useLayout from 'hooks/useLayout';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useState} from 'react';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';
import {getTheme} from 'config/theme';

import Choropleth from 'components/report/item/choropleth/Choropleth';
import Chart from 'components/report/item/chart/Chart';
import Item from '../atoms/Item';
import PivotGrid from 'components/report/item/pivot/PivotGrid';
import Card from 'components/report/item/card/Card';
import DataGrid from 'components/report/item/grid/DataGrid';
import TreeMap from 'components/report/item/treeMap/TreeMap';
import {Popover} from 'devextreme-react';
import {Type, exportToFile} from 'components/utils/DataExport';
import Pie from 'components/report/item/pie/Pie';
import ItemManager from 'components/report/item/util/ItemManager';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {DesignerMode} from 'components/config/configType';
import LiquidFillGauge
  from 'components/report/item/liquidFillGauge/LiquidFillGauge';
import CalendarChart
  from 'components/report/item/calendar/Calendar';

import BoxPlot from 'components/report/item/boxPlot/BoxPlot';
import Timeline from 'components/report/item/timeline/Timeline';
import Chord from 'components/report/item/chord/Chord';


const theme = getTheme();

const StyledBoard = styled.div`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: ${theme.color.background};
  display: flex;
  min-height: 0px;
  margin-bottom: 0px;

  .flexlayout__tabset {
    border: 1px solid #ddd;
    border-radius: 10px;
  }

  .flexlayout__tab > div {
    border-radius: 0px 0px 8px 8px;
  }

  .flexlayout__tabset_tabbar_outer {
    font: ${theme.font.itemTitle};
  }

  .flexlayout__tabset_tabbar_outer span {
    color: ${theme.color.gray500};
  }
`;

const DownloadImage = styled.img`
  height: 20px;
  width: 20px;
`;

const Memo = styled.div`
  font-size: 0.8rem;
  border: 1px dashed black;
  border-radius: 1px;
  border-color: #c1c1c1;
  padding: 2px 4px;
  width: auto;
  text-wrap: nowrap;
`;

const ItemBoard = () => {
  const {deleteFlexLayout, updateLayoutShape} = useLayout();
  const dispatch = useDispatch();
  const {getTabHeaderButtons} = ItemManager.useCustomEvent();
  const selectedReportId = useSelector(selectCurrentReportId);
  const layoutConfig = useSelector(selectFlexLayoutConfig);
  const {selectItem} = ItemSlice.actions;
  const {selectDataset} = DatasetSlice.actions;
  const items = useSelector(selectCurrentItems);
  const rootItem = useSelector(selectRootItem);
  const selectedItemId = useSelector(selectSelectedItemId);
  const reportId = useSelector(selectCurrentReportId);
  const model = Model.fromJson(layoutConfig);
  const designerMode = useSelector(selectCurrentDesignerMode);
  const [itemExports, setItemExports] = useState([]);

  const itemFactory = {
    chart: Chart,
    pivot: PivotGrid,
    grid: DataGrid,
    pie: Pie,
    choropleth: Choropleth,
    treeMap: TreeMap,
    liquidFillGauge: LiquidFillGauge,
    card: Card,
    calendar: CalendarChart,
    boxPlot: BoxPlot,
    timeline: Timeline,
    chord: Chord
  };

  const itemExportsPicker = (id) => {
    return itemExports.find((item) => item.id == id);
  };

  // TODO: 임시 예외처리 차트용만 다운로드 구현 삭제예정
  const exportExceptionHandle = (pickItem) => {
    let isOk = false;
    if (!pickItem) {
      isOk = false;
      return isOk;
    }
    isOk = [
      'CHART',
      'GRID',
      'PIE',
      'PIVOT',
      'CHOROPLETH',
      'TREEMAP',
      'CARD',
      'CALENDAR',
      'LIQUIDFILLGAUGE',
      'TIMELINE'
    ].includes(pickItem.type);

    return isOk;
  };

  const exportFile = (e, type, name) => {
    const pickItem = itemExportsPicker(e);
    if (!exportExceptionHandle(pickItem)) {
      console.error('아이템 및 데이터가 그려지지 않았습니다.');
      return;
    };
    if (Type.CSV === type) {
      exportToFile(name, pickItem.data, Type.CSV);
    } else if (Type.TXT === type) {
      exportToFile(name, pickItem.data, Type.TXT);
    } else if (Type.XLSX === type) {
      exportToFile(name, pickItem.data, Type.XLSX);
    } else if (Type.IMG === type) {
      exportToFile(name, pickItem, Type.IMG);
    }
  };

  /**
   * 아이템 type에 맞는 컴포넌트 생성
   * @param {*} node
   * @return {ReactNode}
   */
  function factory(node) {
    const id = node.getId();
    const item = items.find((i) => id == i.id);
    const ItemComponent = itemFactory[item.type];
    const adHocOption = rootItem.adHocOption;

    if (!item) return <></>;


    return (
      <Item>
        <ItemComponent
          setItemExports={setItemExports}
          item={item}
          adHocOption={adHocOption}
          id={item.id}
          node={node}/>
      </Item>
    );
  }

  /**
   * item id에 맞는 title을 매핑
   * @param {*} node
   * @return {ReactNode}
   */
  function titleFactory(node) {
    const id = node.getId();
    const item = items.find((i) => id == i.id);
    const useCaption = item.meta.useCaption;

    return <span>{useCaption? item.meta.name : false}</span>;
  }

  function focusItem(itemId) {
    if (selectedItemId != itemId) {
      dispatch(selectItem({reportId, itemId}));
      const item = items.find((i) => itemId == i.id);

      if (item?.meta?.dataField?.datasetId) {
        dispatch(selectDataset({
          reportId: reportId,
          datasetId: item.meta.dataField.datasetId
        }));
      }
    }
  }

  /**
   * 해당 action 실행할 경우 action return.
   * 아닐 경우 커스텀 로직 지정정
   * @param {*} action
   * @return {Action} action
   */
  function onAction(action) {
    // TabSet Focus 처리
    if (action.type == 'FlexLayout_SetActiveTabset') {
      const node = model.getNodeById(action.data.tabsetNode);
      const itemId = node.getChildren()[0].getId();

      model.doAction(Actions.setActiveTabset(action.data.tabsetNode));
      const modelJson = model.toJson();

      updateLayoutShape(reportId, modelJson);
      if (selectedItemId != itemId) {
        focusItem(itemId);
      }
      return;
    }

    // Tab Focus 처리
    if (action.type == 'FlexLayout_SelectTab') {
      const itemId = action.data.tabNode;
      const tabsetId = model.getNodeById(itemId).getParent().getId();

      model.doAction(Actions.setActiveTabset(tabsetId));
      const modelJson = model.toJson();

      updateLayoutShape(reportId, modelJson);
      focusItem(itemId);
    }

    // 레이아웃 조절
    if (action.type == 'FlexLayout_AdjustSplit') {
      const modelJson = model.toJson();
      const nodes = [action.data.node1, action.data.node2];
      const weight = [action.data.weight1, action.data.weight2];
      let complete = 0;

      const setWeight = (json) => {
        const index = nodes.indexOf(json.id);
        if (complete == 2) {
          return;
        }
        if (index >= 0) {
          json.weight = weight[index];
          complete++;
          return;
        }
        if (json.children) {
          for (const child of json.children) {
            setWeight(child);
          }
        }
      };

      setWeight(modelJson.layout);
      updateLayoutShape(reportId, modelJson);
      return;
    }

    return action;
  }

  function onRenderTabSet(tabSetNode, renderValues) {
    const tabNode = tabSetNode.getSelectedNode();

    if (tabNode) {
      const type = tabNode.getComponent();
      const id = tabNode.getId();
      const item = items.filter((item) => item.id === id)[0];
      const memo = item?.meta?.memo;
      const buttons = ItemManager.getTabHeaderItems(type)
          .map((key) => getTabHeaderButtons(type, key, id));

      // TODO: 임시용 변수
      const imgDownloadExcept = ['card', 'liquidFillGauge'];
      const isItPossibleToDownloadImg = imgDownloadExcept.includes(item.type);
      let isImg = true;
      if (type === 'grid') isImg = false;
      if (type === 'pivot') isImg = false;

      renderValues.buttons.push(
          !rootItem.adHocOption &&
          (memo ?
            <Memo>{memo}</Memo> : <></>),
          (designerMode === DesignerMode['AD_HOC'] ? <></> : <button
            key="delete"
            title="Delete tabset"
            onClick={(e) => {
              // flexLayout 커스텀 삭제 버튼 기능.
              model.doAction(Actions.deleteTab(id));
            }}
          >
          &#128473;&#xFE0E;
          </button>),
          <button
            key="download"
            title="Download"
          >
            <DownloadImage id={tabNode._attributes.id+'btn'} src={download}/>
            <Popover
              target={'#'+tabNode._attributes.id+'btn'}
              showEvent="click"
            >
              {isImg && !isItPossibleToDownloadImg?
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.IMG, item.meta.name);
              }}>img</button> : null}
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.CSV, item.meta.name);
              }}>csv</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.TXT, item.meta.name);
              }}>txt</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.XLSX, item.meta.name);
              }}>xlsx</button>
            </Popover>
          </button>,
          ...buttons
      );
    }
  }

  const onModelChange = (node, action) => {
    // 레이아웃 이동.
    if (action.type == 'FlexLayout_MoveNode') {
      updateLayoutShape(reportId, model.toJson());
    }
    // FlexLayout에서 지원하는 삭제 기능(현재 숨김 처리함.)
    if (action.type == 'FlexLayout_DeleteTab') {
      // tabEnableClose: true-> layout타이틀 옆 삭제 버튼으로 삭제할 때. 현재 버튼은 숨김 처리함.
      deleteFlexLayout(
          selectedReportId,
          action.data.node,
          model.toJson()
      );
    }
  };

  model.doAction(Actions.updateModelAttributes({
    tabSetHeaderHeight: 40,
    tabSetTabStripHeight: 40
  }));

  return (
    <StyledBoard className='section board'>
      <Layout
        model={model}
        factory={factory}
        titleFactory={titleFactory}
        onAction={onAction}
        onRenderTabSet={onRenderTabSet}
        onModelChange={onModelChange}
      />
    </StyledBoard>
  );
};

// 아이템 별 저장아이템
export const itemExportsObject = (id, itemRef, type, data) => {
  return {
    id: id,
    ref: itemRef,
    type: type,
    data: data
  };
};

export default ItemBoard;
