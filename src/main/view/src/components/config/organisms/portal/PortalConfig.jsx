import AddRibbonBtn from 'components/common/atomic/Ribbon/atom/AddRibbonBtn';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import saveReport from 'assets/image/icon/button/save.png';
import localizedString from 'config/localization';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';

const theme = getTheme();

const PortalConfig = () => {
  const height = 'calc(100% - 70px)';

  return (
    <Wrapper display='flex' direction='column'>
      <ConfigHeader style={{padding: '12px'}}>
        <AddRibbonBtn
          item={{
            'label': localizedString.save,
            'onClick': () => {},
            'imgSrc': saveReport
          }}
        />
      </ConfigHeader>
      <Wrapper
        display='flex'
        height={height}
        direction='row'
        style={{
          borderRadius: '10px',
          border: 'solid 1px ' + theme.color.breakLine,
          background: theme.color.panelColor,
          maxHeight: height,
          minHeight: height,
          marginTop: '10px'
        }}
      >
      </Wrapper>
    </Wrapper>
  );
};

export default PortalConfig;
