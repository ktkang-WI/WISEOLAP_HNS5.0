import {styled} from 'styled-components';
// import '../SignIn.css';
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
  padding-top: 50px;
`;

const Register = () => {
  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleWithBreakLine>Register</TitleWithBreakLine>
        <FormWrap>
          <FormInputs
            contents={inputElements()['register']}
          />
        </FormWrap>
      </ActionPageWrap>
    </StyledSignIn>
  );
};
export default Register;
