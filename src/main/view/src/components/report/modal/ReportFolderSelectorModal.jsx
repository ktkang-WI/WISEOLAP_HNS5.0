import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import ReportListTab
  from 'components/common/atomic/ReportTab/organism/ReportListTab';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {getFolderList} from 'models/report/Report';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';
import {addReportType, setIconReportList} from '../util/ReportUtility';

const theme = getTheme();

const ReportTabSource = [
  {
    id: 'publicFolder',
    title: localizedString.publicFolder
  },
  {
    id: 'privateFolder',
    title: localizedString.privateFolder
  }
];

const ReportFolderSelectorModal = ({...props}) => {
  const [items, setItems] = useState({});
  let selectedFolder = {};
  const editMode = useSelector(selectEditMode);
  // 뷰어에서 공용 폴더 가림. 추후 공용폴더도 사용하면 삭제 예정.
  const ReportTab =
    editMode == EditMode['VIEWER'] ? [ReportTabSource[1]] : ReportTabSource;

  useEffect(() => {
    // TODO: 추후 접속중인 유저 ID로 변경
    getFolderList().then((response) => {
      if (response.status != 200) {
        return;
      }
      const {publicFolder, privateFolder} = response.data;

      const updatedPublicFolder = addReportType(publicFolder, 'FOLDER');
      const updatedPrivateFolder = addReportType(privateFolder, 'FOLDER');

      setIconReportList(updatedPublicFolder);
      setIconReportList(updatedPrivateFolder);

      setItems({
        publicFolder: updatedPublicFolder,
        privateFolder: updatedPrivateFolder
      });
    });
  }, []);

  const getFolderPath = (component, fldParentId, fldPath) => {
    const folder = component.option('items').find((item) =>
      item.fldId === fldParentId);
    if (fldParentId != 0) {
      return getFolderPath(component, folder.fldParentId,
          folder.fldNm + ' > ' + fldPath);
    }
    return fldPath;
  };

  const getTabContent = ({data}) => {
    return (
      <ReportListTab
        items={items[data.id]}
        width={'100%'}
        displayExpr="fldNm"
        parentIdExpr="fldParentId"
        keyExpr="fldId"
        onItemClick={({itemData, component})=> {
          selectedFolder = itemData;
          selectedFolder.path = getFolderPath(component,
              itemData.fldParentId, itemData.fldNm);
          selectedFolder.fldType = data.id === 'publicFolder' ?
          'PUBLIC' : 'PRIVATE';
        }}
      />
    );
  };

  const onClick = () => {
    if (selectedFolder.hasOwnProperty('path')) {
      props.formInstance.itemOption('fldName', {
        editorOptions: {
          elementAttr: selectedFolder,
          value: selectedFolder.path
        }
      });
      return;
    }
    return true;
  };

  return (
    <Modal
      modalTitle={localizedString.selectFolder}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={onClick}
      {...props}
    >
      <ModalPanel title={localizedString.folderList}>
        <CommonTab
          dataSource={ReportTab}
          itemComponent={getTabContent}
          width={'100%'}
        />
      </ModalPanel>
    </Modal>
  );
};

export default ReportFolderSelectorModal;
