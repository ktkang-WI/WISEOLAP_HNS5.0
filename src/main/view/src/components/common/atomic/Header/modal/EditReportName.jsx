import Modal from '../../Modal/organisms/Modal';
import ModalPanelTitle from '../../Modal/atoms/ModalPanelTitle';
import {getTheme} from 'config/theme';
import {TextBox} from 'devextreme-react';
import {useSelector} from 'react-redux';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';
import {selectRootReport} from 'redux/selector/ReportSelector';
import localizedString from 'config/localization';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';

const theme = getTheme();

const EditReportName = ({...props}) => {
  // hook
  const dispatch = useDispatch();
  const ref = useRef(null);

  // state
  const rootReport= useSelector(selectRootReport);
  const editMode = useSelector(selectEditMode);

  // slice
  const reportActions = ReportSlice.actions;

  const reportNm = () => {
    if (editMode == EditMode.VIEWER) {
      return rootReport.reports[1].options.reportNm;
    }

    return rootReport.reports[0].options.reportNm;
  };

  return (
    <Modal
      modalTitle={localizedString.editReportName}
      width={theme.size.smallModalWidth}
      height={'auto'}
      {...props}
      onSubmit={() => {
        const value = ref?.current?.instance?.option('value');
        if (value.length > 0) {
          const newReport = _.cloneDeep(rootReport);
          newReport.reports[0].options.reportNm = value;
          dispatch(reportActions.updateReport(newReport));
        }

        return false;
      }}
    >
      <ModalPanelTitle>
        {localizedString.reportName}
      </ModalPanelTitle>
      <TextBox
        ref={ref}
        text={reportNm()}
      />
    </Modal>);
};

export default EditReportName;
