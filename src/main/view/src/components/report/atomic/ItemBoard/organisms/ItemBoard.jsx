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
import './itemBoard.css';
import download from 'assets/image/icon/button/download_new.png';
import useLayout from 'hooks/useLayout';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useState} from 'react';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';

import Chart from 'components/report/item/chart/Chart';
import Item from '../atoms/Item';
import PivotGrid from 'components/report/item/pivot/PivotGrid';
import DataGrid from 'components/report/item/grid/DataGrid';
import {Popover} from 'devextreme-react';
import {Type, exportToFile} from 'components/utils/DataExport';
import Pie from 'components/report/item/pie/Pie';
import ItemManager from 'components/report/item/util/ItemManager';

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
`;

const DownloadImage = styled.img`
  height: 20px;
  width: 20px;
`;


const ItemBoard = () => {
  const {deleteFlexLayout, updateLayoutShape} = useLayout();
  const dispatch = useDispatch();
  const {getTabHeaderButtons} = ItemManager.useCustomEvent();
  const selectedReportId = useSelector(selectCurrentReportId);
  const layoutConfig = useSelector(selectFlexLayoutConfig);
  const {selectItem} = ItemSlice.actions;
  const items = useSelector(selectCurrentItems);
  const rootItem = useSelector(selectRootItem);
  const selectedItemId = useSelector(selectSelectedItemId);
  const reportId = useSelector(selectCurrentReportId);
  const model = Model.fromJson(layoutConfig);
  const [itemExports, setItemExports] = useState([]);

  const itemFactory = {
    chart: Chart,
    pivot: PivotGrid,
    grid: DataGrid,
    pie: Pie
  };

  const itemExportsPicker = (id) => {
    return itemExports.filter((item) => item.id == id)[0];
  };

  // TODO: 임시 예외처리 차트용만 다운로드 구현 삭제예정
  const exportExceptionHandle = (pickItem) => {
    let isOk = false;
    if (!pickItem) {
      isOk = false;
      return isOk;
    }
    if (pickItem.type === 'CHART') {
      isOk = true;
    }
    if (pickItem.type === 'GRID') {
      isOk = true;
    }
    if (pickItem.type === 'PIE') {
      isOk = true;
    }
    if (pickItem.type === 'PIVOT') {
      isOk = true;
    }
    return isOk;
  };

  const exportFile = (e, type) => {
    const pickItem = itemExportsPicker(e);
    if (!exportExceptionHandle(pickItem)) {
      console.error('아이템 및 데이터가 그려지지 않았습니다.');
      return;
    };
    if (Type.CSV === type) {
      exportToFile(e, pickItem.data, Type.CSV);
    } else if (Type.TXT === type) {
      exportToFile(e, pickItem.data, Type.TXT);
    } else if (Type.XLSX === type) {
      exportToFile(e, pickItem.data, Type.XLSX);
    } else if (Type.IMG === type) {
      exportToFile(e, pickItem, Type.IMG);
    }
  };

  /**
   * 아이템 type에 맞는 컴포넌트 생성
   * @param {*} node
   * @return {ReactNode}
   */
  function factory(node) {
    const component = node.getComponent();
    const id = node.getId();
    const ItemComponent = itemFactory[component];
    const item = items.find((i) => id == i.id);
    const adHocOption = rootItem.adHocOption;

    if (!item) return <></>;


    return (
      <Item>
        <ItemComponent
          setItemExports={setItemExports}
          item={item}
          adHocOption={adHocOption}
          id={item.id}/>
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
      if (selectedItemId != itemId) {
        model.doAction(Actions.setActiveTabset(action.data.tabsetNode));
        const modelJson = model.toJson();

        updateLayoutShape(reportId, modelJson);
        dispatch(selectItem({reportId, itemId}));
      }
      return;
    }

    // Tab Focus 처리
    if (action.type == 'FlexLayout_SelectTab') {
      const itemId = action.data.tabNode;
      if (selectedItemId != itemId) {
        dispatch(selectItem({reportId, itemId}));
      }
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
      const buttons = ItemManager.getTabHeaderItems(type)
          .map((key) => getTabHeaderButtons(type, key, id));

      let isImg = true;
      if (type === 'grid') isImg = false;
      if (type === 'pivot') isImg = false;

      renderValues.buttons.push(
          !rootItem.adHocOption &&
          <button
            key="delete"
            title="Delete tabset"
            onClick={(e) => {
              // flexLayout 커스텀 삭제 버튼 기능.
              model.doAction(Actions.deleteTab(id));
            }}
          >
          &#128473;&#xFE0E;
          </button>,
          <button
            key="download"
            title="Download"
          >
            <DownloadImage id={tabNode._attributes.id+'btn'} src={download}/>
            <Popover
              target={'#'+tabNode._attributes.id+'btn'}
              showEvent="click"
            >
              {isImg ?
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.IMG);
              }}>img</button> : null}
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.CSV);
              }}>csv</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.TXT);
              }}>txt</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.XLSX);
              }}>xlsx</button>
            </Popover>
          </button>,
          ...buttons
      );
    }
  }

  const onModelChange = (node, action) => {
    if (action.type == 'FlexLayout_MoveNode') {
      updateLayoutShape(reportId, model.toJson());
    } else if (action.type == 'FlexLayout_DeleteTab') {
      // tabEnableClose: true-> layout타이틀 옆 삭제 버튼으로 삭제할 때. 현재 버튼은 숨김 처리함.
      deleteFlexLayout(
          selectedReportId,
          action.data.node,
          model.toJson()
      );
    }
  };

  return (
    <StyledBoard>
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
