import DataGrid, {Column, SearchPanel, Selection}
  from 'devextreme-react/data-grid';
import React, {useContext} from 'react';

import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import {DataSourceAdditionContext} from
  'components/config/organisms/dataSourceAddition/DataSourceAddition';

const DataSourceList = ({setRow}) => {
  // context
  const dataSourceAdditionContext = useContext(DataSourceAdditionContext);

  // state
  const [dataSource] = dataSourceAdditionContext.state.dataSource;

  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <Wrapper>
      <Title title={localizedString.dataSourceList}></Title>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        onRowClick={handleRowClick}
        height={'90%'}
        keyExpr="dsId"
      >
        <Selection mode="single" />
        <SearchPanel visible={true} />
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

export default React.memo(DataSourceList);
