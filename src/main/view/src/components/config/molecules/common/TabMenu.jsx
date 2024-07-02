import styled from 'styled-components';
import {getTheme} from 'config/theme';
import {useState} from 'react';

const theme = getTheme();

const Background = styled.div`
  min-width: 250px;
  height: 100%;
  border-radius: 10px;
  border: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  padding: 10px;
`;

const Item = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
  line-height: 40px;
  text-align: left;
  padding: 10px;
  cursor: pointer;
  font: ${theme.font.common};
  border-radius: 6px;
  box-sizing: border-box;


  &:hover {
    background-color: ${theme.color.gray50};
  }

  & + & {
    border-top: 1px solid ${theme.color.gray100};
  }

  &.selected {
    background-color: ${theme.color.primary2};
    color: white;
  }

  &.selected::after {
    font-family: 'DXIcons';
    content: '\\f010';
    position: absolute;
    right: 10px;
    line-height: 20px;
  }
`;

const TabMenu = ({items = [], onChangedValue = () => {}}) => {
  const [selection, setSelection] = useState(items[0]?.value || 'null');

  // 리렌더링 시 자동으로 0번 탭 선택
  onChangedValue(selection);

  return (
    <Background>
      {items.map((item) =>
        <Item
          key={item.value}
          onClick={() => {
            setSelection(item.value);
            onChangedValue(item.value);
          }}
          className={selection == item.value && 'selected'}
        >
          {item.text}
        </Item>
      )
      }
    </Background>
  );
};

export default TabMenu;
