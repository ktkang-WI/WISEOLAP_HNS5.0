import {TreeView} from 'devextreme-react';
import {getTheme} from 'config/theme';
import Wrapper from '../../Common/Wrap/Wrapper';
import DataColumn from '../../DataColumnTab/molecules/DataColumn';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import React, {useCallback, useRef} from 'react';
import {styled} from 'styled-components';
import meaImg from 'assets/image/icon/dataSource/small_measure.png';
import dimImg from 'assets/image/icon/dataSource/small_dimension.png';
import fldImg from 'assets/image/icon/dataSource/folder.png';
import meaGrpImg from
  'assets/image/icon/dataSource/cube_measure.png';
import dimGrpImg from
  'assets/image/icon/dataSource/cube_dimension.png';
import moreIcon from 'assets/image/icon/dataSource/other_menu.png';
import DatasetType from 'components/dataset/utils/DatasetType';
import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';
import BubbleTooltip from '../../Common/Popover/BubbleTooltip';
import meaFldImg from 'assets/image/icon/dataSource/folder.png';
import ContextMenu from 'devextreme-react/context-menu';
import {useDispatch} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const StyledTreeView = styled(TreeView)`
  color: ${theme.color.gray600};
  font: ${theme.font.dataSource};
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.gray600};
  }
  .dx-treeview-item-content {
    transform: none !important;
    height: 32px;
    display: flex;
    width: 100%;
    align-items: center;
    padding-left: 3px;
  }

  .dx-treeview-node {
    padding-left: 10px;
  }

  .dx-treeview-toggle-item-visibility::before {
    content: '';
    height: 22px;
    background: url(${moreIcon}) no-repeat;
    transform: rotate(270deg);
    background-position: center;
    margin-left: -12px;
  }

  .dx-treeview-toggle-item-visibility-opened::before {
    transform: rotate(0deg);
  }
  
  .dx-treeview-item {
    display: inline-block;
    position: relative;
  }

  .dx-treeview-item:hover .tooltip {
    display:block;
  }

  .dx-treeview-item:hover .tooltipWrapper {
    width: 200px;
  }

  .dx-treeview-item {
    padding: 0 !important;
  }
`;

const iconMapper = {
  'MEA': meaImg,
  'DIM': dimImg,
  'FLD': fldImg,
  'DIMGRP': dimGrpImg,
  'MEAGRP': meaGrpImg,
  'MEAFLD': meaFldImg
};

