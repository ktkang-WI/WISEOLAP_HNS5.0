import {styled} from 'styled-components';

const StyledContent = styled.div`
  padding-left: ${(props) => props.snbwidth || '0px'};
  height: calc(
  100vh - ${(props) => props.headerheight || '0px'} -
  ${(props) => props.ribbonheight || '0px'} -
  ${(props) => props.marginHeight}
  );
  width: calc(100vw - ${(props) => props.snbwidth || '0px'} - 10px);
`;

const Content = ({marginHeight = '30px', ...props}) => {
  return (
    <StyledContent
      marginHeight={marginHeight}
      {...props}
    />
  );
};

export default Content;
