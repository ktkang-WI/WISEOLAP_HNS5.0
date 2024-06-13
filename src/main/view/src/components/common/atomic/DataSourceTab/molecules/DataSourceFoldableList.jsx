import {TreeView} from 'devextreme-react';
import {getTheme} from 'config/theme';
import Wrapper from '../../Common/Wrap/Wrapper';
import DataColumn from '../../DataColumnTab/molecules/DataColumn';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {useRef} from 'react';
import {styled} from 'styled-components';
import meaImg from 'assets/image/icon/dataSource/small_measure.png';
import dimImg from 'assets/image/icon/dataSource/small_dimension.png';
import fldImg from 'assets/image/icon/dataSource/folder.png';
import meaGrpImg from
  'assets/image/icon/dataSource/cube_measure.png';
import dimGrpImg from
  'assets/image/icon/dataSource/cube_dimension.png';
import moreIcon from 'assets/image/icon/dataSource/other_menu.png';
import {createRoot} from 'react-dom/client';
import DatasetType from 'components/dataset/utils/DatasetType';

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
`;

const SubTitle = styled.div`
  display: none;
  font-size: 0.75rem;
  font-weight: 400;
  position: absolute;
  top: 30px;
  left: 40%;
  width: auto;
  z-index: 99;
  white-space: nowrap;
  text-align: center;
  margin: 0 auto;
  transform: translateX(-50%);
  background: ${theme.color.white};
  border-radius: 2px;
  border: 1px solid ${theme.color.primary};
  padding: 3px 7px;
  color: ${theme.color.primary};
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, .15);

  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    transform: rotate(45deg);
    background: #ffffff;
    left: calc(50% - 2px);
    top: -3px;
    border-left: 1px solid ${theme.color.primary};
    border-top: 1px solid ${theme.color.primary};
  }
`;

const iconMapper = {
  'MEA': meaImg,
  'DIM': dimImg,
  'FLD': fldImg,
  'DIMGRP': dimGrpImg,
  'MEAGRP': meaGrpImg
};

const DataSourceFoldableList = ({dataset}) => {
  const ref = useRef();

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
    const shouldRenderClone = item.uniqueName === snapshot.draggingFromThisWith;

    if (shouldRenderClone) {
      return (
        <div className="dx-item-content dx-treeview-item-content">
          <img width='16px' src={iconMapper[item.type]} className="dx-icon"/>
          <span>{item.name}</span>
        </div>
      );
    }
    return (
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
              <span className='ct-tooltiptext'>{item.expression}</span> : <></>}
            </span>
          </div>
        )}
      </Draggable>
    );
  };

  const getSubTitle = (title) => {
    return <SubTitle className='tooltip'>{title}</SubTitle>;
  };

  const activeTootip = (itemElement, description) => {
    const subTitle = getSubTitle(description);
    const container = document.createElement('div');
    container.className = 'tooltipWrapper';
    itemElement.appendChild(container);

    const root = createRoot(container);
    root.render(subTitle);
  };

  const onItemRendered = ({itemElement, itemData}) => {
    let description = '';

    if (dataset.datasetType === DatasetType.CUBE) {
      description = itemData.descript ? itemData.description : '';
    } else if (dataset.datasetType === DatasetType.DS_SQL) {
      const fieldDesc = dataset.fieldDescription || {};
      description = fieldDesc[itemData.name];
    }

    if (description) {
      activeTootip(itemElement, description);
    }
  };

  const data = dataset? _.cloneDeep(dataset.fields) : [];

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
              expandedExpr="expanded"
              ref={ref}
              items={data}
              dataStructure="plain"
              parentIdExpr="parentId"
              keyExpr="uniqueName"
              searchEnabled={true}
              height={'calc(100% - 80px)'}
              itemRender={(item, index) => itemRender(item, index, snapshot)}
              focusStateEnabled={false}
              onItemRendered={onItemRendered}
            />
          </Wrapper>
        )
        }

      </Droppable>
    </Wrapper>
  );
};

export default DataSourceFoldableList;
