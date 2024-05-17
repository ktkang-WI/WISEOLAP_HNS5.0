import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import React from 'react';

const theme = getTheme();

const Panel = styled.div`
  width: ${(props) => props.width};
  min-width: 40px;
  height: 100%;
  display: inline-block;
  float: ${(props) => props.position};
  cursor: ${(props) => props.cursor};
  vertical-align: top;
  box-sizing: border-box;
  flex-shrink: 0;
  // align-items: center;
`;

const Wrapper = styled.div`
  height: ${(props) => props.height};
  display: flex;
  justify-content: ${(props) => props.item_alignment};
  align-items: ${(props) => props.vertical_alignment};
  flex-direction: row;
`;

const BreakLine = styled.div`
  display: none;
  width: 1px;
  height: 70%;
  background: ${theme.color.breakLine};
`;

const HeaderPanel = ({
  width='60px',
  height='100%',
  breakLine=true,
  children,
  itemAlignment='center',
  position='left',
  cursor='default',
  verticalAlignment='center',
  onClick=() => {}
}) => {
  return (
    <Panel
      width={width}
      height={height}
      position={position}
      onClick={onClick}
      cursor={cursor}
    >
      <Wrapper
        height={height}
        item_alignment={itemAlignment}
        vertical_alignment={verticalAlignment}>
        {children}
      </Wrapper>
      {breakLine && (<BreakLine/>)}
    </Panel>
  );
};


export default React.memo(HeaderPanel);
