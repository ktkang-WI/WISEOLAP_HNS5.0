import Modal from '../../Modal/organisms/Modal';
import ModalPanelTitle from '../../Modal/atoms/ModalPanelTitle';
import {getTheme} from 'config/theme';
import {TextBox} from 'devextreme-react';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import ReportSlice from 'redux/modules/ReportSlice';

const theme = getTheme();

const EditReportName = ({...props}) => {
  const currentReport= useSelector(selectCurrentReport);
  const ref = useRef(null);
  const dispatch = useDispatch();

  const reportActions = ReportSlice.actions;

  return (
    <Modal
      modalTitle={'보고서 명 편집'}
      width={theme.size.smallModalWidth}
      {...props}
      onSubmit={() => {
        const value = ref.current.instance.option('value');
        if (value.length > 0) {
          const newReport = _.cloneDeep(currentReport);
          newReport.options.reportNm = value;
          dispatch(reportActions.updateReport(newReport));
        }

        return false;
      }}
    >
      <ModalPanelTitle>
        {'보고서 이름'}
      </ModalPanelTitle>
      <TextBox
        ref={ref}
        text={currentReport.options.reportNm}
      />
    </Modal>);
};

export default EditReportName;
