import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import {useContext, useEffect, useState} from 'react';
import models from 'models';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';

const DatasourceViewList = ({row, setDsView}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);
  // state
  const [ds, setDs] = useState([]);
  const [data] = authoritycontext.state.data;

  const getDsViewIdList = () => {
    let dsViewIdList = [];
    const groups = data.filter((d) => d.group);
    const users = data.filter((d) => d.user);

    if (groups.length > 0) {
      console.log(row);
      dsViewIdList = groups.find((g) => g.group.grpId === row.grpId)
          ?.dsViews.dsViewId;
    }

    if (users.length > 0) {
      console.log(row);
      dsViewIdList = users.find((u) => u.user.userNo === row.userNo)
          ?.dsViews.dsViewId;
    }

    return dsViewIdList ? dsViewIdList : [];
  };

  useEffect(() => {
    models.Authority.getDs()
        .then((response) => {
          setDs(response.data.data);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const dsViewIdList = getDsViewIdList();
    const newDs = ds.map((ds) => {
      return {
        ...ds,
        isAuth: dsViewIdList?.includes(ds.dsViewId) ? true: false
      };
    });
    setDs(newDs);
  }, [row]);

  const handleRowClick = ({data}) => {
    setDsView(data);
  };

  return (
    <Wrapper>
      <Title title={'데이터 원본 뷰 목록'}></Title>
      <DataGrid
        dataSource={ds}
        showBorders={true}
        onRowClick={handleRowClick}
        height={'90%'}
      >
        <Selection mode="single" />
        <SearchPanel visible={true} />
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
          dataField="dsViewNm"
          caption="데이터 원본 뷰 명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dsNm"
          caption="데이터 원본 명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbmsType"
          caption="DB 유형"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ownerNm"
          caption="소유자"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ip"
          caption="서버 주소(명)"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbNm"
          caption="DB 명"
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dsViewId"
          caption="데이터 원본 뷰 id"
          dataType="varchar"
          format="currency"
          visible={false}
        />
      </DataGrid>
    </Wrapper>
  );
};

export default DatasourceViewList;
