import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useContext, useEffect, useState} from 'react';
import {
  AuthorityContext,
  getDataObjectOfUserOrGroup,
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
  const [selectedKeys, setSelectedKeys] = useState();
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
          ...getDataObjectOfUserOrGroup(dataSetMode, nextId),
          datas: []
        };
        data.next.push(newItem);
      }
      const filteredKey = keys?.datas?.filter((cube) => {
        const cubeId = cube?.cubeId?.length ?? 0 != 0;
        const dsViewDim = cube?.dsViewDim?.length ?? 0 != 0;
        return cubeId || dsViewDim;
      });
      const key = filteredKey?.map((cube) => cube.dsViewId) ?? [];
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
    setSelectedKeys([]);
    updateData();
  }, [dependency]);

  const handleSelectedKey = (selectedItems) => {
    if (!selected?.user?.next && !selected?.group?.next) {
      alert(localizedString.clickMe);
      setDsViewId(0);
      setSelectedKeys([]);
    } else {
      const dsViewId = selectedItems.selectedRowKeys[0];
      setDsViewId(dsViewId);
      setSelectedKeys([dsViewId]);
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
        keyExpr={'dsViewId'}
        selectedRowKeys={selectedKeys}
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
