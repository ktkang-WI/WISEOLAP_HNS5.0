import Header from 'components/common/organisms/Header';
import ViewerContent from 'components/viewer/ViewerContent';

const Viewer = () => {
  return (
    <div>
      <Header
        left={['Logo', 'ReportTabs']}
        right={['Designer', 'ReportProperty']}
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
