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
`;


const ModalPanel = ({title, children, ...props}) => {
  return (
    <StyledWrapper {...props}>
      <ModalPanelTitle>{title}</ModalPanelTitle>
      <Content>
        {children}
      </Content>
    </StyledWrapper>
  );
};

export default ModalPanel;
