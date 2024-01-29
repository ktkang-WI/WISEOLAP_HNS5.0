import {TreeView} from 'devextreme-react';
import {getTheme} from 'config/theme';
import Wrapper from '../../Common/Wrap/Wrapper';
import DataColumn from '../../DataColumnTab/molecules/DataColumn';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {useRef} from 'react';
import {styled} from 'styled-components';

const theme = getTheme();

const StyledTreeView = styled(TreeView)`
  color: ${theme.color.primaryFont};
  font: ${theme.font.dataSource};
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.primaryFont};
  }
  .dx-treeview-item-content {
    transform: none !important;
  }
`;

// TODO: 추후 Redux 연동 예정 현재는 임시 데이터 사용
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
          <img src={item.icon} className="dx-icon"/>
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
            <img src={item.icon} className="dx-icon"/>
            <span>{item.name}</span>
          </div>
        )}
      </Draggable>
    );
  };

  const data = dataset? _.cloneDeep(dataset.fields) : [];

  if (data.length > 0) {
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
              displayExpr="name"
              parentIdExpr="parentId"
              keyExpr="uniqueName"
              searchEnabled={true}
              height={'calc(100% - 80px)'}
              itemRender={(item, index) => itemRender(item, index, snapshot)}
              focusStateEnabled={false}
            />
          </Wrapper>
        )
        }

      </Droppable>
    </Wrapper>
  );
};

export default DataSourceFoldableList;
