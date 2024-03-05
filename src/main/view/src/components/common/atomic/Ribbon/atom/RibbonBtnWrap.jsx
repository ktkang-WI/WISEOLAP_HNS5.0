import {getTheme} from 'config/theme';
import styled from 'styled-components';

const theme = getTheme();

const Wrap = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  display: flex;
  position: relative;

  &:nth-child(n) {
    margin-left: 10px;
    margin-right: 8px;
    float: left;
  }

  &:last-child {
    float: right;
    margin-right: 20px;
  }

  &:nth-child(2) {
    @media screen and (max-width: 900px) {
      display: none;
    }
  }

  &:nth-child(3) {
    @media screen and (max-width: 1280px) {
      display: none;
    }
  }

  &:nth-child(n):not(:last-child)::before {
    content: '';
    position: absolute;
    top: 16.5%;
    right: -8px; /* Adjust this value to match the margin-right */
    width: 1px; /* Width of the border */
    height: 66%;
    background-color: ${theme.color.breakLine};
  }
`;
const RibbonBtnWrap = ({children}) => {
  return (
    <Wrap>
      {children}
    </Wrap>
  );
};
export default RibbonBtnWrap;
