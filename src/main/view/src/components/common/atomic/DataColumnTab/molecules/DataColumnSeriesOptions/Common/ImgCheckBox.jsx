import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import styled from 'styled-components';

const StyledUl = styled.ul`
  width: 100%;
  height: 100%;
  list-style-type: none;
`;

const StyledLi = styled.li`
  display: inline-block;
`;

const StyledTitle = styled.h4`
  background-color: #f1f1f1;
  padding: 3px 5px;
  font-weight: 400;
`;

const Img = styled.img`
  display: block;
  margin: 0 auto;
`;

const SubTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const Label = styled.label`
  border: 1px solid #fff;
  padding: 5px;
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
    height: 35px;
    width: 35px;
    transition-duration: 0.2s;
    transform-origin: 50% 50%;
  }
`;

const StyledInput = styled.input`
  display: none;
  &:checked + Label{
    border-color: #ddd;
  }
  &:checked + Label:before{
    content: "✓";
    background-color: grey;
    transform: scale(1);
    z-index: 2;
  }
  &:checked + Label img {
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
        <SubTitle>{title}</SubTitle>
      </Wrapper>
    </Label>
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
  return (
    <Wrapper>
      <StyledTitle>{props.title}</StyledTitle>
      <CheckBoxs
        onValueChanged={onValueChanged}
        title={props.title} checkboxs={props.checkboxs}/>
    </Wrapper>
  );
};
