import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {TreeView} from 'devextreme-react';
import Form from 'devextreme/ui/form';
import {useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import styled from 'styled-components';
import reportFolderUtility from './ReportFolderUtility';
import FolderInformation
  from 'components/config/atoms/reportFolderManagement/FolderInformation';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {getRefInstance} from 'components/config/utility/utility';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
  display: inline-flex;
  text-align: left;
  box-sizing: border-box;
`;
const StyledTreeView = styled(TreeView)`
  color: ${theme.color.primaryFont};
  font: ${theme.font.dataSource};
  padding: 20px;
  box-sizing: border-box;
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.primaryFont};
  }

  .dx-treeview-item-content {
    transform: none !important;
  }

  .dx-scrollable-wrapper {
    border: 1px solid #D4D7DC;
  }
`;

const UserFolderManagement = () => {
  const folders = useLoaderData();
  const [treeViewData, setTreeViewData] = useState(folders);
  const [row, setRow] = useState({});
  const {
    newUserFolderUtil,
    deleteUserFolderUtil,
    updateUserFolderUtil,
    checkValidation
  } = reportFolderUtility();

  // 폴더 목록 선택.
  const handleItemClick = (e) => {
    const itemData = {...e.itemData};
    const parentFld = treeViewData?.folder.find(
        (d) => d.id === itemData?.fldParentId
    );
    const parentNm = parentFld ? parentFld.name : null;
    const newItemData = {...itemData, fldParentNm: parentNm || '/root'};
    setRow(newItemData);
  };

  const newUserFolder = () => {
    newUserFolderUtil(row, treeViewData.folder, setTreeViewData);
  };

  const updateUserFolder = () => {
    const isOk = checkValidation.noSelection(row);
    const infoRef = getRefInstance(Form, 'folder-information');
    infoRef;
    if (isOk) {
      const infoRef = getRefInstance(Form, 'folder-information');
      const folderInfoFormData = infoRef.option('formData');

      if (!Object.keys(folderInfoFormData)) {
        checkValidation.noSelectedFolderInfo();
        return;
      } else {
        if (!folderInfoFormData.id) {
          checkValidation.noSelectedFolderInfo();
          return;
        }
      }

      updateUserFolderUtil(folderInfoFormData, setRow, setTreeViewData);
    }
  };

  const deleteUserFolder = () => {
    const isOk = checkValidation.noSelection(row);

    if (isOk) {
      deleteUserFolderUtil(row, treeViewData.folder, setTreeViewData);
    }
  };

  return (
    <>
      <Wrapper>
        <ModalPanel
          height='calc(100% - 250px)'
          width='50%'
          padding='10px 10px 0px 20px'
        >
          <Panel title={localizedString.folderManager}>
            <div style={{position: 'relative', width: '400px', height: '60vh'
            }}>
              <StyledTreeView
                height='50vh'
                width='35vw'
                items={treeViewData.folder}
                dataStructure="plain"
                displayExpr="name"
                selectionMode='single'
                parentIdExpr="fldParentId"
                keyExpr="id"
                noDataText={localizedString.noReports}
                searchEnabled={true}
                searchEditorOptions={{
                  placeholder: localizedString.search,
                  width: '300px'
                }}
                selectByClick={false}
                focusStateEnabled={true}
                onItemClick={handleItemClick}
              />
            </div>
          </Panel>
        </ModalPanel>
        <ModalPanel
          height='calc(100% - 250px)'
          width='50%'
          padding='10px 10px 0px 20px'
        >
          <FolderInformation row={row} setRow={setRow} myPageFlag={'myPage'}/>
        </ModalPanel>
      </Wrapper>
      <div>
        <div style={{display: 'flex'}}>
          <CommonButton
            width='150px'
            onClick={newUserFolder}
          >{localizedString.newReport}</CommonButton>
          <CommonButton
            width='100px'
            onClick={updateUserFolder}
          >{localizedString.saveReport}</CommonButton>
          <CommonButton
            width='100px'
            onClick={deleteUserFolder}
          >{localizedString.deleteReport}</CommonButton>
        </div>
      </div>
    </>
  );
};

export default UserFolderManagement;
