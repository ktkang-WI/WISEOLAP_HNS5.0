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
import download from '../../../assets/image/icon/button/download_new.png';
import {useLocation} from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import flexLayoutDefault from './FlexLayoutDefault';
import {useEffect} from 'react';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';

import Chart from '../item/Chart';
import Item from '../atoms/Item';

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
  const {defaultFlexLayout, deleteFlexLayout, setMovedLayout} = useLayout();
  const dispatch = useDispatch();
  const selectedReportId = useSelector(selectCurrentReportId);

  useEffect(() => {
    const defaultLayout = location.pathname.includes('dashboard')?
    flexLayoutDefault()['dashboard'] : flexLayoutDefault()['adhoc'];
    defaultFlexLayout(defaultLayout);
  }, [location]);

  const layoutConfig = useSelector(selectFlexLayoutConfig);
  const {selectItem} = ItemSlice.actions;
  const items = useSelector(selectCurrentItems);
  const selectedItemId = useSelector(selectSelectedItemId);
  const reportId = useSelector(selectCurrentReportId);
  const model = Model.fromJson(layoutConfig);

  const itemFactory = {
    chart: Chart,
    pivot: Chart
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

    return (
      <Item>
        <ItemComponent {...item}/>
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

    return <span>{item? item.meta.name : '아이템 없음'}</span>;
  }

  /**
   * 해당 action 실행할 경우 action return.
   * 아닐 경우 커스텀 로직 지정정
   * @param {*} action
   * @return {Action} action
   */
  function onFocusItem(action) {
    if (action.type == 'FlexLayout_SetActiveTabset') {
      const node = model.getNodeById(action.data.tabsetNode);
      const itemId = node.getChildren()[0].getId();
      if (selectedItemId != itemId) {
        dispatch(selectItem({reportId, itemId}));
      }
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
            onClick={() => {
            }}
          >
            <DownloadImage src={download}/>
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
        onAction={onFocusItem}
        onRenderTabSet={onRenderTabSet}
        onModelChange={onModelChange}
      />
    </StyledBoard>
  );
};


export default ItemBoard;
