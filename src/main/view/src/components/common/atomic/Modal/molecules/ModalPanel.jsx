import {styled} from 'styled-components';
import ModalPanelTitle from '../atoms/ModalPanelTitle';
import Wrapper from '../../Common/Wrap/Wrapper';

const StyledWrapper = styled(Wrapper)`
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding:${(props) => props.padding || '0'}px;
  box-sizing: border-box;
`;

const InnerContent = styled(Wrapper)`
  height: calc(100% - 50px);
  width: calc(100% - 16px);
  padding: 8px;
`;

const ModalPanel = ({title, children, ...props}) => {
  return (
    <StyledWrapper {...props}>
      <ModalPanelTitle>{title}</ModalPanelTitle>
      <InnerContent>
        {children}
      </InnerContent>
    </StyledWrapper>
  );
};

export default ModalPanel;
