import {styled} from 'styled-components';
import TitleWithBreakLine from '../atoms/TitleWithBreakLine';
import FormInputs from '../molecules/FormInputs';
import inputElements from './InputElements';
import {useNavigate} from 'react-router-dom';
import useModal from 'hooks/useModal';
import models from 'models';

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

const SignIn = () => {
  const nav = useNavigate();
  const {alert} = useModal();

  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleWithBreakLine>Login</TitleWithBreakLine>
        <FormWrap>
          <FormInputs
            contents={inputElements()['login']}
            onSubmit={async () => {
              const id = document.querySelector('#input-ID input').value;
              const password =
                document.querySelector('#input-Password input').value;
              const res = await models.Login.login(id, password);

              if (res.status == 200) {
                // TODO: 추후 권한 적용
                // 임시적용 하드코딩
                nav('dashany');
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
