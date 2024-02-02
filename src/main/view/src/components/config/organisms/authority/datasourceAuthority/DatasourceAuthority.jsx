import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {useState} from 'react';
import {Mode} from '../data/AuthorityData';
import DatasourceList from
  'components/config/molecules/authority/DatasourceList';

const DatasourceAuthority = ({auth}) => {
  const [row, setRow] = useState({});

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_DATASOURCE ?
          <GroupList setRow={setRow}/> :
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        <DatasourceList row={row}/>
      </Wrapper>
    </Wrapper>
  );
};

export default DatasourceAuthority;
