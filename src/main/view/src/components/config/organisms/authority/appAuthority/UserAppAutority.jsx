import {getTheme} from 'config/theme';
import {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import UserList from 'components/config/molecules/authority/UserList';
import ProgList from 'components/config/molecules/authority/ProgList';

const theme = getTheme();

const UserAppAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);

  const handleRowClick = (e) => {
    if (currentTab === path.USER_APP) {
      selected[mode.USER].prev = selected[mode.USER].next;
      selected[mode.USER].next = e.data;
    }

    setDependency((prev) => !prev);
  };
  return (
    <Wrapper display='flex' direction='row' height={theme.size.mlModalHeight}>
      <Wrapper padding='10px'>
        <UserList onRowClick={handleRowClick} dependency={dependency}/>
      </Wrapper>
      <Wrapper padding='10px'>
        <ProgList mainKey={mainKey} dependency={dependency}/>
      </Wrapper>
    </Wrapper>
  );
};

export default UserAppAuthority;
