import ReportSaveModal from 'components/report/modal/ReportSaveModal';
import localizedString from 'config/localization';
import {selectCurrentReport}
  from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import useReportSave from 'hooks/useReportSave';
import models from 'models';
import store from 'redux/modules';
import {checkLinkReport} from 'redux/selector/LinkSelector';
import useLinkReportSave from 'hooks/useLinkReportSave';

const SaveDefaultElement = () => {
  const {openModal, alert} = useModal();
  const {patchReport, generateParameter} = useReportSave();
  const {genLinkParam} = useLinkReportSave();

  const getElementByLable = (label) => {
    return saveElement.save.find((element) => element.label === label);
  };

  const saveElement = {
    save: [
      {
        label: localizedString.saveReport, // 저장
        onClick: (props) => {
          const currentReport = selectCurrentReport(store.getState());
          const dataSource = _.cloneDeep(currentReport.options);

          if (currentReport.reportId === 0) {
            openModal(ReportSaveModal, props);
          } else {
            dataSource.reportId = currentReport.reportId;
            const param = generateParameter(dataSource);
            models.Report.updateReport(param).then((res) => {
              const reportId = res.data.report.reportId;
              const data = res.data;
              const msg = data.msg;
              const result = data.result;

              if (res.status != 200) {
                alert(localizedString.faildSaveReportMsg);
                return;
              }

              alert(localizedString[msg]);

              if (result) patchReport(data);
              if (props.createExcelFile) {
                props.createExcelFile(reportId);
              }
            });

            const linkReport = checkLinkReport(store.getState());
            const linkParam = genLinkParam(linkReport);
            models.Report.insertLinkReport(linkParam.data).then((res) => {
            });
          };
        }
      },
      {
        label: localizedString.saveAs, // 다른이름으로 저장
        onClick: (props) => {
          openModal(ReportSaveModal, props);
        }
      }
    ],
    keys: [
      'save'
    ]
  };
  return {
    saveElement,
    getElementByLable
  };
};

export default SaveDefaultElement;
