import {MenuItem, SubMenu} from '@szhsin/react-menu';
import LabelImageButton from '../../Common/Button/LabelImageButton';
import styled from 'styled-components';

const Wrap = styled.div`
  list-style: none;
  width: 150px;
  height: auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(51, 51, 51, 0.3);
  `;

const PointerWrap = styled.div`
  cursor: pointer;
  position: relative;
`;
const ArrowImage = styled.div`
  position: absolute;
  right: 15px; 
  top: 8px; 
  content: '';
  width: 5px; /* 사이즈 */
  height: 5px; /* 사이즈 */
  border-top: 2px solid #000; /* 선 두께 */
  border-right: 2px solid #000; /* 선 두께 */
  transform: rotate(45deg); /* 각도 */
}
`;

// export 1 라벨아이콘만.
export const PopoverLabelImageBtn = ({item}) => {
  return (
    <LabelImageButton
      label={item.label}
      imgSrc={item.src}
      height='60px'
      width='60px'
      tiile={item.label}
      onClick={item.onClick}
    />
  );
};

// export 2 텍스트만 + 이미지.
export const PopoverTextBtn = ({item}) => {
  return (
    <PointerWrap>
      <MenuItem
        style={{padding: '5px'}}
        onClick={item.onClick}
      >
        {item.label}
      </MenuItem>
    </PointerWrap>
  );
};

// export 3 subMenu 사용 팝오버
export const PopoverSubMenu = ({item}) => {
  return (
    <PointerWrap>
      <SubMenu id='subMenu' label={item.label}>
        <Wrap>
          {item.contents.map((i, idx) => {
            return i.visible &&
              <MenuItem
                style={{padding: '5px'}}
                key={idx}
                onClick={i.onClick}
              >
                {i.label}
              </MenuItem>;
          })}
        </Wrap>
      </SubMenu>
      <ArrowImage/>
    </PointerWrap>
  );
};

// export 4. 버튼있는 팝오버.
export const PopoverUseBtn = () => {
  return ('');
};
// ... 기타 다른 부분 추가
