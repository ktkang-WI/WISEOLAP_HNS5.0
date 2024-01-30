import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import {useContext, useEffect, useRef, useState} from 'react';
// import {useContext} from 'react';
// import {AuthorityContext} from '../Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import {AuthorityDataContext} from
  'components/config/organisms/authority/dataAuthority/DataAuthority';

const GroupList = () => {
  // context
  const authoritycontext = useContext(AuthorityContext);
  const authorityDataContext = useContext(AuthorityDataContext);
  // state
  const [groups, setGroups] = useState([]);
  const [data] = authoritycontext.state.data;
  const [, setRow] = authorityDataContext.state.row;

  useEffect(() => {
    models.Authority.getGroups()
        .then((response) => {
          const authGrpIdList = data.map((row) => row.group.grpId);
          const newGroups = response.data.data.map((row) => {
            return {
              ...row,
              isAuth: authGrpIdList.includes(row.grpId) ? true: false
            };
          });
          setGroups(newGroups);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  const ref = useRef();
  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <DataGrid
      height={'100%'}
      dataSource={groups}
      showBorders={true}
      onRowClick={handleRowClick}
      ref={ref}
    >
      <Selection mode="single" />
      <Column
        dataField="isAuth"
        caption=""
        dataType="varchar"
        format="currency"
        width="30px"
        cellRender={({value}) => {
          if (value) {
            return <img height={'15px'} src={passwordIcon}/>;
          }
        }}
      />
      <Column
        dataField="grpNm"
        caption="그룹 명"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="grpDesc"
        caption="설명"
        dataType="varchar"
        format="currency"
      />
    </DataGrid>
  );
};

export default GroupList;
