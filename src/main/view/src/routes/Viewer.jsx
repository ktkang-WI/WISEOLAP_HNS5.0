import Header from 'components/common/organisms/Header';
import ViewerContent from 'components/viewer/ViewerContent';

const Viewer = () => {
  return (
    <div>
      <Header
        left={['Logo', 'Designer', 'ReportTabs']}
        right={['ReportProperty']}
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
