import {styled} from 'styled-components';
import TitleWithBreakLine from '../atoms/TitleWithBreakLine';
import FormInputs from '../molecules/FormInputs';
import inputElements from './InputElements';
import {useNavigate} from 'react-router-dom';
import useModal from 'hooks/useModal';
import models from 'models';
import {generalConfigure as generalLoader} from 'routes/loader/LoaderConfig';
import useLayout from 'hooks/useLayout';
// import ChangePasswordModal from '../modal/ChangePasswordModal';
import ModifyPasswordModal from 'components/useInfo/modal/ModifyPasswordModal';
import {checkAppliedSpace} from 'components/useInfo/modal/Validations';

const StyledSignIn = styled.div`
  min-height: inherit;
`;

const ActionPageWrap = styled.div`
  width: 100%;
  height: 100%;
`;

const FormWrap = styled.div`
  height: 400px;
`;

export const getInitPageAndSetingFunc = (
    config,
    personalConfig,
    afterLoginInitSettingLayout) => {
  const configJson = config.generalConfigure;
  const defaultItem = personalConfig.defaultItem;

  let myPageInit =
  configJson?.general?.wiDefaultPage || 'DashAny';

  // const runmode = personalConfig.runMode;
  let runmode = personalConfig.grpRunMode;

  if (personalConfig.runMode != null) {
    runmode = personalConfig.runMode;
  }

  if (runmode === 'ADMIN') {
    if (defaultItem) {
      try {
        const jsonDefaultItem = JSON.parse(defaultItem);

        if (jsonDefaultItem.displayCheck) {
          if (jsonDefaultItem.initDisplay) {
            myPageInit = jsonDefaultItem.initDisplay;
          }
        }
      } catch (error) {
        myPageInit = 'DashAny';
      }
    }
  } else {
    myPageInit = 'Viewer';
  }

  // 로그인 후 state : initDisplay 변경 및 개인설정 셋팅.
  afterLoginInitSettingLayout(myPageInit, personalConfig);

  return myPageInit;
};

const SignIn = () => {
  const nav = useNavigate();
  const {alert, openModal} = useModal();
  const {afterLoginInitSettingLayout} = useLayout();

  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleWithBreakLine>Login</TitleWithBreakLine>
        <FormWrap>
          <FormInputs
            contents={inputElements()['login']}
            onSubmit={async (type) => {
              // 공백 포함 여부 정규식.
              const id = document.querySelector('#input-ID input').value;
              const password =
                document.querySelector('#input-Password input').value;
              if (checkAppliedSpace(id)) {
                alert('아이디 입력창에 공백이 포함 되어있습니다. 다시 입력해 주세요.');
                return;
              }
              if (checkAppliedSpace(password)) {
                alert('비밀번호 입력창에 공백이 포함 되어있습니다. 다시 입력해 주세요.');
                return;
              }
              try {
                const res = await models.Login.login(id, password);

                if (res.status == 200) {
                  let msg = '';
                  // TODO: 추후 함수로 이동
                  if (res?.data?.change === 1) {
                    msg = '초기 비밀번호 변경 필요합니다. 비밀번호를 변경해 주세요.';
                    openModal(ModifyPasswordModal,
                        {userId: id, msg: msg, type: 1});
                    document.querySelector('#input-Password input').value = '';
                    return;
                  }
                  if (res?.data?.change === 3) {
                    msg = '비밀번호 변경 후 3개월이 지났습니다. 비밀번호를 변경해 주세요.';
                    openModal(ModifyPasswordModal,
                        {userId: id, msg: msg, type: 3});
                    document.querySelector('#input-Password input').value = '';
                    return;
                  }
                  if (res?.data?.change === 4) {
                    msg = '비밀번호가 초기화 된 계정입니다. 비밀번호를 다시 변경해 주세요.';
                    openModal(ModifyPasswordModal,
                        {userId: id, msg: msg, type: 1});
                    document.querySelector('#input-Password input').value = '';
                    return;
                  }
                  if (type == 'portal') {
                    nav('portal');
                    return;
                  }
                  const personalConfig = res.data;
                  const config = await generalLoader();

                  const getInitPage =
                    getInitPageAndSetingFunc(
                        config,
                        personalConfig,
                        afterLoginInitSettingLayout);

                  // TODO: 추후 권한 적용
                  nav(getInitPage.toLowerCase());
                }
              } catch (error) {
                // 에러 발생 시 처리
                const status = error.response?.status || error.status;
                // 응답 상태 코드가 존재하는 경우
                if (status === 404) {
                  document.activeElement.blur();
                  alert('사용자 정보가 잘못되었습니다.');
                } else if (status === 500) {
                  document.activeElement.blur();
                  alert('서버에 문제가 발생하였습니다.');
                } else {
                  document.activeElement.blur();
                  alert('예기치 못한 오류가 발생하였습니다.');
                }
              }
            }}
          />
        </FormWrap>
        {/* forgot the password? */}
      </ActionPageWrap>
    </StyledSignIn>
  );
};
export default SignIn;
