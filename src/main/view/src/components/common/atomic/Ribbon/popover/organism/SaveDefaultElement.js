import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import localizedString from 'config/localization';
import {selectCurrentReport}
  from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import useReportSave from 'hooks/useReportSave';
import {useSelector} from 'react-redux';

const SaveDefaultElement = () => {
  const {openModal} = useModal();
  const {saveReport} = useReportSave();
  const currentReport = useSelector(selectCurrentReport);

  return {
    save: [
      {
        label: localizedString.saveReport, // 저장
        onClick: () => {
          const dataSource = _.cloneDeep(currentReport.options);

          if (currentReport.reportId === 0) {
            openModal(ReportSaveModal);
          } else {
            dataSource.reportId = currentReport.reportId;
            saveReport(dataSource);
          };
        }
      },
      {
        label: localizedString.saveAs, // 다른이름으로 저장
        onClick: () => {
          openModal(ReportSaveModal);
        }
      }
    ],
    keys: [
      'save'
    ]
  };
};
export default SaveDefaultElement;
