import {MenuItem, SubMenu} from '@szhsin/react-menu';
import LabelImageButton from '../../Common/Button/LabelImageButton';
import styled from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Wrap = styled.div`
  list-style: none;
  width: 150px;
  height: auto;
  background-color: ${theme.color.popoverBackground};
  border-radius: 5px;
  box-shadow: ${theme.color.boxShadow};
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
  border-top: 1px solid #000; /* 선 두께 */
  border-right: 1px solid #000; /* 선 두께 */
  transform: rotate(45deg); /* 각도 */
}
`;

// export 1 라벨아이콘만.
export const PopoverLabelImageBtn = ({label, imgSrc, onClick}) => {
  return (
    <MenuItem>
      <LabelImageButton
        label={label}
        imgSrc={imgSrc}
        height='60px'
        width='60px'
        onClick={onClick}
      />
    </MenuItem>
  );
};

// export 2 텍스트만 + 이미지.
export const PopoverTextBtn = ({label, onClick}) => {
  return (
    <PointerWrap>
      <MenuItem
        style={{padding: '5px'}}
        onClick={onClick}
      >
        {label}
      </MenuItem>
    </PointerWrap>
  );
};

// export 3 subMenu 사용 팝오버
export const PopoverSubMenu = ({label, visible, contents}) => {
  return (
    <PointerWrap>
      <SubMenu id='subMenu' label={label}>
        <Wrap>
          {contents && visible && contents.map((i, idx) => {
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
