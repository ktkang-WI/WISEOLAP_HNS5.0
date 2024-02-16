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

const Memo = styled.div`
  font-size: 0.8rem;
  border: 1px dashed black;
  border-radius: 1px;
  border-color: #c1c1c1;
  padding: 2px 4px;
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

  const calcForFontWidth = (txt) => {
    const len = txt.split('')
        .map((s) => s.charCodeAt(0))
        .reduce((prev, c) =>
          (prev + ((c === 10) ? 2 : ((c >> 7) ? 2 : 1.12))), 0);
    if (len < 10) return 80;
    return len * (0.8 * 9);
  };

  function onRenderTabSet(tabSetNode, renderValues) {
    const tabNode = tabSetNode.getSelectedNode();

    if (tabNode) {
      const type = tabNode.getComponent();
      const id = tabNode.getId();
      const item = items.filter((item) => item.id === id)[0];
      const memo = item?.meta?.memo;
      const memoWidth = calcForFontWidth(memo);
      const buttons = ItemManager.getTabHeaderItems(type)
          .map((key) => getTabHeaderButtons(type, key, id));

      let isImg = true;
      if (type === 'grid') isImg = false;
      if (type === 'pivot') isImg = false;

      renderValues.buttons.push(
          !rootItem.adHocOption &&
          (memo !== '' ?
            <Memo style={{width: memoWidth+'px'}}>{memo}</Memo> : <></>),
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
