import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import {useContext, useEffect, useRef, useState} from 'react';
import models from 'models';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/authority/Title';
import localizedString from 'config/localization';

const DatasourceViewList = ({row, setDsView}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);
  // state
  const [ds, setDs] = useState([]);
  const [data] = authoritycontext.state.data;
  // ref
  const ref = useRef();

  const getDsViewIdList = () => {
    let dsViewIdList = [];
    const groups = data.filter((d) => d.group);
    const users = data.filter((d) => d.user);

    if (groups.length > 0) {
      dsViewIdList = groups.find((g) => g.group.grpId === row.grpId)
          ?.dsViews.dsViewId;
    }

    if (users.length > 0) {
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
    ref.current._instance.clearSelection();
  }, [row]);

  const handleRowClick = ({data}) => {
    setDsView(data);
  };


  return (
    <Wrapper>
      <Title title={localizedString.dsViewList}></Title>
      <DataGrid
        dataSource={ds}
        showBorders={true}
        onRowClick={handleRowClick}
        height={'90%'}
        ref={ref}
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
          caption={localizedString.dsViewName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dsNm"
          caption={localizedString.dataSourceName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbmsType"
          caption={localizedString.dbType}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ownerNm"
          caption={localizedString.owner}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="ip"
          caption={localizedString.dbAddress}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dbNm"
          caption={localizedString.dbName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="dsViewId"
          caption={localizedString.dsViewId}
          dataType="varchar"
          format="currency"
          visible={false}
        />
      </DataGrid>
    </Wrapper>
  );
};

export default DatasourceViewList;
