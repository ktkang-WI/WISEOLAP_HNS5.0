import React, {useCallback, useRef, useState} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {List} from 'devextreme-react';
import {useInteractiveEffect} from '../util/useInteractiveEffect';

const ListBox = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  const meta = item?.meta;
  if (!mart.init) {
    return <></>;
  }

  const {
    functions
  } = useInteractiveEffect({
    item: item,
    meta: meta,
    selectionFunc: (event) => {
      event?.forEach((e) => e?.target?.selected(true));
    }
  });

  const ref = useRef();
  const [selectionMode] = useState('all');
  const [selectAllMode] = useState('page');
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);
  const [selectByClick] = useState(false);

  const handleOnItemClick = useCallback((e) => {
    const selectedItemKey = e.itemData.arg;
    const index = selectedItemKeys.indexOf(selectedItemKey);
    if (index === -1) {
      setSelectedItemKeys([...selectedItemKeys, selectedItemKey]);
    } else {
      setSelectedItemKeys(selectedItemKeys.filter((key) =>
        key !== selectedItemKey));
    }

    functions.setDataMasterFilter(selectedItemKey);
    functions.masterFilterReload(e);
  }, [selectedItemKeys, setSelectedItemKeys, functions]);

  const onSelectedItemKeysChange = useCallback((e) => {
    if (e.name === 'selectedItemKeys') {
      if (selectionMode !== 'none' || selectedItemKeys.length !== 0) {
        const selectedItemKeyAdd =
          e.value.find((v) => !e.previousValue.includes(v));
        const selectedItemKeyRemove =
          e.previousValue.find((v) => !e.value.includes(v));

        setSelectedItemKeys(e.value);
        functions.setDataMasterFilter(
            selectedItemKeyAdd || selectedItemKeyRemove);
        functions.masterFilterReload(e);
      }
    }
  }, [selectionMode, selectedItemKeys, setSelectedItemKeys]);

  return (
    <Wrapper
      ref={ref}
    >
      <List
        dataSource={mart.data.data}
        height={400}
        showSelectionControls={true}
        selectionMode={selectionMode}
        selectAllMode={selectAllMode}
        selectedItemKeys={selectedItemKeys}
        displayExpr='arg'
        keyExpr='arg'
        selectByClick={selectByClick}
        onItemClick={handleOnItemClick}
        onOptionChanged={onSelectedItemKeysChange}
      />
    </Wrapper>
  );
};

export default React.memo(ListBox, ItemManager.commonPropsComparator);
