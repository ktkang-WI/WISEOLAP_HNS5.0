import localizedString from 'config/localization';
import CommonTab from '../../Common/Interactive/CommonTab';
import Wrapper from '../../Common/Wrap/Wrapper';
import ReportListTab from './ReportListTab';
import {useEffect, useState} from 'react';
import {setIconReportList} from 'components/report/util/ReportUtility';
import models from 'models';
import useReportSave from 'hooks/useReportSave';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useDispatch} from 'react-redux';
import {EditMode} from 'components/config/configType';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import LinkSlice from 'redux/modules/LinkSlice';
import {useSelector} from 'react-redux';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {selectReports} from 'redux/selector/ReportSelector';
import useModal from 'hooks/useModal';
import {connectLinkedReport} from 'components/report/util/LinkedReportUtility';

const theme = getTheme();

const ReportTabSource = [
  {
    id: 'publicReport',
    title: localizedString.publicReport
  },
  {
    id: 'privateReport',
    title: localizedString.privateReport
  }
];

const StyledTab = styled(CommonTab)`
  background: ${theme.color.white};
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid ${theme.color.gray200};
  padding: 10px;
`;

const ReportTabs = ({reportData}) => {
  const [reportList, setReportList] = useState();
  const {loadReport, querySearch} = useReportSave();
  const dispatch = useDispatch();
  const {alert} = useModal();

  const editMode = useSelector(selectEditMode);
  const reports = useSelector(selectReports);

  const {setDesignerMode} = ConfigSlice.actions;
  let dblClick = 0;
  const {setLinkReport, setSubLinkReport} = LinkSlice.actions;

  const params = new URLSearchParams(window.location.search);
  const fldFilter = params.get('fld') || false;

  const getTabContent = ({data}) => {
    return <ReportListTab
      items={reportList? reportList[data.id] : []}
      onItemClick={async (e) => {
        dblClick ++;
        setTimeout(() => {
          dblClick --;
        }, 300);

        if (dblClick > 1) {
          if (editMode === EditMode['VIEWER']) {
            // 뷰어 보고서 갯수 제한(5개 까지)
            if (reports.length >= 6) {
              alert(localizedString.viewerReportLimit);
              return;
            }
          }

          const selectedReport = e.itemData;
          if (selectedReport && selectedReport.type == 'REPORT') {
            if (editMode == EditMode.VIEWER) {
              const isExist = (reports || []).find(
                  (report) => report.reportId == selectedReport.id);

              if (isExist) {
                alert(localizedString.duplicatedReportMsg);
                return;
              }
            }

            if (editMode == EditMode.VIEWER) {
              connectLinkedReport({
                reportId: selectedReport.id,
                reportType: selectedReport.reportType,
                promptYn: selectedReport.promptYn
              }, reports.length == 1, true);

              return;
            }

            models.Report.getReportById(selectedReport.id)
                .then(async ({data}) => {
                  try {
                    dispatch(setDesignerMode(selectedReport.reportType));
                    await loadReport(data);
                    if (selectedReport.promptYn === 'Y') {
                      querySearch();
                    }
                  } catch (e) {
                    console.error(e);
                    alert(localizedString.reportCorrupted);
                  }
                }).catch(() => {
                  alert(localizedString.reportCorrupted);
                });
            models.Report.getLinkReportList(selectedReport.id)
                .then((res) => {
                  const subLinkReports = res.data.subLinkReports;
                  const linkReports = res.data.linkReports;
                  console.log('subLinkReports', subLinkReports);
                  console.log('linkReports', linkReports);
                  if (subLinkReports.length > 0) {
                    dispatch(setSubLinkReport(subLinkReports[0]));
                  } else if (subLinkReports.length === 0) {
                    dispatch(setLinkReport(linkReports[0]));
                  }
                }).catch((e) => {
                  console.log(e);
                });
          }
        }
      }}
    />;
  };

  const setDatas = (data) => {
    if (data != undefined && data != '') {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    }
  };

  useEffect(() => {
    if (reportData) return;

    const targets = [];

    const createIndexMap = (data) => {
      const map = {};

      data.forEach((row) => {
        if (!map[row.upperId]) {
          map[row.upperId] = [];
        }
        map[row.upperId].push(row);
      });

      return map;
    };

    const getAllChildrenByParentId = (indexMap, upperId) => {
      const result = [];

      function findChildren(upperId) {
        if (indexMap[upperId]) {
          indexMap[upperId].forEach((child) => {
            if (upperId == fldFilter) {
              child.upperId = 0;
            }
            result.push(child);
            if (child.ordinal < 0) {
              targets.push(child);
            }
            findChildren(child.id); // 하위 자식 탐색
          });
        }
      }

      findChildren(upperId);
      return result;
    };

    models.Report.getList(null, 'viewer').then(({data}) => {
      if (fldFilter) {
        const indexMap = createIndexMap(data.publicReport);
        data.publicReport = getAllChildrenByParentId(indexMap, fldFilter);
      }

      setDatas(data);

      if (reports.length > 1) return;

      const target = targets.reduce((acc, t) => {
        if (!acc) acc = t;

        if (acc.ordinal > t.ordinal) {
          acc = t;
        }

        return acc;
      }, null);

      if (target) {
        models.Report.getReportById(target.id)
            .then(async ({data}) => {
              try {
                dispatch(setDesignerMode(target.reportType));
                await loadReport(data);
                if (target.promptYn === 'Y') {
                  querySearch();
                }
              } catch (e) {
                console.error(e);
                alert(localizedString.reportCorrupted);
              }
            }).catch(() => {
              alert(localizedString.reportCorrupted);
            });
      }
    }).catch((e) => console.log(e));
  }, [reports]);

  useEffect(() => {
    if (!reportData) return;

    if (fldFilter) {
      const indexMap = createIndexMap(reportData.publicReport);
      reportData.publicReport = getAllChildrenByParentId(indexMap, fldFilter);
    }

    setDatas(reportData);
  }, [reportData]);

  return (
    <Wrapper>
      <StyledTab
        height={'100%'}
        headerVisible={!fldFilter}
        dataSource={fldFilter ? [ReportTabSource[0]]: ReportTabSource}
        itemComponent={getTabContent}
      />
    </Wrapper>
  );
};

export default ReportTabs;
