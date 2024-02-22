import {MenuItem, SubMenu} from '@szhsin/react-menu';
import LabelImageButton from '../../Common/Button/LabelImageButton';
import styled from 'styled-components';
import {getTheme} from 'config/theme';
import arrowImg from 'assets/image/icon/button/arrow.png';

const theme = getTheme();

const Wrap = styled.div`
  list-style: none;
  width: auto;
  height: auto;
  background-color: ${theme.color.popoverBackground};
  font: ${theme.font.ribbonSubMenu};
  border-radius: 5px;
  box-shadow: ${theme.color.boxShadow};

  li {
    padding: 0px 8px;
    height: 28px;
    line-height: 28px;
    color: ${theme.color.gray500};
  }

  li:hover {
    background-color: #3679DA;
    color: ${theme.color.white};
  }
  `;

const PointerWrap = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px 8px;
  justify-content: space-between;
  height: 28px;
  font: ${theme.font.ribbonSubMenu};
  &:hover {
    background-color: #3679DA;
    color: var(--white);

    img {
      -webkit-filter: brightness(0) invert(1); 
      filter: brightness(0) invert(1);
    }
  }
`;
const Arrow = styled.img`
  margin-left: 20px;
  padding: 10px 5px;
  width: 10px;
  height: 10px;
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
                key={idx}
                onClick={i.onClick}
              >
                {i.label}
              </MenuItem>;
          })}
        </Wrap>
      </SubMenu>
      <Arrow src={arrowImg}/>
    </PointerWrap>
  );
};

// export 4. 버튼있는 팝오버.
export const PopoverUseBtn = () => {
  return ('');
};
// ... 기타 다른 부분 추가
