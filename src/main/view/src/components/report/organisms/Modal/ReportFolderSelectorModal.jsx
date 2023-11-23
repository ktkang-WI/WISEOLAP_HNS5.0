import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import ReportListTab
  from 'components/common/atomic/ReportTab/organism/ReportListTab';
import tempData
  // eslint-disable-next-line max-len
  from 'components/common/atomic/ReportTab/molecules/ReportFoldableListTempData';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import textBox from 'devextreme/ui/text_box';

const theme = getTheme();

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  },
  {
    id: 'privateReport',
    title: localizedString.privateReport
  }
];

const ReportFolderSelectorModal = ({...props}) => {
  let selectedFolder = {};
  const getTabContent = ({data}) => {
    return (
      <ReportListTab
        items={tempData[data.id]}
        width={'100%'}
        onItemClick={({itemData})=> {
          selectedFolder = itemData;
        }}
      />
    );
  };

  const onClick = () => {
    console.log('ReportFolderSelectorModal onSubmit');
    const textBoxInstance =
    textBox.getInstance(document.getElementById('searchFileText'));
    textBoxInstance.option('elementAttr', selectedFolder);
    textBoxInstance.option('value', selectedFolder.name);
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
