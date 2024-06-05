import React, {useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {TreeList} from 'devextreme-react';
import {
  Column,
  ColumnChooser,
  SearchPanel,
  Selection
} from 'devextreme-react/tree-list';

const TreeView = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);

  console.log(height);
  console.log(width);
  const expandedKeys = [1, 2];
  const selectedKeys = [1, 29, 42];
  return (
    <Wrapper
      ref={ref}
    >
      <TreeList
        dataSource={dataSourceOptions}
        showBorders={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        defaultExpandedRowKeys={expandedKeys}
        defaultSelectedRowKeys={selectedKeys}
        keyExpr="Task_ID"
        parentIdExpr="Task_Parent_ID"
        id="tasks"
      >
        <SearchPanel visible={true} width={250} />
        <Selection mode="multiple" />
        <ColumnChooser enabled={true} />

        <Column dataField="arg" width={300} />

      </TreeList>
    </Wrapper>
  );
};

export default React.memo(TreeView, ItemManager.commonPropsComparator);
