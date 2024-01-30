import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import {Mode} from '../data/AuthorityData';

const ReportAuthority = ({auth}) => {
  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        {
          auth.mode === Mode.GROUPREPORT ?
          <GroupList/> :
          <UserList/>
        }
      </Wrapper>
      <Wrapper padding='10px'>

      </Wrapper>
    </Wrapper>
  );
};

export default ReportAuthority;
