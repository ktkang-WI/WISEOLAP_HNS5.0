import {Form} from 'devextreme-react';
import {
  CompareRule,
  Item,
  Label,
  RequiredRule,
  StringLengthRule
} from 'devextreme-react/form';
import React, {useCallback, useState} from 'react';
import {preventInputSpaceBar} from './Validations';
import localizedString from 'config/localization';

const ModifyPasswordForm = ({...props}, ref) => {
  const [inputPw, setInputPw] = useState('');
  const validateForm = useCallback((e) => {
    e.component.validate();
  }, []);

  return (
    <Form
      onContentReady={validateForm}
      ref={ref}
    >
      <Item
        dataField='currPassword'
        editorType='dxTextBox'
        editorOptions={{
          mode: 'password',
          valueChangeEvent: 'keyup',
          onKeyDown: preventInputSpaceBar
        }}
      >
        <RequiredRule message={localizedString.required}/>
        <Label showColon={false}>
          {localizedString.currentPassword}
        </Label>
      </Item>
      <Item
        dataField='newPassword'
        editorType='dxTextBox'
        editorOptions={{
          mode: 'password',
          valueChangeEvent: 'keyup',
          onValueChanged: (e) => {
            setInputPw(e.value);
          },
          onKeyDown: preventInputSpaceBar
        }}
      >
        <RequiredRule message={localizedString.required}/>
        <StringLengthRule
          min={6} max={15}
          message={localizedString.lengthValidation}
        />
        <Label showColon={false}>
          {localizedString.newPassword}
        </Label>
      </Item>
      <Item
        dataField='checkPassword'
        editorType='dxTextBox'
        editorOptions={{
          mode: 'password',
          valueChangeEvent: 'keyup',
          onKeyDown: preventInputSpaceBar
        }}
      >
        <RequiredRule message={localizedString.required}/>
        <CompareRule
          message={localizedString.pwInconsistency}
          comparisonTarget={() => inputPw}
        />
        <Label showColon={false}>
          {localizedString.passwordConfirm}
        </Label>
      </Item>
    </Form>
  );
};
export default React.forwardRef(ModifyPasswordForm);
