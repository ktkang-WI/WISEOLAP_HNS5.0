import localizedString from '../../../config/localization';
import CommonTab from '../atoms/CommonTab';
// import CommonToolbar from '../atoms/CommonToolbar';
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

const getTabContent = ({data}) => {
  return <ReportListTab/>;
};

// const ToolbarItems = [
//   {
//     location: 'before',
//     key: '1',
//     widget: 'dxButton',
//     options: {
//       icon: 'back',
//       onClick: () => {
//         alert('hi');
//       }
//     }
//   }
// ];

const ReportTabs = () => {
  return (
    <CommonTab
      dataSource={ReportTabSource}
      itemComponent={getTabContent}
    />
  );
};

export default ReportTabs;
