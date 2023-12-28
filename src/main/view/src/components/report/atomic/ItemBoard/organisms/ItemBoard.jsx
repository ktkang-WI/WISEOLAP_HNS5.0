import {styled} from 'styled-components';
import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCurrentItems,
  selectSelectedItemId
} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import './itemBoard.css';
import download from 'assets/image/icon/button/download_new.png';
import {useLocation} from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useEffect, useState} from 'react';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';

import Chart from 'components/report/item/chart/Chart';
import Item from '../atoms/Item';
import PivotGrid from 'components/report/item/pivot/PivotGrid';
import DataGrid from 'components/report/item/grid/DataGrid';
import {Popover} from 'devextreme-react';
import {Type, exportToFile} from 'components/utils/DataExport';

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
  const location = useLocation();
  const {initLayout, deleteFlexLayout, setMovedLayout} = useLayout();
  const dispatch = useDispatch();
  const selectedReportId = useSelector(selectCurrentReportId);

  useEffect(() => {
    const defaultLayout = location.pathname.includes('dashboard')?
    {reportId: selectedReportId, designer: 'dashboard'} :
    {reportId: selectedReportId, designer: 'adhoc'};
    initLayout(defaultLayout);
  }, [location]);

  const layoutConfig = useSelector(selectFlexLayoutConfig);
  const {selectItem} = ItemSlice.actions;
  const items = useSelector(selectCurrentItems);
  const selectedItemId = useSelector(selectSelectedItemId);
  const reportId = useSelector(selectCurrentReportId);
  const model = Model.fromJson(layoutConfig);
  const [itemExports, setItemExports] = useState([]);

  const itemFactory = {
    chart: Chart,
    pivot: PivotGrid,
    grid: DataGrid
  };

  const itemExportsPicker = (id) => {
    return itemExports.filter((item) => item.id == id)[0];
  };

  const exportExceptionHandle = (pickItem) => {
    let isOk = true;
    if (!pickItem) {
      isOk = false;
      return isOk;
    }
    // 임시 예외처리 차트용만 다운로드 구현
    if (pickItem.type !== 'CHART') {
      isOk = false;
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
    } else if (Type.IMG === type) {
      pickItem.ref.current.instance.exportTo(e, 'png');
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
    if (!item) return <></>;


    return (
      <Item>
        <ItemComponent setItemExports={setItemExports}
          mart={item.mart} id={item.id}/>
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
      setMovedLayout(modelJson);
      return;
    }
    return action;
  }

  function onRenderTabSet(tabSetNode, renderValues) {
    const tabNode = tabSetNode.getSelectedNode();
    if (tabNode) {
      renderValues.buttons.push(
          <button
            key="delete"
            title="Delete tabset"
            onClick={(e) => {
              deleteFlexLayout(selectedReportId, tabNode._attributes.id);
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
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.IMG);
              }}>img</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.CSV);
              }}>csv</button>
              <button onClick={() => {
                exportFile(tabNode._attributes.id, Type.TXT);
              }}>txt</button>
            </Popover>
          </button>
      );
    }
  }

  const onModelChange = (node, action) => {
    if (action.type == 'FlexLayout_MoveNode') {
      setMovedLayout(model.toJson());
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
