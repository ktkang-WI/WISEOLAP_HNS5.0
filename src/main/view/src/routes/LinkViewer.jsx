import {DesignerMode, EditMode} from 'components/config/configType';
import LinkViewerContent from 'components/linkViewer/LinkViewerContent';
import useConfig from 'hooks/useConfig';
import useReportSave from 'hooks/useReportSave';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useLoaderData} from 'react-router-dom';
import ConfigSlice from 'redux/modules/ConfigSlice';

const LinkViewer = () => {
  const dispatch = useDispatch();
  const {reload} = useReportSave();
  const {setEditMode} = ConfigSlice.actions;
  const {generalConfigure} = useLoaderData();
  const {saveConfiguration} = useConfig();
  saveConfiguration(generalConfigure);

  useEffect(() => {
    dispatch(setEditMode(EditMode.VIEWER));
    reload(DesignerMode.DASHBOARD);
  }, []);

  return (
    <LinkViewerContent/>
  );
};
export default LinkViewer;
