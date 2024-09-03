import {styled} from 'styled-components';
import {Layout, Model, Actions} from 'flexlayout-react';
import 'flexlayout-react/style/light.css';
import {useSelector, useDispatch} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import './itemBoard.css';
import download from 'assets/image/icon/button/download_new.png';
import useLayout from 'hooks/useLayout';
import {useState} from 'react';
import {getTheme} from 'config/theme';
import Item from '../atoms/Item';
import {Popover} from 'devextreme-react';
import ItemManager from 'components/report/item/util/ItemManager';
import {
  selectCurrentDesignerMode,
  selectEditMode
} from 'redux/selector/ConfigSelector';
import {DesignerMode, EditMode} from 'components/config/configType';
import _ from 'lodash';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {itemComponents} from 'components/report/item/util/ItemMappers';
import EmptyComponent from
  'components/report/item/empty/component/EmptyComponent';
import ItemType from 'components/report/item/util/ItemType';
import localizedString from 'config/localization';
import {ItemDownload} from '../../ItemDownload/ItemDownload';

const theme = getTheme();

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
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

const ItemBoard = ({layoutConfig, item, report, ...props}) => {
  const {deleteFlexLayout, updateLayoutShape} = useLayout();
  const dispatch = useDispatch();
  const {getTabHeaderButtons} = ItemManager.useCustomEvent();

  const {selectItem} = ItemSlice.actions;
  const {selectDataset} = DatasetSlice.actions;
  const {items, selectedItemId} = item || {};
  const {reportId} = report || {};
  const rootItem = item;
  const model = Model.fromJson(layoutConfig);
  const editMode = useSelector(selectEditMode);
  const designerMode = useSelector(selectCurrentDesignerMode);
  const [itemExports, setItemExports] = useState([]);
  const tabSelectedClass = editMode == EditMode.DESIGNER ?
     'tab-selected' : '';
  const itemDownload = new ItemDownload({reportId, report, itemExports});
  const ignoreDownload = itemDownload.getIgnoreDownload();
  const imgDownloadExcept = itemDownload.getImgDownloadExcept();

  const nullDataCheck = (item) => {
    const isOk =
      [
        ItemType.TEXT_BOX,
        ItemType.SCHEDULER_COMPONENT,
        ItemType.PIVOT_GRID
      ].some((type) => type === item.type);
    if (isOk) return !isOk;

    return !item ||
    item?.mart?.data?.data?.length == 0 ||
    _.isEmpty(item?.mart?.data || {});
  };

  /**
   * 아이템 type에 맞는 컴포넌트 생성
   * @param {*} node
   * @return {ReactNode}
   */
  function factory(node) {
    const id = node.getId();
    const item = items.find((i) => id == i.id);
    const ItemComponent = (item.mart.data.length === 0 || !item.mart.data.data)?
      EmptyComponent : itemComponents[item.type];
    const adHocOption = rootItem.adHocOption;
    const selected = selectedItemId == item?.id;
    const selectedClassName = selected ? tabSelectedClass : '';

    if (item?.mart?.init && nullDataCheck(item)) {
      return <Item className={selectedClassName}>
        <Wrapper style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.color.gray400,
          font: theme.font.item
        }}>
          No Data
        </Wrapper>
      </Item>;
    }

    return (
      <Item item={item} className={selectedClassName}>
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
    const selected = id == selectedItemId;
    const selectedClassName = selected ? tabSelectedClass : '';
    return <span
      className={selectedClassName}
      style={
        {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }
    >{useCaption ? item.meta.name : false}</span>;
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

    if (!tabNode) return;

    const type = tabNode.getComponent();
    const id = tabNode.getId();
    const item = items.find((item) => item.id === id);
    const memo = item?.meta?.memo || null;

    const buttons = ItemManager.getTabHeaderItems(type)
        .map((key) => getTabHeaderButtons(type, key, id));

    const showCloseButton = !(editMode === EditMode.VIEWER ||
      designerMode === DesignerMode.AD_HOC);

    const isDownloadable = !ignoreDownload.includes(item?.type);
    const isImgDownloadable = imgDownloadExcept.includes(item?.type);
    const isImg = ['grid', 'pivot'].includes(type);

    const downloadButton = isDownloadable ? (
      <button key="download" title={localizedString.downloadReport}>
        <DownloadImage id={`${tabNode._attributes.id}btn`} src={download} />
        <Popover target={`#${tabNode._attributes.id}btn`} showEvent="click">
          {itemDownload.renderDownloadButtons(
              tabNode._attributes.id, item, isImg && isImgDownloadable
          )}
        </Popover>
      </button>
    ) : null;

    const closeButton = showCloseButton ? (
      <button
        key="delete"
        title={localizedString.remove}
        onClick={() => model.doAction(Actions.deleteTab(id))}
      >
        &#128473;&#xFE0E;
      </button>
    ) : null;

    renderValues.buttons.push(
        (memo ? <Memo>{memo}</Memo> : <></>),
        closeButton,
        downloadButton,
        ...buttons
    );
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
          reportId,
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
    <StyledBoard {...props}>
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

export default ItemBoard;
