
export const FieldSet = ({children}) => {
  return (
    <div className="dx-fieldset">
      {children}
    </div>
  );
};

export const Field = ({children}) => {
  return (
    <div className="dx-field">
      {children}
    </div>
  );
};

export const FieldLabel = ({children}) => {
  return (
    <div className="dx-field-label">
      {children}
    </div>
  );
};

export const FieldValue = ({children}) => {
  return (
    <div className="dx-field-value">
      {children}
    </div>
  );
};
