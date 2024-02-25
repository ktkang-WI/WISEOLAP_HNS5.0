import Header from 'components/common/atomic/Header/organism/Header';
import {DesignerMode, EditMode} from 'components/config/configType';
import ViewerContent from 'components/viewer/ViewerContent';
import useReportSave from 'hooks/useReportSave';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';

const Viewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;

  useEffect(() => {
    dispatch(setEditMode(EditMode.VIEWER));
    reload(DesignerMode.DASHBOARD);
  }, []);

  return (
    <div>
      <Header
        left={['Logo', 'Designer', 'ReportTabs']}
        right={['DownloadReport', 'ReportProperty']}
      >
      </Header>
      <ViewerContent/>
    </div>
  );
};
export default Viewer;
