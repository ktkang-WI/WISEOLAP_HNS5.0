import {styled} from 'styled-components';
import React from 'react';
import logo from '../../../../../assets/image/icon/report/logo2.png';

const StyeldImage = styled.img`
  height: ${(props) => props.height || '40px'};
  display: block;
`;

// TODO: 추후 환경설정에서 이미지 경로 불러와야 함.
const HeaderLogoImage = ({height = '40px'}) => {
  return (
    <StyeldImage src={logo} height={height}/>
  );
};

export default React.memo(HeaderLogoImage);
