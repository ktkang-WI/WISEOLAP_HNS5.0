import styled from 'styled-components';

const TitlePanel = styled.div`
  padding: 0px 0px 5px 10px;
  background-color: #fafafa;
  background-image: linear-gradient(#ececed, #fafafa, #ececed);
  border-radius: 5px;
`;

const PopoverTitlePanel = ({children}) => {
  return (
    <TitlePanel>
      {children}
    </TitlePanel>
  );
};
export default PopoverTitlePanel;
