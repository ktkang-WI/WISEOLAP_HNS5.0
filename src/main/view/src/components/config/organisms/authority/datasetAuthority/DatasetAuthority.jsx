import Wrapper from
  'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {Mode} from '../data/AuthorityData';
import {useState} from 'react';
import DatasetTreeView
  from 'components/config/molecules/authority/DatasetTreeView';

const DatasetAuthority = ({auth}) => {
  const [row, setRow] = useState({});

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_DATASET ?
          <GroupList setRow={setRow}/> :
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        <DatasetTreeView row={row}/>
      </Wrapper>
    </Wrapper>
  );
};

export default DatasetAuthority;
