import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {Mode} from '../data/AuthorityData';
import FolderTreeView
  from 'components/config/molecules/authority/FolderTreeView';
import {useState} from 'react';

const ReportAuthority = ({auth}) => {
  const [row, setRow] = useState();

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_REPORT ?
          <GroupList setRow={setRow}/> :
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        <FolderTreeView row={row}/>
      </Wrapper>
    </Wrapper>
  );
};

export default ReportAuthority;
