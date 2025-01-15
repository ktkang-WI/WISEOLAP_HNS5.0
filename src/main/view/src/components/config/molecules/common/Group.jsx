const Group = ({title, children, width}) => {
  return (
    <div
      className='dx-field-group-wrapper'
      style={{
        width: width || '100%',
        textAlign: 'left',
        marginBottom: '20px',
        padding: '10px'
      }}>
      <span className='dx-form-group-caption'>{title}</span>
      <div className='dx-form-group-content' style={{width: '100%'}}>
        {children}
      </div>
    </div>
  );
};

export default Group;
