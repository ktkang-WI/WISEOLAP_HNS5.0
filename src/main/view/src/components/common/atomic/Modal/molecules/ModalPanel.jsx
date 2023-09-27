import {styled} from 'styled-components';
import ModalPanelTitle from '../atoms/ModalPanelTitle';
import Wrapper from '../../Common/Wrap/Wrapper';

const StyledWrapper = styled(Wrapper)`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding:${(props) => props.padding || '0'}px;
  box-sizing: border-box;
`;


const ModalPanel = (props) => {
  return (
    <StyledWrapper {...props}>
      <ModalPanelTitle>{props.title}</ModalPanelTitle>
      <Wrapper>
        {props.children}
      </Wrapper>
    </StyledWrapper>
  );
};

export default ModalPanel;
