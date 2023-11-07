import localizedString from 'config/localization';
import CommonTab from '../../Common/Interactive/CommonTab';
import Wrapper from '../../Common/Wrap/Wrapper';
import ReportListTab from './ReportListTab';
import tempData from '../molecules/ReportFoldableListTempData';

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

const DesignerReportTabs = ({reportList, onSelectionChanged}) => {
  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList? reportList[data.id] : tempData[data.id]}
      width='100%'
      onSelectionChanged={onSelectionChanged}
      selectionMode='single'
      selectByClick={true}
      selectNodesRecursive={false}
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
