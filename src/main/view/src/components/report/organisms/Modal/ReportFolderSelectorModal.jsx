import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ComponentLabel
  from 'components/common/atomic/Common/Label/ComponentLabel';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import ReportListTab
  from 'components/common/atomic/ReportTab/organism/ReportListTab';
import tempData
  // eslint-disable-next-line max-len
  from 'components/common/atomic/ReportTab/molecules/ReportFoldableListTempData';

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
  const getTabContent = ({data}) => {
    return <ReportListTab items={tempData[data.id]} width={'100%'}/>;
  };

  return (
    <Modal
      modalTitle={localizedString.selectFolder}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={() => console.log('ReportFolderSelectorModal onSubmit')}
      {...props}
    >
      <ComponentLabel
        component={CommonTab}
        labelTitle={localizedString.folderList}
        props={{
          dataSource: ReportTabSource,
          itemComponent: getTabContent,
          width: '100%'
        }}
      />
    </Modal>
  );
};

export default ReportFolderSelectorModal;
