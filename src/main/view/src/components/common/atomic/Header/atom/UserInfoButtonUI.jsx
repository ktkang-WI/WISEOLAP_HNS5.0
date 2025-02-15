import division from 'assets/image/icon/button/Rectangle_327.png';
import styled from 'styled-components';

const Division = styled.img`
  src: ${(props) => props.src};
  padding: 0px 7px 2px 10px;
`;

const StyledSpan = styled.span`
  text-decoration: ${(props) =>
    props.textDecoration ? props.textDecoration : 'none'};
  color: ${(props) => props.color ? props.color : 'none'};
  font-size: ${(props) => props.fontSize ? props.fontSize : '14px'};
`;

const UserInfoButtonUI = ({name}) => {
  // 영어 버전에서 '님' 삭제
  const koName = name + ' 님';
  return (
    <>
      <Division src={division}/>
      <StyledSpan
        textDecoration={'underline'}
        color='#005196'
      >
        {koName}
      </StyledSpan>
        &ensp;&ensp;
    </>
  );
};
export default UserInfoButtonUI;
