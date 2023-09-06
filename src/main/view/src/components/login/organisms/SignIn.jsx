import {styled} from 'styled-components';
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
  padding-top: 100px;
`;

const SignIn = () => {
  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleImage type={'login'}/>
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
