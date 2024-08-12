import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import useReportLoad from 'hooks/useReportLoad';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  // hook
  const {getReportList, handleSubmit} = useReportLoad();
  const {reportList} = getReportList();

  // local
  let selectedReport = {};

  return (
    <Modal
      onSubmit={() => handleSubmit(selectedReport)}
      modalTitle={localizedString.loadReport}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <DesignerReportTabs
        reportList={reportList}
        onSelectionChanged={(e) => {
          const nodes = e.component.getSelectedNodes();

          if (nodes.length > 0) {
            selectedReport = nodes[0].itemData;
          }
        }}
        onSubmit={() => handleSubmit(selectedReport)}
        searchValue={props.searchValue}
        searchEnabled={props.searchEnabled}
        onClose={props.onClose}
      />
    </Modal>
  );
};

export default LoadReportModal;
