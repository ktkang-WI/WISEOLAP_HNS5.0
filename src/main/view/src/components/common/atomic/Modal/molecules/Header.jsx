import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  font: ${theme.font.modalTitle};
  color: ${theme.color.gray600};
  background: ${theme.color.gray50};
  height: 48px;
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
