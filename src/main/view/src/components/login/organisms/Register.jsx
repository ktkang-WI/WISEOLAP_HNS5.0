import {styled} from 'styled-components';
// import '../SignIn.css';
import TitleImage from '../atoms/TitleImage';
import FormInputs from '../molecules/FormInputs';
import inputElements from './InputElements';

const StyledSignIn = styled.div`
  margin-left: 50%;
  min-height: inherit;
`;

const ActionPageWrap = styled.div`
  width: 60%;
  height: 100%;
  padding: 134px 112px 0;
`;

const FormWrap = styled.div`
  height: 400px;
  padding-top: 50px;
`;

const Register = () => {
  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleImage type={'register'}/>
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
