
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';

const theme = getTheme();

const ReportDescriptionModal = ({...props}) => {
  const report = useSelector(selectCurrentReport);

  return (
    <Modal
      modalTitle={localizedString.reportDescription}
      height={theme.size.bingModal}
      width={theme.size.middleModalHeight}
      {...props}
    >
      <ModalPanel
        title={report?.options?.reportNm}
      >
        {report?.options?.reportDesc}
      </ModalPanel>
    </Modal>
  );
};

export default ReportDescriptionModal;
