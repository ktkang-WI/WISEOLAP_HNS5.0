import {CheckBox} from 'devextreme-react';

export const LabelCheckBox = ({onValueChanged, ...props}) => {
  return (
    <div className="dx-field">
      <div className="dx-field-label">{props.label}</div>
      <div className="dx-field-value">
        <CheckBox
          onValueChanged={onValueChanged}
          defaultValue={props.checked}
        />
      </div>
    </div>
  );
};
