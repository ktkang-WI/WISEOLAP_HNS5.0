import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import FolderListModal from './modal/FolderListModal';

const ReportInformation = ({row, setRow}) => {
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
        openModal(FolderListModal, {
          row: row,
          setRow: setRow,
          type: 'report'
        });
      }
    }
  };

  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={row}
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'100%'}
        elementAttr={{
          class: 'report-information dx-fieldset custom-scrollbar'
        }}
      >
        <SimpleItem
          dataField="reportId"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportId}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportNm"
          editorType="dxTextBox"
        >
          <RequiredRule message={localizedString.validationReportNm}/>
          <Label>{localizedString.reportName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportSubTitle"
          editorType="dxTextBox"
        >
          <Label>{localizedString.reportSubName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportType"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportType}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="fldParentNm"
          editorType="dxTextBox"
          readOnly={true}
          editorOptions={{
            readOnly: true,
            buttons: [folderSearchBtn],
            elementAttr: {
              id: 'fldParentName'
            }
          }}
        >
          <RequiredRule message={localizedString.validationFolderSelect}/>
          <Label>{localizedString.folderManagement}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="regDt"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.registerDate}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportTag"
          editorType="dxTextBox"
        >
          <Label>{localizedString.annotation}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportOrdinal"
          editorType="dxTextBox"
        >
          <Label>{localizedString.order}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportDesc"
          editorType="dxTextBox"
        >
          <Label>{localizedString.description}</Label>
        </SimpleItem>
      </Form>
    </Panel>
  );
};

export default ReportInformation;
