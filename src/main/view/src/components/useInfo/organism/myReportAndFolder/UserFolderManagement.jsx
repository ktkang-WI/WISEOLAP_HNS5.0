import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import Form from 'devextreme/ui/form';
import {useCallback, useRef, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
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
// eslint-disable-next-line max-len
import StyledTreeList from 'components/config/atoms/reportFolderManagement/StyledTreeList';
import {Column, RowDragging, SearchPanel, Selection}
  from 'devextreme-react/tree-list';
import {onDragChange, onReorder} from 'components/config/utility/utility.js';

const theme = getTheme();

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
    updateUserFolderOrderUtil,
    checkValidation
  } = reportFolderUtility();

  // 폴더 목록 선택.
  const handleItemClick = (e) => {
    const itemData = {...e.data};
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
      formData.fldDesc = newItemData?.desc || '';

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

  return (
    <Wrapper display='flex' direction='row'>
      <Panel title={localizedString.folderManager}>
        <div style={{width: '100%', height: '90%', textAlign: 'left'}}>
          <StyledTreeList
            dataSource={treeViewData?.folder || []}
            keyExpr="id"
            parentIdExpr="fldParentId"
            height={'90%'}
            width='100%'
            showColumnHeaders={false}
            onRowClick={handleItemClick}
          >
            <SearchPanel
              visible={true}
              width={250}
            />
            <Selection mode="single" />
            <RowDragging
              onDragChange={(e) => onDragChange({...e, key: 'id'})}
              onReorder={useCallback((e) => {
                const {datasource, sourceData} = onReorder({
                  ...e,
                  datasource: _.cloneDeep(treeViewData?.folder),
                  key: 'id',
                  parentKey: 'fldParentId'
                });
                updateUserFolderOrderUtil(datasource, sourceData,
                    setTreeViewData);
                e.component.clearSelection();
              }, [treeViewData?.folder])}
              allowDropInsideItem={true}
              allowReordering={true}
              showDragIcons={false}
            />
            <Column
              dataField="name"
              caption={localizedString.folderName}
              cellRender={({row}) => {
                return (
                  <>
                    <img
                      style={{marginTop: '1.5px', float: 'left'}}
                      height={'17px'} src={folderImg}/>
                    <span style={{lineHeight: '17px', marginLeft: '5px'}}>
                      {row.data.name}
                    </span>
                  </>
                );
              }}
            />
          </StyledTreeList>
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
