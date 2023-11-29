import Form, {Item, Label} from 'devextreme-react/form';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import ReportFolderSelectorModal
  from '../organisms/Modal/ReportFolderSelectorModal';

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
        dataField='name'
        editorOptions={{
          height: theme.size.labelTextBoxHeight
        }}
      >
        <Label>
          {localizedString.reportName}
        </Label>
      </Item>
      <Item
        editorType='dxTextBox'
        dataField='subName'
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
        readOnly={false}
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          readOnly: false,
          text: dataSource.path,
          buttons: [dataSrcSearchBtn],
          elementAttr: {
            id: 'searchFileText'
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
      {/* SimpleItem, SearchFileTextBox Component 따로 구현
      ** 우선 Item, dxTextBox 로 사용하여 검색 버튼 구현하여 사용 하지만
      ** 검색 버튼이 textbox 의 있지 않고 외부로 독립적인 Component 로 사용한다고 한다면
      ** SearchFileTextBox Component 사용 고려
      */}
      {/* <SimpleItem
        render={SearchFileTextBox}
        dataField='reportFolder'
        editorOptions={{
          height: theme.size.labelTextBoxHeight,
          text: dataSource.fldNm,
          onClick: () => openModal(ReportFolderSelectorModal),
          createDataSource: createDataSource
        }}
      >
        <Label>
          {localizedString.selectFolder}
        </Label>
      </SimpleItem> */}
      <Item
        editorType='dxNumberBox'
        dataField='order'
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
        dataField='tag'
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
        dataField='description'
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
