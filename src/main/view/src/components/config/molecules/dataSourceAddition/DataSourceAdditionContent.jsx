import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import DataSourceInformation from
  'components/config/atoms/dataSourceAddition/DataSourceInformation';
import DataSourceList from
  'components/config/atoms/dataSourceAddition/DataSourceList';
import React, {useState} from 'react';

const DataSourceAdditionContent = ({data}) => {
  const [row, setRow] = useState({});

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        <DataSourceList setRow={setRow}/>
      </Wrapper>
      <Wrapper padding='10px'>
        <DataSourceInformation row={row}/>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DataSourceAdditionContent);
