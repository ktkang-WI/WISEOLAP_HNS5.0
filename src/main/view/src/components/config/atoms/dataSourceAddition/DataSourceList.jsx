import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useCallback, useContext} from 'react';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import {DataSourceAdditionContext} from
  'components/config/organisms/dataSourceAddition/DataSourceAddition';
import {handleRowClick} from 'components/config/utility/utility';
import {DataSource} from 'models/dataset/DataSource';

const DataSourceList = ({setRow}) => {
  // context
  const dataSourceAdditionContext = useContext(DataSourceAdditionContext);

  // state
  const [dataSource] = dataSourceAdditionContext.state.dataSource;

  const dataSourceListRef = dataSourceAdditionContext.ref.dataSourceListRef;

  const handleSelectionChanged = useCallback(({selectedRowKeys}) => {
    if (selectedRowKeys.length === 0) {
      setRow(new DataSource({}));
    }
  }, [dataSource]);

  return (
    <Wrapper>
      <Title title={localizedString.dataSourceList}></Title>
      <DataGrid
        ref={dataSourceListRef}
        dataSource={dataSource}
        showBorders={true}
        onRowClick={({data}) => handleRowClick(data, setRow)}
        onSelectionChanged={handleSelectionChanged}
        height={'90%'}
        keyExpr="dsId"
        allowColumnResizing={true}
      >
        <Selection mode="single" />
        <SearchPanel visible={true} />
        <Column
          dataField="dsNm"
          caption={localizedString.dataSourceName}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="dbmsType"
          caption={localizedString.dbType}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="ownerNm"
          caption={localizedString.owner}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="ip"
          caption={localizedString.dbAddress}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="dbNm"
          caption={localizedString.dbName}
          dataType="string"
          format="currency"
        />
        <Column
          dataField="dsViewId"
          caption={localizedString.dsViewId}
          dataType="string"
          format="currency"
          visible={false}
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(DataSourceList);
