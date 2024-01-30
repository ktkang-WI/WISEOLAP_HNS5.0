import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import {useContext, useEffect, useState} from 'react';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';

const GroupList = ({setRow}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [groups, setGroups] = useState([]);
  const [data] = authoritycontext.state.data;

  useEffect(() => {
    const dataGroups = data.filter((row)=>row.group);
    if (dataGroups.length > 0) {
      models.Authority.getGroups()
          .then((response) => {
            const authGrpIdList = dataGroups.map((row) => row.group.grpId);
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
    }
  }, []);

  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <Wrapper>
      <Title title={'그룹 목록'}></Title>
      <DataGrid
        height={'90%'}
        dataSource={groups}
        showBorders={true}
        onRowClick={handleRowClick}
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
    </Wrapper>
  );
};

export default GroupList;
