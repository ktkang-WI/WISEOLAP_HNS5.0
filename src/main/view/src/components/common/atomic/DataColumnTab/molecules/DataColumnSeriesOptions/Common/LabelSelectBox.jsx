import {SelectBox} from 'devextreme-react';

export const LabelSelectBox = ({value, onValueChanged, items, ...props}) => {
  return (
    <div className="dx-field">
      <div className="dx-field-label">{props.label}</div>
      <div className="dx-field-value">
        <SelectBox
          onValueChanged={onValueChanged}
          items={items}
          defaultValue={value}
        />
      </div>
    </div>
  );
};
