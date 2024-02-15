import Drawer from 'devextreme-react/drawer';
import Wrapper from '../Wrap/Wrapper';
import {useRef, useState} from 'react';
import {styled} from 'styled-components';
import expandImg from 'assets/image/icon/button/expand.png';

const ExpandButton = styled.div`
  width: 20px;
  height: 25px;
  background: #f5f5f5;
  position: absolute;
  bottom: ${(props) => props.bottom + 'px'};
  z-index: 20;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #ddd;
  box-sizing: border-box;
  border-left: none;
  display: ${(props) => props.visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
`;

const CustomDrawer = ({
  children, index=0, defaultValue=true, visible=true, ...props
}) => {
  const [opened, setOpened] = useState(defaultValue);
  const ref = useRef(null);

  const expandDrawer = () => {
    setOpened(!opened);
  };

  const ExpandImage = styled.img`
    width: 15px;
    height: 15px;
    transform: rotate(${opened ? '90deg' : '270deg'});
  `;

  return (
    <Wrapper>
      <Drawer
        ref={ref}
        opened={opened && visible}
        position='left'
        openedStateMode='shrink'
        revealMode={'slide'}
        // NOTE: 뷰어에서 사용시 보고서 전환시 부자연스러움.
        // 애니메이션 해제
        animationEnabled={false}
        {...props}
      >
        <ExpandButton
          visible={visible}
          onClick={expandDrawer}
          bottom={index * 25}
        >
          <ExpandImage src={expandImg}></ExpandImage>
        </ExpandButton>
        {children}
      </Drawer>
    </Wrapper>
  );
};

export default CustomDrawer;
