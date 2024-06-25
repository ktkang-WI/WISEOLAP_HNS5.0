import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atomic/Common/Interactive/CustomDrawer';
import ReportContent
  from 'components/common/atomic/Common/Content/ReportContent';
import Content from 'components/common/atomic/Common/Content/Content';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ReportTabs from 'components/common/atomic/ReportTab/organism/ReportTabs';
import {getTheme} from 'config/theme';
// import ViewerFilterBar
//   from 'components/common/atomic/FilterBar/organism/ViewerFilterBar';
import ViewerDataAttributePanels
  from 'components/viewer/ViewerDataAttributePanels';
import ItemBoard from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {useSelector} from 'react-redux';
import {selectCurrentReport,
  selectReports} from 'redux/selector/ReportSelector';
import useDrag from 'hooks/useDrag';
import SpreadViewer from
  'components/report/atomic/spreadBoard/organisms/SpreadViewer';
import FilterBar from 'components/common/atomic/FilterBar/organism/FilterBar';
import {styled} from 'styled-components';
import {useMemo, useState} from 'react';
import localizedString from 'config/localization';
import reportListIcon from 'assets/image/icon/button/report_list.png';
import reportListActiveIcon
  from 'assets/image/icon/button/report_list_active.png';
import attributeListIcon from 'assets/image/icon/button/attribute_list.png';
import attributeListActiveIcon
  from 'assets/image/icon/button/attribute_list_active.png';
import reloadImg from 'assets/image/icon/button/reset.png';
import models from 'models';


const theme = getTheme();

const StyledWrapper = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  min-height: 0px;
  margin-bottom: 0px;
`;

const ViewerContent = ({children}) => {
  const {onDragEnd, onDragStart} = useDrag();
  const report = useSelector(selectCurrentReport);
  const reports = useSelector(selectReports);

  const [reportListOpened, setReportListOpened] = useState(true);
  const [dataColumnOpened, setDataColumnOpened] = useState(false);
  const [reportData, setReportData] = useState();
  const componentCache = useMemo(() => ({}), []);

  const useAttributeList = report.options.reportType == 'AdHoc';

  const getComponent = (id) => {
    if (!componentCache[id]) {
      componentCache[id] = (report.options.reportType == 'Excel' ?
        <SpreadViewer key={id} reportId={id}/> :
        <ItemBoard key={id} reportId={id}/>);
    }

    return componentCache[id];
  };

  const buttons = [
    {
      icon: reportListIcon,
      activeIcon: reportListActiveIcon,
      label: localizedString.reportList,
      width: '85px',
      type: 'expand',
      visible: true,
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
      visible: true,
      width: '20px',
      type: 'icon',
      onClick: () => {
        models.Report.getList(null, 'viewer').then(({data}) => {
          setReportData(data);
        });
      }
    }
  ];

  const enabled = report.options.reportType == 'AdHoc' && dataColumnOpened;

  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
      marginHeight={'10px'}
      headerHeight={theme.size.headerHeight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <FilterBar useSearchButton={true} buttons={buttons}/>
        <StyledWrapper>
          <CustomDrawer
            useExpandButton={false}
            index={0}
            opened={reportListOpened}
            margin={'0px 0px 10px 10px'}
            render={() => <ReportTabs reportData={reportData}/>}
          >
            {/* TODO: 추후 권한 적용 */}
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
                    {reports.map((r) => {
                      if (r.reportId == 0) return;
                      if (r.reportId == report.reportId) {
                        return (
                          <Wrapper key={r.reportId} style={{display: 'block'}}>
                            {getComponent(r.reportId)}
                          </Wrapper>
                        );
                      }
                      return (
                        <Wrapper key={r.reportId} style={{display: 'none'}}>
                          {getComponent(r.reportId)}
                        </Wrapper>
                      );
                    })}
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

export default ViewerContent;
