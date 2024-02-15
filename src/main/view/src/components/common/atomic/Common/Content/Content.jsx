import {styled} from 'styled-components';

const StyledContent = styled.div`
  padding-left: ${(props) => props.snbWidth || '0px'};
  height: calc(
    100vh - ${(props) => props.headerHeight || '0px'} -
    ${(props) => props.ribbonHeight || '0px'} - 30px
  );
  width: calc(100vw - ${(props) => props.snbWidth || '0px'} - 10px);
`;

const Content = ({...props}) => {
  return (
    <StyledContent
      {...props}
    />
  );
};

export default Content;
