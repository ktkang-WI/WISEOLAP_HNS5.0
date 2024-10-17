import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import GroupList from 'components/config/molecules/authority/GroupList';
import {getTheme} from 'config/theme';
import {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import ProgList from 'components/config/molecules/authority/ProgList';

const theme = getTheme();

const GroupAppAuthority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_APP) {
      selected[mode.GROUP].prev = selected[mode.GROUP].next;
      selected[mode.GROUP].next = e.data;
    }

    setDependency((prev) => !prev);
  };

  return (
    <Wrapper display='flex' direction='row' height={theme.size.mlModalHeight}>
      <Wrapper padding='10px'>
        <GroupList onRowClick={handleRowClick} dependency={dependency}/>
      </Wrapper>
      <Wrapper padding='10px'>
        <ProgList mainKey={mainKey} dependency={dependency}/>
      </Wrapper>
    </Wrapper>
  );
};

export default GroupAppAuthority;
