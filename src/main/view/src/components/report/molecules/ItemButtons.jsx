import ItemButton from '../atoms/ItemButton';
import tempImg from 'assets/image/icon/button/download_new.png';
import tempImg2 from 'assets/image/icon/button/close.png';
import {styled} from 'styled-components';

const Wrapper = styled.div`
  padding-right: 10px;
`;

const ItemButtons = () => {
  return (
    <Wrapper>
      <ItemButton src={tempImg} title="다운로드"></ItemButton>
      <ItemButton src={tempImg2} imgWidth="16px" title="닫기"></ItemButton>
    </Wrapper>
  );
};
export default ItemButtons;
