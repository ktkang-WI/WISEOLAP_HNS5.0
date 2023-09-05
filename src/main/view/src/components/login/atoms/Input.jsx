import {TextBox} from 'devextreme-react';

const Input = ({contents}) => {
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
  const type = contents.type;
  return (
    <div>
      {
        contents.inputs.map(
            (input, index) =>
              <TextBox
                key={index}
                label={input}
                labelMode={contents.labelMode}
                onKeyDown={contents.onKeyDown}
                mode={
                  input.includes('Password')? contents.mode['Password'] : 'text'
                }
                maxLength={20}
              >
                {type === 'register' ? handleValidation(contents, input) : ''}
                {input === 'ID' ? contents.checkBtn : ''}
              </TextBox>
        )
      }
    </div>
  );
};
export default Input;
