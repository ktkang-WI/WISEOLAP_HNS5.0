import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atomic/Common/Interactive/CustomDrawer';
import ReportContent
  from 'components/common/atomic/Common/Content/ReportContent';
import Content from 'components/common/atomic/Common/Content/Content';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import ViewerDataAttributePanels
  from 'components/viewer/ViewerDataAttributePanels';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import useDrag from 'hooks/useDrag';
import SpreadViewer from
  'components/report/atomic/spreadBoard/organisms/SpreadViewer';
import FilterBar from
  'components/common/atomic/FilterBar/organism/FilterBar';
import {styled} from 'styled-components';
import {useEffect, useState} from 'react';
import localizedString from 'config/localization';
import models from 'models';
import useReportSave from 'hooks/useReportSave';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import ItemBoards
  from 'components/report/atomic/ItemBoard/organisms/ItemBoards';
import reportListIcon from 'assets/image/icon/button/report_list.png';
import reportListActiveIcon
  from 'assets/image/icon/button/report_list_active.png';
import attributeListIcon from 'assets/image/icon/button/attribute_list.png';
import attributeListActiveIcon
  from 'assets/image/icon/button/attribute_list_active.png';
import reloadImg from 'assets/image/icon/button/reset.png';
import ReportTabs from 'components/common/atomic/ReportTab/organism/ReportTabs';
import LinkSlice from 'redux/modules/LinkSlice';
import {DesignerMode} from 'components/config/configType';


const theme = getTheme();

const StyledWrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  min-height: 0px;
  margin-bottom: 0px;
`;

const LinkViewerContent = ({children}) => {
  const {onDragEnd, onDragStart} = useDrag();
  const report = useSelector(selectCurrentReport);
  const [dataColumnOpened, setDataColumnOpened] = useState(false);
  const [reportListOpened, setReportListOpened] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const [reportData, setReportData] = useState();
  const useAttributeList = report.options.reportType == 'AdHoc';
  const {loadReport, querySearch} = useReportSave();
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  const {
    setLinkReport,
    setNewLinkParamInfo
  } = LinkSlice.actions;

  const params = new URLSearchParams(window.location.search);
  const showReportList = params.get('srl') || false;
  const noHeader = params.get('no_header') || false;
  const noFilter = params.get('no_filter') || false;

  const buttons = [{
    icon: reportListIcon,
    activeIcon: reportListActiveIcon,
    label: localizedString.reportList,
    width: '85px',
    type: 'expand',
    visible: showReportList,
    value: reportListOpened,
    onClick: () => {
      setReportListOpened(!reportListOpened);
    }
  },
  {
    icon: attributeListIcon,
    activeIcon: attributeListActiveIcon,
    label: localizedString.dataAttributeList,
    visible: useAttributeList,
    width: '105px',
    type: 'expand',
    value: dataColumnOpened,
    onClick: () => {
      setDataColumnOpened(!dataColumnOpened);
    }
  },
  {
    icon: reloadImg,
    visible: showReportList,
    width: '20px',
    type: 'icon',
    onClick: () => {
      models.Report.getList(null, 'viewer').then(({data}) => {
        setReportData(data);
      }).catch((e) => {
        console.log(e);
      });
    }
  }
  ];

  const enabled = report.options.reportType == 'AdHoc' && dataColumnOpened;
  document.title = report.options.reportNm;

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [fullscreen]);

  useEffect(() => {
    const token = params.get('token');
    const reportId = params.get('reportId');

    if (token) {
      models.Report.retrieveLinkReport(token).then((response) => {
        const loadReportId = response.data.reportId;
        const loadReportType = response.data.reportType;
        models.Report.getReportById(loadReportId)
            .then(async ({data}) => {
              dispatch(setDesignerMode(loadReportType));
              await loadReport(data);
              if (response.data.promptYn === 'Y' || noFilter) {
                querySearch();
              }
            }).catch((e) => {
              console.log(e);
            });
        models.Report.getLinkReportList(loadReportId)
            .then((res) => {
              if (res.data ? res.data === undefined : true) {
                console.log('링크된 보고서가 없습니다.');
              } else {
                const linkReports = res.data.linkReportDTOList;
                dispatch(setLinkReport(linkReports));
              }
            }).catch((e) => {
              console.log(e);
            });
      }).catch((e) => {
        console.log(e);
      });
      return;
    }

    if (reportId) {
      let reportType = params.get('reportType');

      const selectDesignerMode = (data) => {
        if (data.spread) {
          return DesignerMode['EXCEL'];
        } else {
          if (data.item.adHocOption) {
            return DesignerMode['AD_HOC'];
          }
        }

        return DesignerMode['DASHBOARD'];
      };

      models.Report.getReportById(
          reportId).then(async ({data}) => {
        if (!reportType) {
          reportType = selectDesignerMode(data);
        }
        dispatch(setDesignerMode(reportType));
        await loadReport(data);

        if (data?.reports[0]?.options?.promptYn === 'Y' || noFilter) {
          querySearch();
        }
      }).catch((e) => {
        console.log(e);
      });
      models.Report.getLinkReportList(
          reportId).then((res) => {
        if (res.data ? res.data === undefined : true) {
          console.log('링크된 보고서가 없습니다.');
        } else {
          const linkReports = res.data.linkReportDTOList;
          dispatch(setLinkReport(linkReports));
        }
      }).catch((e) => {
        console.log(e);
      });
      const newWindowLinkParamInfo =
        JSON.parse(sessionStorage.getItem('newWindowLinkParamInfo'));
      if (newWindowLinkParamInfo) {
        dispatch(setNewLinkParamInfo(newWindowLinkParamInfo));
      } else {
        console.log('연결보고서 정보가 존재하지 않습니다.');
      }
    }
  }, []);

  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
      marginHeight={fullscreen ? '0px' : '10px'}
      className={fullscreen ? 'viewer-full-screen' : ''}
      headerHeight={noHeader || fullscreen ? '0px' : theme.size.headerHeight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <FilterBar
          visible={!noFilter}
          fullscreen={fullscreen}
          useFullscreenButton={true}
          handleFullscreen={() => {
            if (!fullscreen) {
              setReportListOpened(false);
              setDataColumnOpened(false);
            }
            setFullscreen(!fullscreen);
          }}
          useSearchButton={true}
          buttons={fullscreen ? [] : buttons}/>
        <StyledWrapper>
          <CustomDrawer
            useExpandButton={false}
            index={0}
            opened={reportListOpened}
            margin={'0px 0px 10px 10px'}
            render={() => <ReportTabs reportData={reportData}/>}
            visible={showReportList}
            style={{
              paddingTop: noFilter ? '10px' : '0px'
            }}
          >
            <CustomDrawer
              useExpandButton={false}
              index={1}
              style={enabled ? {paddingLeft: '10px'} : {}}
              margin={'0px'}
              opened={dataColumnOpened}
              component={ViewerDataAttributePanels}
              visible={useAttributeList}
            >
              <Wrapper>
                <ReportContentWrapper>
                  <ReportContent>
                    {report && report.reportId != 0 &&
                      (report.options.reportType == 'Excel' ?
                        <SpreadViewer reportId={report.reportId} /> :
                        <ItemBoards reportId={report.reportId}/>)
                    }
                  </ReportContent>
                </ReportContentWrapper>
              </Wrapper>
            </CustomDrawer>
          </CustomDrawer>
        </StyledWrapper>
      </DragDropContext>
    </Content>
  );
};

export default LinkViewerContent;
