import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {TreeView} from 'devextreme-react';
import Form from 'devextreme/ui/form';
import {useRef, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import styled from 'styled-components';
import reportFolderUtility from './ReportFolderUtility';
import FolderInformation
  from 'components/config/atoms/reportFolderManagement/FolderInformation';
import Panel
  from 'components/config/organisms/userGroupManagement/common/Panel';
import {getRefInstance} from 'components/config/utility/utility';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import folderImg from 'assets/image/icon/report/folder_load.png';
import modifyImg from 'assets/image/icon/button/modify.png';
import removeImg from 'assets/image/icon/button/remove_white.png';
import checkImg from 'assets/image/icon/button/check_white.png';

const theme = getTheme();

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
    border-radius: 6px;
  }
`;

const smallButton = {
  height: '30px',
  borderRadius: '4px',
  font: theme.font.smallButton
};

const UserFolderManagement = () => {
  const folders = useLoaderData();
  const [treeViewData, setTreeViewData] = useState(folders);
  const [row, setRow] = useState({});
  const ref = useRef(null);
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

    if (ref.current) {
      const formData = ref.current.instance.option().formData;
      formData.id= newItemData?.id || 0;
      formData.name= newItemData?.name || '';
      formData.fldParentNm= newItemData?.fldParentNm || '';
      formData.fldParentId= newItemData?.fldParentId || 0;
      formData.ordinal= newItemData?.ordinal || 0;
      formData.fldLvl = newItemData?.fldLvl || 0;
      formData.desc = newItemData?.desc || '';

      ref.current.instance.repaint();
    }
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

  const itemRender = (item) => {
    return (
      <div className="dx-item-content dx-treeview-item-content">
        <img width='16px' src={folderImg} className="dx-icon"/>
        <span>{item.name}</span>
      </div>
    );
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Panel title={localizedString.folderManager}>
        <div style={{width: '100%', height: '90%', textAlign: 'left'}}>
          <StyledTreeView
            height='100%'
            width='100%'
            items={treeViewData?.folder || []}
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
            itemRender={itemRender}
            selectByClick={false}
            focusStateEnabled={true}
            onItemClick={handleItemClick}
          />
        </div>
        <div style={{
          display: 'flex',
          height: '10%',
          padding: '10px 20px',
          justifyContent: 'right'
        }}>
          <CommonButton
            {...smallButton}
            width='100px'
            onClick={newUserFolder}
          >
            <img height='20px' src={checkImg}/>
            {localizedString.newReport}
          </CommonButton>
          <CommonButton
            {...smallButton}
            width='70px'
            type='secondary'
            onClick={updateUserFolder}
          >
            <img height='20px' src={modifyImg}/>
            {localizedString.saveReport}
          </CommonButton>
          <CommonButton
            {...smallButton}
            width='70px'
            type='red'
            onClick={deleteUserFolder}
          >
            <img height='20px' src={removeImg}/>
            {localizedString.deleteReport}
          </CommonButton>
        </div>
      </Panel>
      <FolderInformation
        row={row}
        setRow={setRow}
        myPageFlag={'myPage'}
        ref={ref}/>
    </Wrapper>
  );
};

export default UserFolderManagement;
