import styled from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';
import HeaderPanel from '../../Common/Panel/HeaderPanel';
import logout from 'assets/image/icon/button/logout.png';
import mypage from 'assets/image/icon/button/mypage.png';
// import manual from 'assets/image/icon/button/manual.png';
import {useNavigate} from 'react-router-dom';
import useModal from 'hooks/useModal';
import models from 'models';
import {contextPath} from 'routes/Router';
import localizedString from 'config/localization';
import store from 'redux/modules';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import useReportSave from 'hooks/useReportSave';

const StyledDiv = styled.div`
  width: auto;
  float: left;

  & img:nth-child(n+1) {
    margin-left: 18px;
  }
`;

const StyledImg = styled.img`
  margin-right: 8px;
  width: 20px;
  height: 20px;
`;

const UserInfoPopover = () => {
  const nav = useNavigate();
  const {confirm} = useModal();
  const defaultPath = contextPath + '/';
  const {reload} = useReportSave();
  const reportType = selectCurrentDesignerMode(store.getState());

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
                  reload(reportType);
                  nav(defaultPath);
                }
              }).catch(({response}) => {
                if (response.status == 401) {
                  reload(reportType);
                  nav(defaultPath);
                } else {
                  throw new Error(localizedString.failedLogout);
                }
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
      {/* <HeaderPanel
        width={'auto'}
      >
        <CommonButton
          height={'32px'}
          type='onlyImageText'
          onClick={() => {
            const fileUrl = `${process.env.PUBLIC_URL}/example.pdf`;
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'example.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <StyledImg src={manual}/>
          매뉴얼 다운로드
        </CommonButton>
      </HeaderPanel> */}
    </StyledDiv>
  );
};

export default UserInfoPopover;