const DataSourceFoldableList = ({dataset}) => {
  // state
  const editMode = useSelector(selectEditMode);
  // ref
  const ref = useRef();
  const contextMenuRef = useRef(null);
  const selectRef = useRef(null);
  // hook
  const dispatch = useDispatch();
  const {updateDataset} = DatasetSlice.actions;
  // selector
  const selectedReportId = useSelector(selectCurrentReportId);

  let data = _.cloneDeep(dataset.fields);
  const menuItems = [
    {
      id: 'measure',
      text: '측정값으로 변경'
    },
    {
      id: 'dimension',
      text: '차원으로 변경'
    }
  ];

  const treeViewItemContextMenu = useCallback((e) => {
    const isDim = e.itemData?.type === 'DIM';
    const isMea = e.itemData?.type === 'MEA';

    contextMenuRef.current.instance.option('items[0].visible', isDim);
    contextMenuRef.current.instance.option('items[1].visible', isMea);
    selectRef.current = e.itemData;
  }, []);

  const contextMenuItemClick = useCallback(
      (e) => {
        const tempDataset = _.cloneDeep(dataset);
        tempDataset.fields = data.map((d) => {
          if (d.uniqueName === selectRef?.current?.uniqueName) {
            return {
              ...d,
              type: e.itemData.id === 'measure' ? 'MEA' : 'DIM'
            };
          }
          return d;
        });
        dispatch(updateDataset({
          reportId: selectedReportId,
          dataset: tempDataset
        }));
      },
      [dataset, editMode]);

  const getRenderItem = (items) => {
    const getDraggableItem = (provided, snapshot, rubric) => {
      if (rubric.draggableId == 0) return;
      const item = items.find(
          (data) => data.uniqueName == rubric.draggableId
      ) || {};

      const tempData = {
        caption: item.name,
        name: item.name,
        uniqueName: item.uniqueName
      };
      return (
        <DataColumn
          column={tempData} provided={provided} index={rubric.source.index}>
          {tempData.name}
        </DataColumn>
      );
    };

    return getDraggableItem;
  };

  const itemRender = (item, index, snapshot) => {
    const shouldRenderClone =
      (item.uniqueName === snapshot.draggingFromThisWith ||
        item.type === 'DIMGRP' || item.type === 'MEAGRP' ||
        item.type === 'MEAFLD'
      );
    let description = '';

    if (dataset.datasetType === DatasetType.CUBE) {
      description = item.description || '';
    } else if (dataset.datasetType === DatasetType.DS_SQL) {
      const fieldDesc = dataset.fieldDescription || {};
      description = fieldDesc[item.name];
    }

    if (shouldRenderClone) {
      return (
        <>
          <div className="dx-item-content dx-treeview-item-content">
            <img width='16px' src={iconMapper[item.type]} className="dx-icon"/>
            <span>{item.name}</span>
          </div>
        </>
      );
    }

    return (
      <>
        <Draggable
          draggableId={item.uniqueName}
          index={index}
        >
          {(provided) => (
            <div
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className="dx-item-content dx-treeview-item-content"
            >
              <img
                style={{width: '16px', height: '16px', marginBottom: '1px'}}
                src={iconMapper[item.type]}
                className="dx-icon"/>
              {/* 기존 포맷 유지*/}
              <span className='ct-tooltip'>
                {item.name}
                {item.expression ?
                <span className='ct-tooltiptext'>
                  {item.expression}
                </span> : <></>}
              </span>
            </div>
          )}
        </Draggable>
        {description && getDescription(description)}
      </>
    );
  };

  const getDescription = (title) => {
    return <BubbleTooltip
      top='35px'
      className='tooltip'
    >
      {title}
    </BubbleTooltip>;
  };

  if (dataset.showHiddenFields) {
    data = data.map((field) => {
      if (field.parentId) {
        return {
          ...field,
          visible: undefined,
          disabled: typeof field.visible == 'boolean' ? !field.visible : false
        };
      }

      return {
        ...field,
        visible: true
      };
    });
  }

  // 뷰어인 경우.
  if (editMode == EditMode['VIEWER']) {
    const hideTreeElement = dataset.selectedFields;

    if (hideTreeElement) {
      const hideTreeElementUniNms = hideTreeElement.reduce((acc, e) => {
        if (!e.check) {
          acc.push(e.uniNm);
        }
        return acc;
      }, []);

      data = _.cloneDeep(dataset.fields.filter((field) =>
        !hideTreeElementUniNms.includes(field.uniqueName)
      ));
    }
  }

  if (data.length > 0 && dataset.datasetType != 'CUBE') {
    data[0].expanded = true;
  }

  return (
    <Wrapper>
      <Droppable
        mode=''
        droppableId="dataSource"
        renderClone={getRenderItem(data)}
        isDropDisabled={true}
      >
        {(provided, snapshot) => (
          <Wrapper
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            <StyledTreeView
              id="dataSourceFoldableTreeView"
              expandedExpr="expanded"
              ref={ref}
              items={data}
              dataStructure="plain"
              parentIdExpr="parentId"
              keyExpr="uniqueName"
              displayExpr="name"
              searchEnabled={true}
              searchMode={'contains'}
              height={'calc(100% - 80px)'}
              onItemClick={(e) => {
                const {component: instance, itemData} = e;

                if (itemData.disabled) {
                  const node = instance.getNodeByItem(itemData);
                  instance.expandItem(node.key);
                } else {
                  itemData.expanded ? instance.collapseItem(itemData) :
                  instance.expandItem(itemData);
                }
              }}
              itemRender={(item, index) => itemRender(item, index, snapshot)}
              focusStateEnabled={false}
              onItemContextMenu={treeViewItemContextMenu}
            />
            <ContextMenu
              ref={contextMenuRef}
              dataSource={menuItems}
              target="#dataSourceFoldableTreeView .dx-treeview-item"
              onItemClick={contextMenuItemClick}
            />
          </Wrapper>
        )
        }

      </Droppable>
    </Wrapper>
  );
};
const compare = (prev, next) => {
  if (!_.isEqual(prev.dataset.showHiddenFields,
      next.dataset.showHiddenFields)) {
    return false;
  }

  if (_.isEqual(prev.dataset.fields, next.dataset.fields)) {
    return true;
  }

  return false;
};

export default React.memo(DataSourceFoldableList, compare);
