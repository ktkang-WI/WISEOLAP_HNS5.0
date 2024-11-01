import {TextBox} from 'devextreme-react';

export const LabelTextBox = ({value, onValueChanged, items, ...props}) => {
  return (
    <div className="dx-field">
      <div className="dx-field-label">{props.label}</div>
      <div className="dx-field-value">
        <TextBox
          onValueChange={onValueChanged}
          defaultValue={value}
        />
      </div>
    </div>
  );
};
