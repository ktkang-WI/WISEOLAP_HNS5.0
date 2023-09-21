import Header from 'components/common/atomic/Header/organism/Header';
import ViewerContent from 'components/viewer/ViewerContent';

const Viewer = () => {
  return (
    <div>
      <Header
        left={['Logo', 'ReportTabs']}
        right={['Designer', 'DownloadReport', 'ReportProperty']}
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
