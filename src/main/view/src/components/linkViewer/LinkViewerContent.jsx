import {DragDropContext} from 'react-beautiful-dnd';
import CustomDrawer from '../common/atomic/Common/Interactive/CustomDrawer';
import ReportContent
  from 'components/common/atomic/Common/Content/ReportContent';
import Content from 'components/common/atomic/Common/Content/Content';
import ReportContentWrapper
  from 'components/common/atomic/Common/Wrap/ReportContentWrapper';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
// import ViewerFilterBar
//   from 'components/common/atomic/FilterBar/organism/ViewerFilterBar';
import ViewerDataAttributePanels
  from 'components/viewer/ViewerDataAttributePanels';
import ItemBoard from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
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
  const {loadReport} = useReportSave();
  const dispatch = useDispatch();
  const {setDesignerMode} = ConfigSlice.actions;
  const buttons = [
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      models.Report.retrieveLinkReport(token).then((response) => {
        const loadReportId = response.data.reportId;
        const loadReportUserId = response.data.userId;
        const loadReportType = response.data.reportType;
        models.Report.getReportById(
            loadReportUserId,
            loadReportId).then(({data}) => {
          dispatch(setDesignerMode(loadReportType));
          loadReport(data);
        });
      });
    }
  }, []);

  return (
    <Content
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
      marginHeight={'10px'}
      headerheight={theme.size.headerheight}
    >
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <FilterBar useSearchButton={true} buttons={buttons}/>
        <StyledWrapper>
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
                  {report && report.reportId != 0 &&
                    (report.options.reportType == 'Excel' ?
                      <SpreadViewer /> :
                      <ItemBoard/>)
                  }
                </ReportContent>
              </ReportContentWrapper>
            </Wrapper>
          </CustomDrawer>
        </StyledWrapper>
      </DragDropContext>
    </Content>
  );
};

export default LinkViewerContent;
