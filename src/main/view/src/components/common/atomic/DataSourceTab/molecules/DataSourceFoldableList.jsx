import {TreeView} from 'devextreme-react';
import {getTheme} from 'config/theme';
import Wrapper from '../../Common/Wrap/Wrapper';
import tempData from './DataSourceFoldableListTempData';
import cubeMeaGrpImg from
  '../../../../../assets/image/icon/dataSource/cube_measure.png';
import cubeDimGrpImg from
  '../../../../../assets/image/icon/dataSource/cube_dimension.png';
import meaImg from '../../../../../assets/image/icon/dataSource/measure.png';
import dimImg from '../../../../../assets/image/icon/dataSource/dimension.png';
import {useState} from 'react';
import {styled} from 'styled-components';
import DataColumn from '../../DataColumnTab/molecules/DataColumn';
import {Droppable, Draggable} from 'react-beautiful-dnd';
import {useRef} from 'react';

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
const DataSourceFoldableList = () => {
  const ref = useRef();

  const getTreeViewData = (data) => {
    // 주제영역일 경우
    const cubeMeasure = data.measures.reduce((acc, meaGrp) => {
      const measureGrp = {
        ...meaGrp,
        type: 'meaGrp',
        name: meaGrp.logicalName,
        icon: cubeMeaGrpImg
      };

      const measures = meaGrp.columns.map((col) => {
        return {
          ...col,
          type: 'mea',
          name: col.captionName,
          icon: meaImg
        };
      });

      acc.push(measureGrp, ...measures);
      return acc;
    }, []);

    const cubeDimension = data.dimensions.reduce((acc, dimGrp) => {
      const dimensionGrp = {
        ...dimGrp,
        type: 'dimGrp',
        name: dimGrp.logicalName,
        icon: cubeDimGrpImg
      };

      const dimensions = dimGrp.columns.map((col) => {
        return {
          ...col,
          type: 'dim',
          name: col.captionName,
          icon: dimImg
        };
      });

      acc.push(dimensionGrp, ...dimensions);
      return acc;
    }, []);

    return cubeMeasure.concat(cubeDimension);
  };

  const getRenderItem = (items) => {
    const getDraggableItem = (provided, snapshot, rubric) => {
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

  const [data] = useState(getTreeViewData(tempData));

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
              ref={ref}
              items={data}
              dataStructure="plain"
              displayExpr="name"
              parentIdExpr="tableName"
              keyExpr="uniqueName"
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
