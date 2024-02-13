import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Item, Label, SimpleItem
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
            <Label>{localizedString.folderNm}</Label>
          </SimpleItem>
        }
        <Item
          dataField="fldParentNm"
          editorType="dxTextBox"
          readOnly={true}
          editorOptions={{
            readOnly: true,
            buttons: [folderSearchBtn],
            elementAttr: {
              id: 'fldParentName'
            },
            onValueChanged: (e) => {
              // const elementAttr = e.component.option('elementAttr');
              // console.log(elementAttr);
              // console.log(row);
              // if (row.fldParentId === 0) {
              //   e.component.option('value', '');
              // } else {
              //   const newFldNm = folderListRef.current._instance
              //       .option('dataSource')
              //       .find((li) => li.fldId === row.fldParentId).fldNm;
              //   e.component.option('value', newFldNm);
              // }
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
      </Form>
    </Panel>
  );
};

export default FolderInformation;
