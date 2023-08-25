import {styled, css} from 'styled-components';
import {getTheme} from '../../../config/theme';
import React from 'react';

const theme = getTheme();

const Panel = styled.div`
  width: ${(props) => props.width};
  min-width: 40px;
  height: 100%;
  display: block;
  float: ${(props) => props.position};
  vertical-align: top;
  box-sizing: border-box;

  ${(props) => props.leftborder && css`
    border-left: solid 1px ${theme.color.breakLine};
  `}

  ${(props) => props.rightborder && css`
    border-left: solid 1px ${theme.color.breakLine};
  `}
`;

const Wrapper = styled.div`
  height: ${(props) => props.height};
  width: 100%;
  display: flex;
  justify-content: ${(props) => props.item_alignment};
  align-items: center;
  flex-direction: row;
`;

const RibbonPanel = ({
  width='auto',
  height='100%',
  leftborder,
  rightborder,
  children,
  itemAlignment='center',
  position='left'
}) => {
  return (
    <Panel
      width={width}
      height={height}
      leftborder={leftborder}
      rightborder={rightborder}
      position={position}
    >
      <Wrapper height={height} item_alignment={itemAlignment}>
        {children}
      </Wrapper>
    </Panel>
  );
};

export default React.memo(RibbonPanel);
