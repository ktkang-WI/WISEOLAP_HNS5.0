import {getTheme} from 'config/theme';
import styled from 'styled-components';

const theme = getTheme();


const BubbleTooltip = styled.div`
  display: none;
  font-size: 0.75rem;
  font-weight: 400;
  position: absolute;
  top: ${(props) => props.top || '60px'};
  left: 50%;
  width: auto;
  z-index: 99;
  white-space: nowrap;
  text-align: center;
  margin: 0 auto;
  transform: translateX(-50%);
  background: ${theme.color.white};
  border-radius: 2px;
  border: 1px solid ${theme.color.primary};
  padding: 3px 7px;
  color: ${theme.color.primary};
  box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, .15);

  &::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    transform: rotate(45deg);
    background: #ffffff;
    left: calc(50% - 2px);
    top: -3px;
    border-left: 1px solid ${theme.color.primary};
    border-top: 1px solid ${theme.color.primary};
  }
`;

export default BubbleTooltip;
