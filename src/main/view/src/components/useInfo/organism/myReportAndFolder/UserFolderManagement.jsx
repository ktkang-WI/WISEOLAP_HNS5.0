import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {TreeView} from 'devextreme-react';
import {useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import styled from 'styled-components';
import reportFolderUtility from './ReportFolderUtility';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
  display: inline-block;
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
  const {
    newUserFolderUtil,
    deleteUserFolderUtil,
    updateUserFolderUtil,
    checkValidation
  } = reportFolderUtility();

  // 폴더 목록 선택.
  let itemData = {};
  const handleItemClick = (e) => {
    itemData = e.itemData;
  };

  const newUserFolder = () => {
    newUserFolderUtil(itemData, treeViewData.folder, setTreeViewData);
  };

  const updateUserFolder = () => {
    const isOk = checkValidation.noSelection(itemData);

    if (isOk) {
      updateUserFolderUtil(itemData, treeViewData.folder, setTreeViewData);
    }
  };

  const deleteUserFolder = () => {
    const isOk = checkValidation.noSelection(itemData);

    if (isOk) {
      deleteUserFolderUtil(itemData, treeViewData.folder, setTreeViewData);
    }
  };

  return (
    <>
      <Wrapper>
        <ModalPanel
          title={localizedString.folder}
          height='calc(100% - 250px)'
          width='100%'
          padding='10px 10px 0px 20px'
        >
        </ModalPanel>
        <div style={{position: 'relative', width: '50vw', height: '60vh'}}>
          <StyledTreeView
            height='50vh'
            width='50vw'
            items={treeViewData.folder}
            dataStructure="plain"
            displayExpr="name"
            selectionMode='single'
            parentIdExpr="fldParentId"
            keyExpr="id"
            noDataText="조회된 보고서가 없습니다."
            searchEnabled={true}
            searchEditorOptions={{
              placeholder: '검색',
              width: '300px'
            }}
            selectByClick={false}
            focusStateEnabled={true}
            onItemClick={handleItemClick}
          />
          <div style={{display: 'flex', position: 'absolute', right: '30px'}}>
            <CommonButton
              width='150px'
              onClick={newUserFolder}
            >새로만들기</CommonButton>
            <CommonButton
              width='100px'
              onClick={updateUserFolder}
            >편집</CommonButton>
            <CommonButton
              width='100px'
              onClick={deleteUserFolder}
            >삭제</CommonButton>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
export default UserFolderManagement;
