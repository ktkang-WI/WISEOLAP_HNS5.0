import localizedString from 'config/localization';
import CommonTab from '../../Common/Interactive/CommonTab';
import Wrapper from '../../Common/Wrap/Wrapper';
import ReportListTab from './ReportListTab';

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

const DesignerReportTabs = (
    {reportList, onSelectionChanged, onSubmit, onClose, searchValue,
      searchEnabled, dropdownBoxRef, usingPoint, value, navigator, modalType}
) => {
  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList? reportList[data.id] : []}
      width='100%'
      onSelectionChanged={onSelectionChanged}
      selectionMode='single'
      selectByClick={true}
      selectNodesRecursive={false}
      searchValue={searchValue}
      searchEnabled={searchEnabled === undefined ? true : searchEnabled}
      dropdownBoxRef={dropdownBoxRef}
      onSubmit={onSubmit}
      onClose={onClose}
      usingPoint={usingPoint}
      navigator={navigator}
      modalType={modalType}
    />;
  };

  return (
    <Wrapper>
      <CommonTab
        dataSource={ReportTabSource}
        itemComponent={getTabContent}
        width='100%'
      />
    </Wrapper>
  );
};

export default DesignerReportTabs;
