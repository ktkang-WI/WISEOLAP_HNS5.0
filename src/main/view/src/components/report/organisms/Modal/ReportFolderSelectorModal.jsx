import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import ReportListTab
  from 'components/common/atomic/ReportTab/organism/ReportListTab';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import textBox from 'devextreme/ui/text_box';
import {getFolderList} from 'models/report/Report';
import {useEffect, useState} from 'react';

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

  useEffect(() => {
    // TODO: 추후 접속중인 유저 ID로 변경
    const param = {};
    param.userId = 'admin';
    getFolderList(param, (response) => {
      if (response.status != 200) {
        return;
      }
      // dispatch(inserReport({tempReport}));
      console.log(response);
      setItems(response.data);
    });
  }, []);

  const getFolderPath = (component, fldParentId, fldPath) => {
    const folder = component.option('items').filter((item) => {
      return item.fldId === fldParentId;
    })[0];
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
    const textBoxInstance =
    textBox.getInstance(document.getElementById('searchFileText'));
    textBoxInstance.option('elementAttr', selectedFolder);
    textBoxInstance.option('value', selectedFolder.path);
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
          dataSource={ReportTabSource}
          itemComponent={getTabContent}
          width={'100%'}
        />
      </ModalPanel>
    </Modal>
  );
};

export default ReportFolderSelectorModal;
