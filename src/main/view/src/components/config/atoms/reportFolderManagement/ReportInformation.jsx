import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import {TextArea} from 'devextreme-react';
import Form, {
  Item, Label
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {ReportFolderContext} from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import {useContext} from 'react';
import FolderListModal from './modal/FolderListModal';

const ReportInformation = ({row, setRow}) => {
  const {openModal} = useModal();
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const reportListRef = reportFolderContext.ref.reportListRef;
  const reportInformationRef = reportFolderContext.ref.reportInformationRef;

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
          infoInstance: reportInformationRef.current._instance,
          listInstance: reportListRef.current._instance,
          setRow: setRow
        });
      }
    }
  };

  return (
    <Panel title={localizedString.reportInformation}>
      <Form
        formData={row}
        ref={reportInformationRef}
      >
        <Item
          dataField="reportId"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportId}</Label>
        </Item>
        <Item
          dataField="reportNm"
          editorType="dxTextBox"
        >
          <Label>{localizedString.reportName}</Label>
        </Item>
        <Item
          dataField="reportSubTitle"
          editorType="dxTextBox"
        >
          <Label>{localizedString.reportSubName}</Label>
        </Item>
        <Item
          dataField="reportType"
          editorType="dxTextBox"
        >
          <Label>{localizedString.reportType}</Label>
        </Item>
        <Item
          dataField="fldNm"
          editorType="dxTextBox"
          readOnly={true}
          editorOptions={{
            readOnly: true,
            buttons: [folderSearchBtn],
            elementAttr: {
              id: 'fldName'
            },
            onValueChanged: (e) => {
              const elementAttr = e.component.option('elementAttr');
              console.log(elementAttr);
            }
          }}
        >
          <Label>{localizedString.folderManagement}</Label>
        </Item>
        <Item
          dataField="publisher"
          editorType="dxTextBox"
        >
          <Label>{localizedString.publisher}</Label>
        </Item>
        <Item
          dataField="regDt"
          editorType="dxTextBox"
        >
          <Label>{localizedString.RegisterDate}</Label>
        </Item>
        <Item
          dataField="reportTag"
          editorType="dxTextBox"
        >
          <Label>{localizedString.annotation}</Label>
        </Item>
        <Item
          dataField="fldOrdinal"
          editorType="dxTextBox"
        >
          <Label>{localizedString.order}</Label>
        </Item>
        <Item
          dataField="reportDesc"
          editorType="dxTextBox"
        >
          <TextArea
            height={100}
            width="100%"
          />
          <Label>{localizedString.description}</Label>
        </Item>
      </Form>
    </Panel>
  );
};

export default ReportInformation;
