const Group = ({title, children}) => {
  return (
    <div
      className='dx-field-group-wrapper'
      style={{
        width: '100%',
        textAlign: 'left',
        marginBottom: '20px'
      }}>
      <span className='dx-form-group-caption'>{title}</span>
      <div className='dx-form-group-content' style={{width: '100%'}}>
        {children}
      </div>
    </div>
  );
};

export default Group;
