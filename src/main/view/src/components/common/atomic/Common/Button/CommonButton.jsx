import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import {Popover} from 'devextreme-react';

const theme = getTheme();

const Button = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: ${(props) => props.justify};
  align-items: center;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  border: ${(props) => props.border};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  min-width: ${(props) => props.minWidth};
  max-width: ${(props) => props.maxWidth};
  margin: ${(props) => props.margin};
  font: ${(props) => props.font};
  box-sizing: border-box;
  padding: ${(props) => props.padding};
  
  border-radius:${(props) => props.borderRadius || '0px'};

  &:hover {
    background: ${(props) => props.hoverBackground};
  }

  &:active {
    background: ${(props) => props.activeBackground};
  }

  & + & {
    margin-left: 5px;
  }

  & img {
    vertical-align: middle;
  }
  & span {
    line-height: ${(props) => props.height};
  }
`;

const CommonButton = ({
  type='primary',
  children,
  width='100%',
  height='40px',
  minWidth='50px',
  maxWidth='100%',
  margin='0px',
  padding='0px 1px',
  justify= 'center',
  usePopover= false,
  ...props
}) => {
  const themeType = {
    'primary': {
      background: theme.color.primary,
      hoverBackground: theme.color.primaryHover,
      activeBackground: theme.color.primaryActive,
      color: theme.color.white,
      border: 'none',
      font: theme.font.button,
      margin: '2px',
      borderRadius: '8px'
    },
    'secondary': {
      background: theme.color.secondary,
      hoverBackground: theme.color.secondaryHover,
      activeBackground: theme.color.secondaryActive,
      color: theme.color.gray600,
      border: 'solid 1px ' + theme.color.gray300,
      font: theme.font.button,
      margin: '2px',
      borderRadius: '8px'
    },
    'whiteRound': {
      background: theme.color.white,
      border: 'solid 1px ' + theme.color.gray200,
      hoverBackground: '#F2F2F2',
      activeBackground: '#E6E6E6',
      color: theme.color.gray600,
      font: theme.font.smallButton,
      borderRadius: '74px'
    },
    'onlyImageText': {
      background: theme.color.white,
      color: theme.color.gray500,
      font: theme.font.smallButton
    },
    'selectable': {
      background: theme.color.white,
      hoverBackground: '#F2F2F2',
      color: theme.color.gray600,
      font: theme.font.smallButton,
      border: 'solid 1px ' + theme.color.gray200,
      borderRadius: '4px'
    },
    'selected': {
      background: '#F6FAFF',
      hoverBackground: '#eaf4fa',
      color: theme.color.gray600,
      font: theme.font.smallButton,
      border: 'solid 1px #BCD1F0',
      borderRadius: '4px'
    }
  };


  return (
    <Button
      width={width}
      height={height}
      minWidth={minWidth}
      maxWidth={maxWidth}
      margin={margin}
      justify={justify}
      padding={padding}
      {...(themeType[type]? themeType[type] : themeType['primary'])}
      {...props}
    >
      <span>{children}</span>
      {/* 팝오버도 같이 사용하고 싶은 경우. default로 사용 안함.*/}
      {usePopover && <Popover
        target={'#' + props.id}
        contentRender={props.contentRender}
        // HeaderDefaultElement.js에 popover 속성 객체로 전달.
        {...props.popoverProps}
      />}
    </Button>
  );
};

export default CommonButton;
