import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TabMenu from 'components/config/molecules/common/TabMenu';
import {getTheme} from 'config/theme';

const theme = getTheme();

const ConfigTabs = ({
  tabItems = [],
  onChangedValue = () => {},
  page = 0,
  reRender = false
}) => {
  const height = 'calc(100% - 60px)';
  return (
    <Wrapper
      display='flex'
      maxHiehgt
      height='calc(100% - 60px)'
      direction='row'
      padding='10px 0px 0px 0px'
      style={{
        maxHeight: height,
        minHeight: height
      }}
    >
      <TabMenu
        items={tabItems}
        onChangedValue={onChangedValue}
      />
      <Wrapper
        className='section'
        style={{
          borderRadius: '10px',
          border: 'solid 1px ' + theme.color.breakLine,
          background: theme.color.panelColor,
          overflow: 'hidden',
          padding: '15px'
        }}
      >
        {tabItems.map((item) => {
          const Component = item.component;
          const cProps = item.props || {};

          if (reRender && item.value != page) {
            return null;
          }

          return (
            <Wrapper
              key={item.value}
              display={item.value == page ? 'block' : 'none'}
            >
              <Component
                {...cProps}
              >
              </Component>
            </Wrapper>
          );
        })}
      </Wrapper>
    </Wrapper>
  );
};

export default ConfigTabs;
