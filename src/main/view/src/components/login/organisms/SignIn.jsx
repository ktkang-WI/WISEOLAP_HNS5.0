import {styled} from 'styled-components';
import TitleWithBreakLine from '../atoms/TitleWithBreakLine';
import FormInputs from '../molecules/FormInputs';
import inputElements from './InputElements';

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
  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleWithBreakLine>Login</TitleWithBreakLine>
        <FormWrap>
          <FormInputs
            contents={inputElements()['login']}
          />
        </FormWrap>
        {/* forgot the password? */}
      </ActionPageWrap>
    </StyledSignIn>
  );
};
export default SignIn;
