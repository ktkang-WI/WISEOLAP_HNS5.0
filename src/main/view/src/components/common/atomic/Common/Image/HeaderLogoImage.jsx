import {styled} from 'styled-components';
import React from 'react';
import logo from 'assets/image/logo/logo_wi_word2.png';

const StyeldImage = styled.img`
  height: 45px;
  width: auto;
  display: block;
`;

// TODO: 추후 환경설정에서 이미지 경로 불러와야 함.
const HeaderLogoImage = ({id}) => {
  return (
    <StyeldImage id={id} src={logo}/>
  );
};

export default React.memo(HeaderLogoImage);
