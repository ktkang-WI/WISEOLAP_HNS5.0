import React, {useRef, useState} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {List} from 'devextreme-react';

const ListBox = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const [selectionMode] = useState('all');
  const [selectAllMode] = useState('page');
  const [selectedItemKeys] = useState([]);
  const [selectByClick] = useState(false);
  const {height, width} = useSizeObserver(ref);
  console.log(height);
  console.log(width);

  /*
  const dataSource = new ArrayStore({
    key: 'id',
    data: tasks,

    
  { id: 6, text: '2016 Brochure Designs' },
  { id: 7, text: 'Brochure Design Review' },
  }); */

  const onSelectedItemKeysChange = (e) => {

  };
  return (
    <Wrapper
      ref={ref}
    >
      <List
        dataSource={dataSource}
        height={400}
        showSelectionControls={true}
        selectionMode={selectionMode}
        selectAllMode={selectAllMode}
        selectedItemKeys={selectedItemKeys}
        selectByClick={selectByClick}
        onOptionChanged={onSelectedItemKeysChange}>
      </List>
    </Wrapper>
  );
};

export default React.memo(ListBox, ItemManager.commonPropsComparator);
