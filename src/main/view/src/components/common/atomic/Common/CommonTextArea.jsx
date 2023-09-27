import {TextArea} from 'devextreme-react';

const CommonTextArea = (props) => {
  return (
    <TextArea
      width={'100%'}
      height={'100%'}
      readOnly={true}
      {...props}
    />
  );
};

export default CommonTextArea;
