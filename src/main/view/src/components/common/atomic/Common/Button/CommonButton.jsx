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

  & + & {
    margin-left: 5px;
  }
`;

const CommonButton = ({
  type='primary',
  children,
  width='100%',
  height='32px',
  minWidth='50px',
  maxWidth='100%',
  margin='0px',
  padding='0px 1px',
  ...props
}) => {
  const themeType = {
    'primary': {
      background: theme.color.primaryGradient,
      hoverBackground: theme.color.primaryGradientHover,
      color: theme.color.secondaryFont,
      border: 'none',
      font: theme.font.button
    },
    'secondary': {
      background: theme.color.secondaryGradient,
      hoverBackground: theme.color.secondaryGradientHover,
      color: theme.color.primaryFont,
      border: 'solid 1px ' + theme.color.primaryBorder,
      font: theme.font.button
    }
  };


  return (
    <Button
      width={width}
      height={height}
      minWidth={minWidth}
      maxWidth={maxWidth}
      margin={margin}
      {...(themeType[type]? themeType[type] : themeType['primary'])}
      {...props}
    >
      {children}
    </Button>
  );
};

export default CommonButton;
