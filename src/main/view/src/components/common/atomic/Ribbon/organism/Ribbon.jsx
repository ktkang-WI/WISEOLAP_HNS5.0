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

// const CustomButtonWrapper = styled.div`
//   display: none; /* Hide by default */

//   @media screen and (min-width: 1280px) {
//     display: none;
//   }

//   @media screen and (max-width: 1700px) {
//     width: auto;
//     height: 100%;
//     text-align: left;
//     float: left;
//     display: flex;
//     margin-left: 8px;
//     margin-right: 8px;
//     position: relative;

//     &::before {
//       content: '';
//       position: absolute;
//       top: 0;
//       right: -8px; /* Adjust this value to match the margin-right */
//       height: 100%;
//       width: 1px; /* Width of the border */
//       background-color: ${theme.color.breakLine};
//     }

//     @media screen and (max-width: 1280px) {
//       display: none;
//     }

//   }
// `;

const Ribbon = () => {
  return (
    <StyledRibbon>
      <CreateRibbonBtns
        items={[
          'NewReport',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport',
          'ConnectReport'
        ]}
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
