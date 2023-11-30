import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import CreateRibbonBtns from '../molecules/CreateRibbonBtns';

const theme = getTheme();

const StyledRibbon = styled.div`
  width: 100vw;
  height: ${theme.size.ribbonHeight};
  border-bottom: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  padding-left: ${theme.size.snbWidth};
`;

const Ribbon = () => {
  return (
    <StyledRibbon>
      <CreateRibbonBtns
        items={[
          'NewReport',
          'Dataset',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport',
          'ConnectReport'
        ]}
        className='test'
        loaction={'reportManagement'}/>
      <CreateRibbonBtns
        items={[
          'AddContainer',
          'AddChart',
          'AddPivotGrid',
          'AddGrid',
          'AddCustomChart'
        ]}
        loaction={'chartManagement'}/>
      {/* <CustomButtonWrapper> */}
      {/* 필요시 화살표 버튼 추가(prev) */}
      <CreateRibbonBtns
        items={[
          'CaptionView',
          'NameEdit',
          'Rotate',
          'XAxisSetting',
          'YAxisSetting',
          'ExtraAxisSetting',
          'ShowColorLegend',
          'SeriesType',
          'Palette',
          'ColorEdit',
          'PointLabel'
        ]}
        loaction={'itemOptionsManagement'}/>
      {/* 필요시 화살표 버튼 추가(next) */}
      {/* </CustomButtonWrapper> */}
      <CreateRibbonBtns
        items={[
          'QuerySearch'
        ]}
        loaction={'querySearch'}/>
    </StyledRibbon>
  );
};

export default Ribbon;
