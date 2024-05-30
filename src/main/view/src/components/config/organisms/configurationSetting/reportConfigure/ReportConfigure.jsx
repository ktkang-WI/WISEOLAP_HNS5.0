import {Form} from 'devextreme-react';
import {GroupItem, Item} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import {AdHocLayoutTypes} from 'components/config/configType';

const ReportConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;

  return (
    <Form
      formData={general}
    >
      <GroupItem colCount={1} caption={localizedString.adhocSetting}>
        <Item
          dataField='adHocLayout'
          editorType='dxSelectBox'
          editorOptions={{
            items: localizedString.adHocLayoutOptions,
            valueExpr: 'id',
            displayExpr: 'text',
            value: AdHocLayoutTypes[general.adHocLayout],
            onValueChanged: (e) => {
              general.adHocLayout = AdHocLayoutTypes[e.value];
            }
          }}
        ></Item>
      </GroupItem>
    </Form>
  );
};

export default ReportConfigure;
