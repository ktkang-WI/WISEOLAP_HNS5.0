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
  const componentCache = useMemo(() => ({}), []);

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
      icon: '',
      label: localizedString.reportList,
      width: '100px',
      value: reportListOpened,
      onClick: () => {
        setReportListOpened(!reportListOpened);
      }
    },
    {
      icon: '',
      label: localizedString.dataAttributeList,
      width: '105px',
      value: dataColumnOpened,
      onClick: () => {
        setDataColumnOpened(!dataColumnOpened);
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
            component={ReportTabs}
          >
            {/* TODO: 추후 권한 적용 */}
            <CustomDrawer
              useExpandButton={false}
              index={1}
              style={enabled ? {paddingLeft: '10px'} : {}}
              margin={'0px'}
              opened={dataColumnOpened}
              component={ViewerDataAttributePanels}
              visible={report.options.reportType == 'AdHoc'}
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
