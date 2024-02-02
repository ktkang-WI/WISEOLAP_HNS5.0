import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import React, {useState} from 'react';
import {Mode} from '../data/AuthorityData';
import DatasourceList from
  'components/config/molecules/authority/DatasourceList';

const DatasourceAuthority = ({data}) => {
  const [row, setRow] = useState({});
  const auth = data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_DATASOURCE &&
          <GroupList setRow={setRow}/>
        }
        {
          auth.mode === Mode.USER_DATASOURCE &&
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (auth.mode === Mode.GROUP_DATASOURCE ||
          auth.mode === Mode.USER_DATASOURCE) &&
          <DatasourceList row={row}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DatasourceAuthority);
