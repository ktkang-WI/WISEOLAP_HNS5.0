import styled from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';
import HeaderPanel from '../../Common/Panel/HeaderPanel';
import logout from 'assets/image/icon/button/logout.png';
import mypage from 'assets/image/icon/button/mypage.png';
import {useNavigate} from 'react-router-dom';
import useModal from 'hooks/useModal';
import models from 'models';
import {contextPath} from 'routes/Router';
import localizedString from 'config/localization';

const StyledDiv = styled.div`
  width: auto;
  float: left;
  & img: nth-child(n+1) {
    padding-left: 18px;
  }
`;

const StyledImg = styled.img`
  src: ${(props) => props.src};
  padding-right: 8px;
`;

const UserInfoPopover = () => {
  const nav = useNavigate();
  const {confirm} = useModal();
  const defaultPath = contextPath + '/';

  return (
    <StyledDiv>
      <HeaderPanel
        width={'auto'}
      >
        <CommonButton
          height={'32px'}
          type='onlyImageText'
          onClick={() => {
            confirm(localizedString.confirmLogoutMsg, () => {
              models.Login.logout().then((response) => {
                if (response.status == 200 ) {
                  nav(defaultPath);
                }
              }).catch(() => {
                throw new Error(localizedString.failedLogout);
              });
            });
          }}
        >
          <StyledImg src={logout}/>
          {localizedString.logout}
        </CommonButton>
      </HeaderPanel>
      <HeaderPanel
        width={'auto'}
      >
        <CommonButton
          height={'32px'}
          type='onlyImageText'
          onClick={() => {
            nav('/editds/mypageuserinfo');
          }}
        >
          <StyledImg src={mypage}/>
          {localizedString.mypage}
        </CommonButton>
      </HeaderPanel>
    </StyledDiv>
  );
};

export default UserInfoPopover;
