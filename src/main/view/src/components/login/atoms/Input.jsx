import {TextBox} from 'devextreme-react';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

const theme = getTheme();

const StyledTextBox = styled(TextBox)`
  border: 1px solid ${theme.color.gray400} !important;
  padding: 5px 10px !important;
  border-radius: 8px !important;
`;

const TextBoxLabel = styled.div`
  margin: 10px 5px;
  text-align: left;
  font-size: 14px;
  color: ${theme.color.gray400};
  font: ${theme.font.common};
  margin-top: 30px;
`;

const labelMapper = {
  'ID': '아이디',
  'Password': '비밀번호',
  'Email': '이메일'
};

const Input = ({contents, onSubmit}) => {
  const handleValidation = (contents, input) => {
    if (input === 'ID') {
      return contents.idCheckRule;
    } else if (input === 'Email') {
      return contents.emailRule;
    } else if (input === 'Password') {
      return contents.passwordRule;
    } else if (input === 'PasswordCheck') {
      return contents.passwordCheckRule;
    }
  };
  // TODO: 아이디저장 임시용
  const handleContentReady = (e) => {
    if (e.element.id === 'input-ID') {
      e.component.option('value', localStorage.getItem('sessionId'));
    }
  };
  const type = contents.type;
  return (
    <div>
      {
        contents.inputs.map(
            (input, index) => {
              return (
                <>
                  <TextBoxLabel>{labelMapper[input] || input}</TextBoxLabel>
                  <StyledTextBox
                    onEnterKey={onSubmit}
                    key={index}
                    id={'input-' + input}
                    onKeyDown={contents.onKeyDown}
                    onChange={contents?.onChange} // TODO: 아이디저장 임시용
                    mode={
                      input.includes('Password')?
                        contents.mode['Password'] : 'text'
                    }
                    onContentReady={
                      handleContentReady
                    }
                    maxLength={20}
                  >
                    {type === 'register' ?
                    handleValidation(contents, input) : ''}
                    {input === 'ID' ? contents.checkBtn : ''}
                  </StyledTextBox>
                </>
              );
            }
        )
      }
    </div>
  );
};
export default Input;
