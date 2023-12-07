import Form, {Item, Label} from 'devextreme-react/form';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import ReportFolderSelectorModal
  from 'components/report/modal/ReportFolderSelectorModal';

const theme = getTheme();

const ReportSaveForm = ({dataSource, createDataSource, ...props}) => {
  const {openModal} = useModal();
  const dataSrcSearchBtn = {
    name: 'dataSrcSearchBtn',
    location: 'after',
    options: {
      visible: true,
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      disabled: false,
      onClick: (e) => {
        openModal(ReportFolderSelectorModal);
      }
    }
  };

  return (
    <Form
      labelMode='outside'
      labelLocation='top'
      formData={dataSource}
      readOnly={_.isEmpty(dataSource)}
      {...props}
    >
      <Item
        editorType='dxTextBox'
        dataField='reportNm'
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          elementAttr: {
            id: 'reportNm'
          }
        }}
      >
        <Label>
          {localizedString.reportName}
        </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='reportSubTitle'
        editorOptions={{
          height: theme.size.labelTextBoxHeight
        }}
      >
        <Label>
          {localizedString.reportSubName}
        </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='fldName'
        readOnly={true}
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          readOnly: true,
          text: dataSource.path,
          buttons: [dataSrcSearchBtn],
          elementAttr: {
            id: 'fldName'
          },
          onValueChanged: (e) => {
            const elementAttr = e.component.option('elementAttr');
            createDataSource({
              'fldId': elementAttr.fldId,
              'fldType': elementAttr.fldType
            });
          }
        }}
      >
        <Label>
          {localizedString.selectFolder}
        </Label>
      </Item>
      <Item
        editorType='dxNumberBox'
        dataField='reportOrdinal'
        editorOptions={{
          height: theme.size.labelTextBoxHeight
        }}
      >
        <Label>
          {localizedString.displayOrder}
        </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='reportTag'
        editorOptions={{
          height: theme.size.labelTextBoxHeight
        }}
      >
        <Label>
          {localizedString.annotation}
        </Label>
      </Item>
      <Item
        editorType='dxTextArea'
        dataField='reportDesc'
        editorOptions={{
          height: theme.size.labelTextAreaHeight
        }}
      >
        <Label>
          {localizedString.description}
        </Label>
      </Item>
    </Form>
  );
};

export default ReportSaveForm;
