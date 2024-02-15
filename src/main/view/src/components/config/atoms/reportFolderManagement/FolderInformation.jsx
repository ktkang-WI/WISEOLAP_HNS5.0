import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Item, Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {useContext} from 'react';
import {ReportFolderContext} from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import FolderListModal from './modal/FolderListModal';

const FolderInformation = ({row, setRow}) => {
  const {openModal} = useModal();
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const folderInformationRef = reportFolderContext.ref.folderInformationRef;

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
        if (Object.keys(row).length > 0) {
          openModal(FolderListModal, {
            infoInstance: folderInformationRef.current._instance,
            row: row,
            setRow: setRow
          });
        }
      }
    }
  };

  return (
    <Panel title={localizedString.folderInformation}>
      <Form
        formData={row}
        ref={folderInformationRef}
      >
        <SimpleItem
          dataField="fldId"
          editorOptions= {{
            disabled: true,
            mode: 'number'
          }}
        >
          <Label>{localizedString.folderId}</Label>
        </SimpleItem>
        {
          (!row.fldId || row.fldId === '') &&
          <SimpleItem
            dataField="fldNm"
            editorType="dxTextBox"
          >
            <RequiredRule message={localizedString.valiedationFolderNm}/>
            <Label>{localizedString.folderNm}</Label>
          </SimpleItem>
        }
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
        <Item
          dataField="fldOrdinal"
          editorType="dxTextBox"
        >
          <Label>{localizedString.order}</Label>
        </Item>
      </Form>
    </Panel>
  );
};

export default FolderInformation;
