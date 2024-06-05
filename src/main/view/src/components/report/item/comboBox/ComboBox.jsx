import React, {useRef} from 'react';
import ItemManager from 'components/report/item/util/ItemManager';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {SelectBox} from 'devextreme-react';

const ComboBox = ({setItemExports, id, item}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  const ref = useRef();
  const {width} = useSizeObserver(ref);
  return (
    <Wrapper
      ref={ref}
    >
      <SelectBox
        width={width}
        items={[...pageUsageOfPageCount.pageSizes]}
        defaultValue={''}
        // onValueChanged={handlePaginationValue}
      />
    </Wrapper>
  );
};

export default React.memo(ComboBox, ItemManager.commonPropsComparator);
