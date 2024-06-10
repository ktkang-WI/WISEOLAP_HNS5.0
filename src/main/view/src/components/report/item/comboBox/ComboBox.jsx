import React, {useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {SelectBox} from 'devextreme-react';
import useSizeObserver from '../util/hook/useSizeObserver';
import {useInteractiveEffect} from '../util/useInteractiveEffect';

const ComboBox = ({setItemExports, id, item}) => {
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
  const {width} = useSizeObserver(ref);
  const handlePaginationValue = (e) => {
    const selectedItemKey = e.value.arg;
    functions.setDataMasterFilter(selectedItemKey);
    functions.masterFilterReload(e);
  };
  return (
    <Wrapper
      ref={ref}
    >
      <SelectBox
        width={width}
        items={mart.data.data}
        defaultValue={''}
        displayExpr='arg'
        keyExpr='arg'
        onValueChanged={handlePaginationValue}
      />
    </Wrapper>
  );
};

export default React.memo(ComboBox, ItemManager.commonPropsComparator);
