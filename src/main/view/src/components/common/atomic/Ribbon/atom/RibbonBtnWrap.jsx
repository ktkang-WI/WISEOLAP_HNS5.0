import {getTheme} from 'config/theme';
import styled, {css} from 'styled-components';

const theme = getTheme();

const Wrap = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  display: flex;
  position: relative;
  ${(props) =>
    props.loaction !== 'querySearch' &&
    css`
    margin-left: 10px;
    margin-right: 8px;
    float: left;
  `}
  ${(props) =>
    props.loaction === 'querySearch' &&
    css`
    margin-right: 20px;
    float: right;
  `}
  ${(props) =>
    props.loaction === 'itemOptionsManagement' &&
    css`
    @media screen and (max-width: 1280px) {
      display: none;
    }
  `}

  ${(props) =>
    props.loaction === 'chartManagement' &&
    css`
    @media screen and (max-width: 900px) {
      display: none;
    }
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    ${(props) =>
    props.loaction !== 'querySearch' &&
      css`
      right: -8px; /* Adjust this value to match the margin-right */
    `}
    ${(props) =>
    props.loaction === 'querySearch' &&
      css`
      right: 69px; /* Adjust this value for the border width */
    `}
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
  }
`;
const RibbonBtnWrap = ({children, loaction}) => {
  return (
    <Wrap loaction={loaction}>
      {children}
    </Wrap>
  );
};
export default RibbonBtnWrap;
