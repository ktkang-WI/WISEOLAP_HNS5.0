
export const FieldSet = ({children}) => {
  return (
    <div className="dx-fieldset">
      {children}
    </div>
  );
};

export const Field = ({children}) => {
  return (
    <div
      className="dx-field"
      style={{
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {children}
    </div>
  );
};

export const FieldLabel = ({children}) => {
  return (
    <div
      className="dx-field-label"
      style={{
        flex: 1
      }}
    >
      {children}
    </div>
  );
};

export const FieldValue = ({children}) => {
  return (
    <div
      className="dx-field-value"
      style={{
        flex: 1
      }}
    >
      {children}
    </div>
  );
};
