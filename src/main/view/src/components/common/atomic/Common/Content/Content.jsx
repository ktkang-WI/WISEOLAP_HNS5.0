import {styled} from 'styled-components';

const StyledContent = styled.div`
  padding-left: ${(props) => props.snbWidth || '0px'};
  height: calc(
  100vh - ${(props) => props.headerHeight || '0px'} -
  ${(props) => props.ribbonHeight || '0px'} -
  ${(props) => props.marginHeight}
  );
  width: calc(100vw - 10px);
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
