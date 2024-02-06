import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  GroupItem, Item, Label
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {useRef} from 'react';
import ReportFolderSelectorModal from
  'components/report/modal/ReportFolderSelectorModal';

const FolderInformation = ({row}) => {
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
        openModal(ReportFolderSelectorModal, {
          formInstance: ref.current.instance
        });
      }
    }
  };

  return (
    <Panel title={localizedString.folderInformation}>
      <Form
        formData={row}
        ref={ref}
      >
        <GroupItem colCount={1}>
          <Item
            dataField="fldId"
            editorType="dxTextBox"
          >
            <Label>{localizedString.folderId}</Label>
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
            dataField="fldOrdinal"
            editorType="dxTextBox"
          >
            <Label>{localizedString.order}</Label>
          </Item>
        </GroupItem>
      </Form>
    </Panel>
  );
};

export default FolderInformation;
