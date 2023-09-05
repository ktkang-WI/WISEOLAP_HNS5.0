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

const SignIn = () => {
  return (
    <StyledSignIn>
      <ActionPageWrap>
        <TitleImage type={'login'}/>
        <FormInputs
          contents={inputElements()['login']}
        />
        forgot the password?
      </ActionPageWrap>
    </StyledSignIn>
  );
};
export default SignIn;
