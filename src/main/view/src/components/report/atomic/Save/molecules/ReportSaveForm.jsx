import Form, {Item, Label} from 'devextreme-react/form';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import ReportFolderSelectorModal
  from 'components/report/modal/ReportFolderSelectorModal';
import styled from 'styled-components';
import {DesignerMode} from 'components/config/configType';

const theme = getTheme();

const StyledForm = styled(Form)`
  .dx-field-item-custom-label-content:before {
    content: '';
    width: 0px;
  }

  .dx-field-item-custom-label-content {
    padding: 10px 5px;
    color: ${theme.color.gray400};
  }

`;

const ReportSaveForm = ({dataSource, createDataSource, formRef, isCube,
  designerMode, ...props}) => {
  const {openModal} = useModal();

  const folderSearchBtn = {
    name: 'folderSearchBtn',
    location: 'after',
    options: {
      visible: true,
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      disabled: false,
      onClick: (e) => {
        openModal(ReportFolderSelectorModal, {
          formInstance: formRef.current.instance
        });
      }
    }
  };

  return (
    <StyledForm
      labelMode='outside'
      labelLocation='top'
      formData={dataSource}
      readOnly={_.isEmpty(dataSource)}
      ref={formRef}
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
          buttons: [folderSearchBtn],
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
        editorType='dxTextBox'
        dataField='requester'
        editorOptions={{
          height: theme.size.labelTextBoxHeight
        }}
      >
        <Label>
          {localizedString.requester}
        </Label>
      </Item>
      <Item
        editorType='dxCheckBox'
        dataField='promptYn'
      >
        <Label>
          {localizedString.checkingInitReportRetrieval}
        </Label>
      </Item>
      {
        (designerMode === DesignerMode['AD_HOC']) &&
        isCube &&
        <Item
          editorType='dxCheckBox'
          dataField='maxReportPeriodYn'
        >
          <Label>
            {localizedString.maxReportPeriodYn}
          </Label>
        </Item>
      }
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
    </StyledForm>
  );
};

export default ReportSaveForm;
