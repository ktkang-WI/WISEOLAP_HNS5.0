import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import localizedString from 'config/localization';
import {selectCurrentReport}
  from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import useReportSave from 'hooks/useReportSave';
import {useSelector} from 'react-redux';
import models from 'models';

const SaveDefaultElement = () => {
  const {openModal, alert} = useModal();
  const {patchReport, generateParameter} = useReportSave();
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
            const param = generateParameter(dataSource);
            models.Report.updateReport(param).then((res) => {
              const data = res.data;
              const msg = data.msg;
              const result = data.result;

              if (res.status != 200) {
                alert(localizedString.faildSaveReportMsg);
                return;
              }

              alert(localizedString[msg]);

              if (result) {
                patchReport(data);
              }
            });
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
