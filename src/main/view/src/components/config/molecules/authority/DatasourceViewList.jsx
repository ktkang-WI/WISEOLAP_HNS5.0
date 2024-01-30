import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import {useContext, useEffect, useRef, useState} from 'react';
import models from 'models';
import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import {AuthorityDataContext}
  from 'components/config/organisms/authority/dataAuthority/DataAuthority';

const DatasourceViewList = () => {
  // context
  const authoritycontext = useContext(AuthorityContext);
  const authorityDataContext = useContext(AuthorityDataContext);
  // state
  const [ds, setDs] = useState([]);
  const [data] = authoritycontext.state.data;
  const [row] = authorityDataContext.state.row;

  console.log(data);

  useEffect(() => {
    models.Authority.getDs()
        .then((response) => {
          console.log(response.data.data);
          console.log(row);
          setDs(response.data.data);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const dsViewIdList = data.find((d) => d.group.grpId === row.grpId)
        ?.dsViews.dsViewId;
    const newDs = ds.map((ds) => {
      return {
        ...row,
        isAuth: dsViewIdList?.includes(ds.dsViewId) ? true: false
      };
    });
    setDs(newDs);
  }, [row]);

  const ref = useRef();
  const handleRowClick = () => {
    return;
  };

  return (
    <DataGrid
      height={'100%'}
      dataSource={ds}
      showBorders={true}
      onRowClick={handleRowClick}
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
    </DataGrid>
  );
};

export default DatasourceViewList;
