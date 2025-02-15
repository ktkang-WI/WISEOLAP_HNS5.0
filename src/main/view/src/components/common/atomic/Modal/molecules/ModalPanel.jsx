import {styled} from 'styled-components';
import ModalPanelTitle from '../atoms/ModalPanelTitle';
import Wrapper from '../../Common/Wrap/Wrapper';

const StyledWrapper = styled(Wrapper)`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding:${(props) => props.padding || '0'}px;
  box-sizing: border-box;
`;

const Content = styled.div`
  height: calc(100% - 30px);
  width: 100%;
  padding-top: 10px;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  overflow-y: auto;
  white-space: pre-line;
`;


const ModalPanel = ({
  title,
  children,
  padding = '10',
  headerButtons,
  headerCheckBoxs,
  ...props
}) => {
  return (
    <StyledWrapper padding={padding} {...props}>
      <ModalPanelTitle
        buttons={headerButtons}
        checkBoxs={headerCheckBoxs}
      >{title}</ModalPanelTitle>
      <Content className='custom-scrollbar'>
        {children}
      </Content>
    </StyledWrapper>
  );
};

export default ModalPanel;
