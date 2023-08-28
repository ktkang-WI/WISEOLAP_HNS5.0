import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import React from 'react';

const theme = getTheme();

const Panel = styled.div`
  width: ${(props) => props.width};
  min-width: 40px;
  height: 100%;
  display: flex;
  float: ${(props) => props.position};
  vertical-align: top;
  box-sizing: border-box;
  align-items: center;
`;

const Wrapper = styled.div`
  height: ${(props) => props.height};
  width: calc(100% - 1px);
  display: flex;
  justify-content: ${(props) => props.item_alignment};
  align-items: center;
  flex-direction: row;
`;

const BreakLine = styled.div`
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
  position='left'
}) => {
  return (
    <Panel
      width={width}
      height={height}
      position={position}
    >
      <Wrapper height={height} item_alignment={itemAlignment}>
        {children}
      </Wrapper>
      {breakLine && (<BreakLine/>)}
    </Panel>
  );
};


export default React.memo(HeaderPanel);
