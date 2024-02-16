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
          setRow: setRow
        });
      }
    }
  };

  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={row}
        elementAttr={{
          class: 'report-information'
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
        >
          <Label>{localizedString.reportType}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="fldNm"
          editorType="dxTextBox"
          readOnly={true}
          editorOptions={{
            readOnly: true,
            buttons: [folderSearchBtn],
            elementAttr: {
              id: 'fldName'
            }
          }}
        >
          <RequiredRule message={localizedString.validationFolderSelect}/>
          <Label>{localizedString.folderManagement}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="publisher"
          editorType="dxTextBox"
        >
          <Label>{localizedString.publisher}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="regDt"
          editorType="dxTextBox"
        >
          <Label>{localizedString.RegisterDate}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportTag"
          editorType="dxTextBox"
        >
          <Label>{localizedString.annotation}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="fldOrdinal"
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
