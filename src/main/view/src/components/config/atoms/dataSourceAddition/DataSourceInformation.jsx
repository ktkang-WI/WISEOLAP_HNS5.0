import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Label, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {useContext, useState} from 'react';
import {DataSourceAdditionContext} from
  'components/config/organisms/dataSourceAddition/DataSourceAddition';
import {RequiredRule} from 'devextreme-react/data-grid';

const DataSourceInformation = ({row}) => {
  // context
  const dataSourceAdditionContext = useContext(DataSourceAdditionContext);

  // ref
  const dataInformationRef = dataSourceAdditionContext.ref.dataInformationRef;
  const [dbType, setDbType] = useState('');

  return (
    <Panel title={localizedString.dataSourceInfo}>
      <Form
        ref={dataInformationRef}
        formData={row}
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'100%'}
        elementAttr={{
          class: 'dx-fieldset custom-scrollbar'
        }}
      >
        <SimpleItem
          dataField="dsNm"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationDsNm}/>
          <Label>{localizedString.dataSourceName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="ip"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationIp}/>
          <Label>{localizedString.dbAddress}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="dbNm"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationDbNm}/>
          <Label>{localizedString.dbName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="dbmsType"
          editorType="dxSelectBox"
          editorOptions={{
            dataSource: ['ORACLE', 'MS-SQL', 'MARIA', 'DB2BLU'],
            onValueChanged: ({value}) => {
              setDbType(value);
            }
          }}
        >
          <RequiredRule message={localizedString.validationDbmsType}/>
          <Label>{localizedString.dbType}</Label>
        </SimpleItem>
        {
          dbType === 'ORACLE' &&
          <SimpleItem
            dataField="connectorType"
            editorType="dxSelectBox"
            editorOptions={{
              dataSource: ['SID', 'SERVICE NAME']
            }}
          >
            <RequiredRule message={localizedString.validationDbmsType}/>
            <Label>{localizedString.connType}</Label>
          </SimpleItem>
        }
        <SimpleItem
          dataField="ownerNm"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationOwnerNm}/>
          <Label>{localizedString.owner}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="port"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationPort}/>
          <Label>{localizedString.port}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="userId"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationUserId}/>
          <Label>{'접속 ID'}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="password"
          editorType="dxTextBox"
          editorOptions={{
            mode: 'password'
          }}
        >
          <RequiredRule message={localizedString.validationPassword}/>
          <Label>{'접속 암호'}</Label>
        </SimpleItem>
        {/* <Item
          editorType="dxButton"
          editorOptions={{
            text: '연결 테스트'
          }}
        >
        </Item> */}
      </Form>
    </Panel>
  );
};

export default DataSourceInformation;
