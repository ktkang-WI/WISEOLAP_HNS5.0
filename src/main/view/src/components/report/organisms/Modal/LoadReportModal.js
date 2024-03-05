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
import {DesignerMode} from 'components/config/configType';
import useSpread from 'hooks/useSpread';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  let selectedReport = {};
  const {setExcelFile} = useSpread();
  const [reportList, setReportList] = useState();
  const {openModal, alert} = useModal();
  const {loadReport, querySearch} = useReportSave();
  const reportType = selectCurrentDesignerMode(store.getState());

  useEffect(() => {
    models.Report.getList('admin', reportType, 'designer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  const getReport = async () => {
    if (reportType === DesignerMode['EXCEL']) {
      await setExcelFile(selectedReport.id);
    }
    models.Report.getReportById('admin', selectedReport.id)
        .then(({data}) => {
          try {
            loadReport(data);
            querySearch();
          } catch {
            alert(localizedString.reportCorrupted);
          }
        }).catch(() => {
          alert(localizedString.reportCorrupted);
        });
  };

  return (
    <Modal
      onSubmit={() => {
        if (!_.isEmpty(selectedReport)) {
          if (selectedReport.type == 'REPORT') {
            getReport();
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
    </Modal>
  );
};

export default LoadReportModal;
