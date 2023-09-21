import {styled} from 'styled-components';

const Button = styled.div`
  width: 20px;
  height: 20px;
  padding: 3px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  float: left;
  cursor: pointer;

  & + & {
    margin-left: 5px;
  }
`;

const Image = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const SmallImageButton = ({
  src,
  imgWidth='20px',
  imgHeight='auto',
  buttonWidth='20px',
  buttonHeight='20px',
  onClick,
  ...props
}) => {
  return (
    <Button
      width={buttonWidth}
      height={buttonHeight}
      onClick={onClick}
      {...props}
    >
      <Image
        src={src}
        width={imgWidth}
        height={imgHeight}
      />
    </Button>
  );
};

export default SmallImageButton;
