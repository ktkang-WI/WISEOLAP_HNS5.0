import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px ${theme.color.breakLine} solid;
  display: flex;
  font: ${theme.font.modalTitle};
  color: ${theme.color.primaryFont};
  height: 40px;
  padding-left: 15px;
  align-items: center;
  box-sizing: border-box;
  cursor: move;
`;

const Header = ({children}) => {
  return (
    <Wrapper className='modal-header'>
      {children}
    </Wrapper>
  );
};

export default Header;
