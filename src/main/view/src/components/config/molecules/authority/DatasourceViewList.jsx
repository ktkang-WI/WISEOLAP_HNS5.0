import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useContext, useEffect, useState} from 'react';
import {
  AuthorityContext,
  getKeys,
  getUserOrGroup,
  getUserOrGroupOrigin,
  mode,
  path}
  from 'components/config/organisms/authority/Authority';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';

const DatasourceViewList = ({mainKey, dependency, setDsViewId}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [dataSource, setDataSource] = useState(getContext.state.dsView);
  const selected = getContext.state.selected;
  const data = getContext.state.data;
  const dataSetMode =
  currentTab === path.GROUP_DATA ? mode.GROUP : mode.USER;
  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(dataSetMode, selected);
      if (!nextId) return;
      const datas = getUserOrGroup(dataSetMode, data, nextId);
      const keys = getUserOrGroupOrigin(dataSetMode, data, nextId);
      if (!datas) {
        const newItem = {
          ...(dataSetMode === mode.GROUP ? {grpId: nextId} : {}),
          ...(dataSetMode === mode.USER ? {userNo: nextId} : {}),
          datas: []
        };
        data.next.push(newItem);
      }
      const filteredKey = keys?.datas?.filter((d) => {
        const cubeId = d?.cubeId?.length ?? 0 != 0;
        const cubeDim = d?.cubeDim?.length ?? 0 != 0;
        return cubeId || cubeDim;
      });
      const key = filteredKey?.map((d) => d.dsViewId) ?? [];
      if (key.length === 0) {
        setDataSource(dataSource.map((d) => {
          return {
            ...d,
            isAuth: false
          };
        }));
      } else {
        setDataSource(dataSource.map((d) => {
          return {
            ...d,
            isAuth: key.includes(d.dsViewId)
          };
        }));
      }
    };
    updateData();
  }, [dependency]);

  const handleSelectedKey = (selectedItems) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      setSelectedKeys([]);
    } else {
      const dsViewId = selectedItems.selectedRowKeys.length === 0 ?
        [] : selectedItems.selectedRowKeys[0].dsViewId;
      setDsViewId(dsViewId);
    }
  };

  return (
    <Wrapper>
      <Title title={localizedString.dsViewList}></Title>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        width={'90%'}
        height={'90%'}
        elementAttr={{
          class: 'datasource-view-list'
        }}
        onSelectionChanged={handleSelectedKey}
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

export default React.memo(DatasourceViewList);
