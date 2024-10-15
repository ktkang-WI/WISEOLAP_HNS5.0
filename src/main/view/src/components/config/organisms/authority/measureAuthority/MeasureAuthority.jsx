import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {useContext, useState} from 'react';
import {AuthorityContext, mode, path} from '../Authority';
import GroupList from 'components/config/molecules/authority/GroupList';
import UserList from 'components/config/molecules/authority/UserList';
import DatasourceViewList
  from 'components/config/molecules/authority/DatasourceViewList';
import {getTheme} from 'config/theme';
import AuthorityDataMeasure
  from 'components/config/atoms/authority/AuthorityDataMeasure';
import CubeList from 'components/config/molecules/authority/CubeList';

const theme = getTheme();

const MeasureAutority = ({mainKey, ...props}) => {
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;

  const selected = getContext.state.selected;
  const [dependency, setDependency] = useState(false);
  const [dsViewId, setDsViewId] = useState();
  const [cubeId, setCubeId] = useState();

  const handleRowClick = (e) => {
    if (currentTab === path.GROUP_MEASURE) {
      selected[mode.GROUP].prev = selected[mode.GROUP].next;
      selected[mode.GROUP].next = e.data;
    } else {
      selected[mode.USER].prev = selected[mode.USER].next;
      selected[mode.USER].next = e.data;
    }
    setDependency((prev) => !prev);
    setDsViewId(0);
    setCubeId(0);
  };

  return (
    <Wrapper display='flex' direction='row' height={theme.size.mlModalHeight}>
      <Wrapper padding='10px'>
        {
          currentTab === path.GROUP_MEASURE &&
          <GroupList onRowClick={handleRowClick} dependency={dependency}/>
        }
        {
          currentTab === path.USER_MEASURE &&
          <UserList onRowClick={handleRowClick} dependency={dependency}/>
        }
      </Wrapper>
      <Wrapper display='flex' direction='column'>
        <Wrapper height="55%" padding='10px'>
          {
            (currentTab === path.GROUP_MEASURE ||
              currentTab === path.USER_MEASURE) &&
            <DatasourceViewList
              mainKey={mainKey}
              dependency={dependency}
              setCubeId={setCubeId}
              setDsViewId={setDsViewId}/>
          }
        </Wrapper>
        <Wrapper
          height="45%"
          size="3"
          display='flex'
          direction='row'
          padding='10px'
        >
          <Wrapper
            size="1"
          >
            <CubeList
              mainKey={mainKey}
              dependency={dependency}
              dsViewId={dsViewId}
              setCubeId={setCubeId}
              setDependency={setDependency}/>
          </Wrapper>
          <Wrapper
            size="1"
          >
            <AuthorityDataMeasure
              mainKey={mainKey}
              dependency={dependency}
              dsViewId={dsViewId}
              cubeId={cubeId}/>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(MeasureAutority);
