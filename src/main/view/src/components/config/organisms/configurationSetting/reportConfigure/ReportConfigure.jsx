import {Form} from 'devextreme-react';
import {GroupItem, Item, Label} from 'devextreme-react/form';
import localizedString from 'config/localization';
import {ConfigureContext} from '../ConfigurationSetting';
import {useContext} from 'react';
import {AdHocLayoutTypes} from 'components/config/configType';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {labelTemplate} from '../generalConfigure/GeneralConfigure';
import {getTheme} from 'config/theme';

const theme = getTheme();
const ReportConfigure = () => {
  const getContext = useContext(ConfigureContext);
  const [general] = getContext.state.general;

  return (
    <Wrapper
      maxWidth={theme.size.bigConfigMaxWidth}
      padding='20px 100px 0px 30px'
    >
      <Form
        formData={general}
      >
        <GroupItem colCount={1}>
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
          >
            <Label
              text={localizedString.adhocSetting}
              alignment='start'
              render={labelTemplate('description')} />
          </Item>
        </GroupItem>
      </Form>
    </Wrapper>
  );
};

export default ReportConfigure;
