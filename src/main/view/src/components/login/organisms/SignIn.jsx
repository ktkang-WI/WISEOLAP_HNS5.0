import {styled} from 'styled-components';
import TitleWithBreakLine from '../atoms/TitleWithBreakLine';
import FormInputs from '../molecules/FormInputs';
import inputElements from './InputElements';
import {useNavigate} from 'react-router-dom';
import useModal from 'hooks/useModal';
import models from 'models';
import {generalConfigure as generalLoader} from 'routes/loader/LoaderConfig';
import useLayout from 'hooks/useLayout';

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
  const {alert} = useModal();
  const {afterLoginInitSettingLayout} = useLayout();

  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleWithBreakLine>Login</TitleWithBreakLine>
        <FormWrap>
          <FormInputs
            contents={inputElements()['login']}
            onSubmit={async (type) => {
              const id = document.querySelector('#input-ID input').value;
              const password =
                document.querySelector('#input-Password input').value;
              const res = await models.Login.login(id, password);

              if (res.status == 200) {
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
              } else if (res.response?.status == 404) {
                document.activeElement.blur();
                alert('사용자 정보가 잘못되었습니다.');
              } else if (res.response?.status == 500) {
                document.activeElement.blur();
                alert('서버에 문제가 발생하였습니다.');
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
