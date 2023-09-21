import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px ${theme.color.breakLine} solid;
  display: flex;
  font: ${theme.font.modalTitle};
  color: ${theme.color.primaryFont};
  height: 30px;
  padding-left: 15px;
  align-items: center;
  box-sizing: border-box;
  cursor: move;
`;

const Header = () => {
  return (
    <Wrapper className='modal-header'>
      X축 설정
    </Wrapper>
  );
};

export default Header;
