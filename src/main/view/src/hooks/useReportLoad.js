import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import useReportSave from './useReportSave';
import LinkSlice from 'redux/modules/LinkSlice';
import localizedString from 'config/localization';
import models from 'models';
import useModal from './useModal';
import store from 'redux/modules';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {setIconReportList} from 'components/report/util/ReportUtility';
import {DesignerMode} from 'components/config/configType';
import useSpread from './useSpread';
import {selectCurrentReport}
  from 'redux/selector/ReportSelector';
import LoadingSlice from 'redux/modules/LoadingSlice';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import {useEffect, useState} from 'react';

export default function useReportLoad() {
  // hook
  const dispatch = useDispatch();
  const {loadReport, querySearch, reload} = useReportSave();
  const {setExcelFile} = useSpread();
  const {alert, openModal} = useModal();

  // actions
  const {setDesignerMode} = ConfigSlice.actions;
  const {setLinkReport} = LinkSlice.actions;
  const {startJob, endJob, endJobForce} = LoadingSlice.actions;

  const reportType = selectCurrentDesignerMode(store.getState());
  // const reportId = selectCurrentReportId(store.getState());
  const report = selectCurrentReport(store.getState());

  /**
   * getReportList 훅
   * 현재 디자이너 모드에 따라 보고서 데이터를 불러오고 관리
   * 보고서 데이터 를 비동기적으로 로드하여 보고서 목록을 반환
   * @param {boolean} showAll
   * @return {Object} reportList - 불러온 보고서 데이터 목록
   * @return {String} reportType - 현재 디자이너 모드 타입
   */
  const getReportList = (showAll) => {
    const [reportList, setReportList] = useState([]);

    const getList = async () => {
      let types = reportType;
      if (showAll) {
        types = null;
      }
      await models.Report.getList(types, 'designer').then(({data}) => {
        setIconReportList(data.privateReport);
        setIconReportList(data.publicReport);
        setReportList(data);
      }).catch((e) => {
        console.log(e);
      });
    };

    useEffect(() => {
      getList();
    }, [reportType, report]);

    return {reportList, reportType};
  };

  /**
   * getReportWithLinkedReport 훅
   * 보고서를 로드하고, 링크된 보고서를 관리
   * @param {object} selectedReport - 사용자가 선택한 보고서 객체
   */
  const getReportWithLinkedReport = async (selectedReport) => {
    const {
      setLinkReport
      // setSubLinkReport
    } = LinkSlice.actions;

    if (selectedReport.reportType === DesignerMode['EXCEL']) {
      await setExcelFile(selectedReport.id);
    }
    dispatch(startJob('보고서 정보를 불러오고 있습니다.'));
    models.Report.getReportById(selectedReport.id)
        .then(async ({data}) => {
          try {
            await loadReport(data);
            if (selectedReport.promptYn === 'Y') {
              querySearch();
            }
          } catch {
            alert(localizedString.reportCorrupted);
          }
        })
        .catch(() => {
          alert(localizedString.reportCorrupted);
        }).finally(() => {
          dispatch(endJob('보고서 정보를 불러오고 있습니다.'));
        });

    models.Report.getLinkReportList(selectedReport.id)
        .then((res) => {
          if (res.data ? res.data === undefined : true) {
            console.log('링크된 보고서가 없습니다.');
          } else {
            const linkReports = res.data.linkReportDTOList;
            dispatch(setLinkReport(linkReports));
          }
        }).catch((e) => {
          console.log(e);
          dispatch(endJobForce());
        });
    // const subLinkReports = res.data.subLinkReports;
    // if (subLinkReports.length > 0) {
    // dispatch(setSubLinkReport(subLinkReports[0]));
    // } else if (subLinkReports.length === 0) {
    // }
  };

  /**
   * 선택된 보고서를 제출하고 관련된 모든 작업을 처리하는 함수
   * @param {Object} selectedReport - 사용자가 선택한 보고서 객체
   * @param {Object} nav - modal에서 navigator를 사용.
   * @return {Boolean} - 오류가 발생하면 true를 반환
   */
  const handleSubmit = async (selectedReport, nav) => {
    if (!selectedReport || selectedReport.type !== 'REPORT') {
      openModal(Alert, {
        message: '보고서를 선택하지 않았습니다.'
      });

      return true;
    }

    const reportType = selectedReport.reportType;
    if (nav) {
      nav('/editds/' + reportType.toLowerCase());
    }
    reload(reportType);
    await getReportWithLinkedReport(selectedReport);
  };

  const getReport = async (reportId, reportType) => {
    const selectedReportId = reportId;
    const prompt = window.sessionStorage.getItem('prompt');
    if (reportType === DesignerMode['EXCEL']) {
      await setExcelFile(reportId);
    }
    const res = await models.Report.getReportById(selectedReportId).then(
        async ({data}) => {
          try {
            if (reportType) {
              dispatch(setDesignerMode(reportType));
            }
            const defaultReportPrompt =
              data.reports.find((r) => r.reportId == selectedReportId);

            await loadReport(data);

            if (prompt == 'true' ||
              defaultReportPrompt?.options?.promptYn == 'Y') {
              querySearch();
            }
            return true;
          } catch (e) {
            alert(localizedString.reportCorrupted);
            return false;
          }
        }).catch(() => {
      alert(localizedString.reportCorrupted);
      return false;
    }).finally(() => {
      window.sessionStorage.clear();
    });

    return res;
  };

  const getLinkedReport = async (reportId) => {
    const res = await models.Report.getLinkReportList(reportId)
        .then((res) => {
          try {
            if (res.data ? res.data === undefined : true) {
              console.log('링크된 보고서가 없습니다.');
            } else {
              const linkReports = res.data.linkReportDTOList;
              dispatch(setLinkReport(linkReports));
            }
            return true;
          } catch (e) {
            alert(localizedString.linkReportCorrupted);
            return false;
          };
        }).catch(() => {
          alert(localizedString.linkReportCorrupted);
          return false;
        });

    return res;
  };
  return {
    getReport,
    getReportWithLinkedReport,
    handleSubmit,
    getLinkedReport,
    getReportList
  };
};
