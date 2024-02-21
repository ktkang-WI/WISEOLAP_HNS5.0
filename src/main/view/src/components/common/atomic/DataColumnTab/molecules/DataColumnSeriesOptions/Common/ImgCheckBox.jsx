import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import {useState} from 'react';
import styled from 'styled-components';
import expandIcon from 'assets/image/icon/button/arrow.png';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  border-radius: 10px;
  color: ${theme.color.gray600};
  border: 1px solid ${theme.color.gray100};
  margin-top: 20px;
  box-sizing: border-box;

  & + & {
    margin-top: 10px;
  }
`;

const StyledUl = styled.ul`
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px 15px;
  padding-bottom: 10px;
  list-style-type: none;
`;

const StyledLi = styled.li`
  display: inline-block;
  position: relative;

  &:hover .tooltip{
    display: block;
  }
`;

const StyledTitle = styled.div`
  height: 38px;
  font: ${theme.font.expandPanelTitle};
  line-height: 38px;
  padding: 0px 20px;
  cursor: pointer;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    height: 15px;
    width: 15px;
    right: 20px;
    transform: rotate(${(props) => props.expanded ? '270deg' : '90deg'});
    top: 11px;
    background: url(${expandIcon}) no-repeat;
    background-position: center;
  }
`;

const Img = styled.img`
  display: block;
  margin: 0 auto;
`;

const SubTitle = styled.div`
  display: none;
  font-size: 0.75rem;
  font-weight: 400;
  position: absolute;
  top: 60px;
  left: 50%;
  width: auto;
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

const Label = styled.label`
  border: 1px solid #fff;
  padding: 5px;
  width: 48px;
  height: 48px;
  display: block;
  position: relative;
  margin: 5px;
  cursor: pointer;

  &:before {
    background-color: white;
    color: white;
    content: " ";
    display: block;
    border-radius: 50%;
    border: 1px solid grey;
    position: absolute;
    top: -5px;
    left: -5px;
    width: 15px;
    height: 15px;
    text-align: center;
    line-height: 14px;
    transition-duration: 0.4s;
    transform: scale(0);
  }

  img {
    height: 100%;
    width: 100%;
    transition-duration: 0.2s;
    transform-origin: 50% 50%;
  }
`;

const StyledInput = styled.input`
  display: none;

  & + label {
    border-radius: 6px;
    border-color: ${theme.color.gray100};
  }

  &:checked + label{
    border-color: ${theme.color.primary};
  }

  &:checked + label img {
    transform: scale(0.9);
    z-index: -1;
  }
`;


const CheckBox = ({onValueChanged, id, src, title, checked}) => (
  <StyledLi>
    <StyledInput type="checkbox" id={id} onChange={onValueChanged}
      checked={checked}/>
    <Label htmlFor={id}>
      <Wrapper>
        <Img src={src} title={title}/>
      </Wrapper>
    </Label>
    <SubTitle className='tooltip'>{title}</SubTitle>
  </StyledLi>
);

const CheckBoxs = ({onValueChanged, checkboxs, ...props}) => {
  return (
    <StyledUl>
      {checkboxs.map((item, index) =>
        <CheckBox
          key={index}
          title={item.title}
          id={item.type}
          src={item.src}
          onValueChanged={onValueChanged}
          checked={item.checked}/>
      )}
    </StyledUl>
  );
};

export const ImgCheckBox = ({onValueChanged, ...props}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <StyledWrapper>
      <StyledTitle
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}>
        {props.title}
      </StyledTitle>
      {
        expanded &&
        <CheckBoxs
          onValueChanged={onValueChanged}
          title={props.title} checkboxs={props.checkboxs}/>
      }
    </StyledWrapper>
  );
};
