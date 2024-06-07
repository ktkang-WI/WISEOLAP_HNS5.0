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
import useSizeObserver from '../util/hook/useSizeObserver';

// TODO: 추후개발 예정
const TreeView = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const {height, width} = useSizeObserver(ref);

  const expandedKeys = [1, 2];
  const selectedKeys = [1, 29, 42];
  return (
    <Wrapper
      ref={ref}
    >
      <TreeList
        width={width}
        height={height}
        dataSource={mart.data.data}
        showBorders={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        defaultExpandedRowKeys={expandedKeys}
        defaultSelectedRowKeys={selectedKeys}
        keyExpr="ID"
        parentIdExpr="parentId"
        id="tasks"
      >
        <SearchPanel visible={true} width={250} />
        <Selection mode="multiple" />
        <ColumnChooser enabled={true} />

        <Column dataField="name" width={300} />

      </TreeList>
    </Wrapper>
  );
};

export default React.memo(TreeView, ItemManager.commonPropsComparator);
