import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const Button = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.background};
  color: ${(props) => props.color};
  border: ${(props) => props.border};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  min-width: ${(props) => props.minwidth};
  max-width: ${(props) => props.maxwidth};
  margin: ${(props) => props.margin};
  font: ${(props) => props.font};
  box-sizing: border-box;
  padding: ${(props) => props.padding};
  
  border-radius:${(props) => props.borderradius || '0px'};

  &:hover {
    background: ${(props) => props.hoverbackground};
  }

  &:active {
    background: ${(props) => props.activebackground};
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
  minwidth='50px',
  maxwidth='100%',
  margin='0px',
  padding='0px 1px',
  ...props
}) => {
  const themeType = {
    'primary': {
      background: theme.color.primary,
      hoverbackground: theme.color.primaryHover,
      activebackground: theme.color.primaryActive,
      color: theme.color.white,
      border: 'none',
      font: theme.font.button,
      minwidth: '60px',
      borderradius: '8px'
    },
    'secondary': {
      background: theme.color.secondary,
      hoverbackground: theme.color.secondaryHover,
      activebackground: theme.color.secondaryActive,
      color: theme.color.gray600,
      border: 'solid 1px ' + theme.color.gray300,
      font: theme.font.button,
      minwidth: '60px',
      borderradius: '8px'
    },
    'whiteRound': {
      background: theme.color.white,
      border: 'solid 1px ' + theme.color.gray200,
      hoverbackground: '#F2F2F2',
      activebackground: '#E6E6E6',
      color: theme.color.gray600,
      font: theme.font.smallButton,
      borderradius: '74px'
    }
  };


  return (
    <Button
      width={width}
      height={height}
      minwidth={minwidth}
      maxwidth={maxwidth}
      margin={margin}
      {...(themeType[type]? themeType[type] : themeType['primary'])}
      {...props}
    >
      <span>{children}</span>
    </Button>
  );
};

export default CommonButton;
