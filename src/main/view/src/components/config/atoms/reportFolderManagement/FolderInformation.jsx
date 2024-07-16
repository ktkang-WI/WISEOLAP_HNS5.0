import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Item, Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import FolderListModal from './modal/FolderListModal';
import React from 'react';

const FolderInformation = ({row, setRow, myPageFlag}, ref) => {
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
        if (Object.keys(row).length > 0) {
          openModal(FolderListModal, {
            row: row,
            setRow: setRow,
            myPageFlag: myPageFlag
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
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'100%'}
        elementAttr={{
          class: 'folder-information dx-fieldset custom-scrollbar'
        }}
      >
        <SimpleItem
          dataField={myPageFlag? 'id': 'fldId'}
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
            dataField={myPageFlag? 'name': 'fldNm'}
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
          <Label>{localizedString.folderManagement}</Label>
        </SimpleItem>
        <Item
          dataField={myPageFlag? 'ordinal': 'fldOrdinal'}
          editorType="dxTextBox"
        >
          <Label>{localizedString.order}</Label>
        </Item>
      </Form>
    </Panel>
  );
};

export default React.forwardRef(FolderInformation);
