import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import useModal from 'hooks/useModal';
import {useEffect, useState} from 'react';
import models from 'models';
import {setIconReportList} from 'components/report/util/ReportUtility';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
import useReportSave from 'hooks/useReportSave';
import {selectCurrentDesigner} from 'redux/selector/SpreadSelector';
import {useSelector} from 'react-redux';

const theme = getTheme();

const LoadReportModal = ({
  loadExcelFile,
  ...props}) => {
  let selectedReport = {};
  const [reportList, setReportList] = useState();
  const {openModal, alert} = useModal();
  const {loadReport} = useReportSave();
  const designer = useSelector(selectCurrentDesigner);


  useEffect(() => {
    const reportType = selectCurrentDesignerMode(store.getState());
    models.Report.getList('admin', reportType, 'designer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  return (
    <Modal
      onSubmit={() => {
        if (!_.isEmpty(selectedReport)) {
          if (selectedReport.type == 'REPORT') {
            models.Report.getReportById('admin', selectedReport.id)
                .then(({data}) => {
                  try {
                    loadReport(data);
                    if (loadExcelFile) {
                      loadExcelFile({
                        reportId: data.reports[0].reportId,
                        prevDesigner: designer
                      });
                    }
                  } catch {
                    alert(localizedString.reportCorrupted);
                  }
                }).catch(() => {
                  alert(localizedString.reportCorrupted);
                });
          } else {
            openModal(Alert, {
              message: '선택한 항목이 보고서가 아닙니다.'
            });
            return true;
          }
        } else {
          openModal(Alert, {
            message: '보고서를 선택하지 않았습니다.'
          });
          return true;
        }
      }}
      modalTitle={localizedString.loadReport}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <PageWrapper>
        <DesignerReportTabs
          reportList={reportList}
          onSelectionChanged={(e) => {
            const nodes = e.component.getSelectedNodes();

            if (nodes.length > 0) {
              selectedReport = nodes[0].itemData;
            } else {
              selectedReport = {};
            }
          }}/>
      </PageWrapper>
    </Modal>
  );
};

export default LoadReportModal;
