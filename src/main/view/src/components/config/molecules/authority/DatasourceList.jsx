import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import {useContext, useEffect, useState} from 'react';
import models from 'models';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';

const DatasourceList = ({row}) => {
  // context
  const authorityContext = useContext(AuthorityContext);
  // state
  const [ds, setDs] = useState([]);
  const [data] = authorityContext.state.data;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getDsIdList = () => {
    let dsIdList = [];
    const groups = data.filter((d) => d.group);
    const users = data.filter((d) => d.user);

    if (groups.length > 0) {
      const dsList = groups.find((g) => g.group.grpId === row?.grpId)
          ?.ds;
      dsIdList = dsList?.map((ds) => ds.dsId);
    }

    if (users.length > 0) {
      const dsList = users.find((u) => u.user.userNo === row?.userNo)
          ?.ds;
      dsIdList = dsList?.map((ds) => ds.dsId);
    }

    return dsIdList ? dsIdList : [];
  };

  useEffect(() => {
    models.Authority.getDs()
        .then((response) => {
          const newDs = response.data.data.reduce((acc, v) => {
            const dsIdList = acc.map((row) => row.dsId);
            if (!dsIdList.includes(v.dsId)) {
              acc.push(v);
            }
            return acc;
          }, []);
          setDs(newDs);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const dsIdList = getDsIdList();
    setSelectedRowKeys(dsIdList);
  }, [row]);

  const handleRowClick = ({data}) => {
    // setDsView(data);
  };

  return (
    <Wrapper>
      <Title title={'데이터 원본 목록'}></Title>
      <DataGrid
        dataSource={ds}
        showBorders={true}
        onRowClick={handleRowClick}
        height={'90%'}
        keyExpr="dsId"
        selectedRowKeys={selectedRowKeys}
      >
        <Selection mode="multiple" />
        <SearchPanel visible={true} />
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

export default DatasourceList;
