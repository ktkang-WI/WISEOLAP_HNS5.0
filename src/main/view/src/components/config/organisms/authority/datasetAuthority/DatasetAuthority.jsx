import Wrapper from
  'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {Mode} from '../data/AuthorityData';
import React, {useState} from 'react';
import DatasetTreeView
  from 'components/config/molecules/authority/DatasetTreeView';

const DatasetAuthority = ({data}) => {
  const [row, setRow] = useState({});
  const auth = data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_DATASET &&
          <GroupList setRow={setRow}/>
        }
        {
          auth.mode === Mode.USER_DATASET &&
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (auth.mode === Mode.GROUP_DATASET ||
            auth.mode === Mode.USER_DATASET) && <DatasetTreeView row={row}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(DatasetAuthority);
