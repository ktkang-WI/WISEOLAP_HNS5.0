import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {Mode} from '../data/AuthorityData';
import FolderTreeView
  from 'components/config/molecules/authority/FolderTreeView';
import React, {useState} from 'react';

const ReportAuthority = ({data}) => {
  const [row, setRow] = useState();
  const auth = data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUP_REPORT &&
          <GroupList setRow={setRow}/>
        }
        {
          auth.mode === Mode.USER_REPORT &&
          <UserList setRow={setRow}/>
        }
      </Wrapper>
      <Wrapper padding='10px'>
        {
          (auth.mode === Mode.GROUP_REPORT ||
          auth.mode === Mode.USER_REPORT) &&
          <FolderTreeView row={row}/>
        }
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ReportAuthority);
