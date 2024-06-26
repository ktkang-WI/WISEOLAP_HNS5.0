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
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import store from 'redux/modules';
import useReportSave from 'hooks/useReportSave';
import {DesignerMode} from 'components/config/configType';
import useSpread from 'hooks/useSpread';
import LinkSlice from 'redux/modules/LinkSlice';
import {useDispatch} from 'react-redux';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  let selectedReport = {};

  const {setExcelFile} = useSpread();
  const [reportList, setReportList] = useState();
  const {openModal, alert} = useModal();
  const {loadReport, querySearch, reload} = useReportSave();
  const reportType = selectCurrentDesignerMode(store.getState());
  const reportId = selectCurrentReportId(store.getState());
  const dispatch = useDispatch();

  useEffect(() => {
    models.Report.getList(reportType, 'designer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  const getReport = async () => {
    const {setLinkReport, setSubLinkReport} = LinkSlice.actions;
    if (reportType === DesignerMode['EXCEL']) {
      await setExcelFile(selectedReport.id);
    }
    models.Report.getReportById(selectedReport.id)
        .then(({data}) => {
          try {
            loadReport(data);
            querySearch();
          } catch {
            alert(localizedString.reportCorrupted);
          }
        }).catch((e) => {
          alert(localizedString.reportCorrupted);
        });
    models.Report.getLinkReportList(selectedReport.id)
        .then((res) => {
          const subLinkReports = res.data.subLinkReports;
          const linkReports = res.data.linkReports;
          if (subLinkReports.length > 0) {
            dispatch(setSubLinkReport(subLinkReports[0]));
          } else if (subLinkReports.length === 0) {
            dispatch(setLinkReport(linkReports[0]));
          }
        });
  };

  const onSubmit = () => {
    if (!_.isEmpty(selectedReport)) {
      if (selectedReport.type == 'REPORT') {
        if (reportId != 0) {
          reload(reportType);
        }
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
  };

  return (
    <Modal
      onSubmit={onSubmit}
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
        onSubmit={onSubmit}
        searchValue={props.searchValue}
        searchEnabled={props.searchEnabled}
        onClose={props.onClose}
      />
    </Modal>
  );
};

export default LoadReportModal;
