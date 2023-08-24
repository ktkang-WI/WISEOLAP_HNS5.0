import Drawer from 'devextreme-react/drawer';
import Wrapper from '../atoms/Wrapper';

const AttributeTabsDrawer = ({children, ...props}) => {
  return (
    <Wrapper>
      <Drawer
        opened={true}
        position='left'
        openedStateMode='shrink'
        revealMode='slide'
        {...props}
      >
        {children}
      </Drawer>
    </Wrapper>
  );
};

export default AttributeTabsDrawer;
