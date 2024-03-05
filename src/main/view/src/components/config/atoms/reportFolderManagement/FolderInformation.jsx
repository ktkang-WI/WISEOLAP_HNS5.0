import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Item, Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import FolderListModal from './modal/FolderListModal';
import {useRef} from 'react';

const FolderInformation = ({row, setRow}) => {
  const {openModal} = useModal();
  const ref = useRef();

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
        ref={ref}
        elementAttr={{
          class: 'folder-information'
        }}
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
